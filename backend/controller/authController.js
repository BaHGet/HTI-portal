const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const asyncHandler = require('express-async-handler');

const db = require('../models/index')
const { comparing, Hashing } = require('../utils/hashingPass');
const { createToken } = require('../middlewares/authMiddleware');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');
const logger = require('../utils/logger');


const login = async (req, res, next) => {
  logger.info(`the endpoint ${req.route.path} was called from user with email ${req.body.Email}`);
  
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const checkUser = await db.User.findOne({
      where: { Email: email },
      attributes: ['UserID', 'Email', 'PasswordHash', 'AccountType'] 
    });

    if (!checkUser) return res.status(400).send('Invalid email or password');

    // 2. Check Password
    const validPass = await comparing(password, checkUser.PasswordHash);
    if (!validPass) return res.status(400).send('Invalid email or password');

    const token = createToken({ id: checkUser.UserID, email: checkUser.Email, role: checkUser.AccountType });

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res
      .status(200)
      .cookie('jwt', token, cookieOptions) 
      .json({
        status: 'success',
        message: 'Logged in successfully',
      });

  } catch (err) {
    logger.error(`${err.status || 500} - ${err.message}`);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
};

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  //   token = req.headers.authorization.split(' ')[1];
  // }
  // if (!token) {
  //   return next(new ApiError('You are not logged in, please login to get access', 401));
  // }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return next(new ApiError('Invalid token, please login again', 401));
  }
  const currentUser = await db.User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new ApiError('User that belong to that token no longer exist', 401));
  }
  if (currentUser.PasswordChangedAt) {
    const passChangeTimestamp = parseInt(currentUser.PasswordChangedAt.getTime() / 1000, 10);
    if (passChangeTimestamp > decoded.iat) {
      return next(new ApiError("User changed password recently", 401));
    }
  }
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => 
  asyncHandler(async (req, res, next) => {
    
    if (!roles.includes(req.user.AccountType)) {
      return next(new ApiError('You do not have permission to perform this action', 403))
    }
    next();
});


const forgotPassword = asyncHandler(async (req,res,next) => {
  const { email } = req.body;
  logger.info(`the endpoint ${req.route.path} was called from user with email ${email}`)
  const user = await db.User.findOne({ where: { Email: email } });
  if (!user) {
    return next(new ApiError('No User for this Email', 404))
  }
  
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

  user.PasswordResetCode = hashedResetCode;
  user.PasswordResetExpires = Date.now() + 2*60*1000
  user.PasswordResetVerified = false;

  await user.save()
  try{
    await sendEmail({
      email: user.Email,
      subject: 'Password Reset Code',
      message: `Your RestCode is ${resetCode}, (valid for 2 min)`
    })
  }catch(err){
    user.PasswordResetCode = null;
    user.PasswordResetExpires = null;
    user.PasswordResetVerified = null;

    await user.save()
    return next(new ApiError('There is a problem in sending email', 500))
  }

  res.status(200).json({status:"success", message:"Reset code sent to your email"})
})

const verifyPassResetCode = asyncHandler( async (req,res,next)=>{
  logger.info(`the endpoint ${req.route.path} has been accessed`)
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex')
  
  const user = await db.User.findOne({
    where: {
      PasswordResetCode: hashedResetCode,
      PasswordResetExpires: {
        [Op.gt]: Date.now() 
      }
    }
  })

  if (!user) {
    return next(new ApiError("Reset Code Invalid", 404))
  }

  
  user.PasswordResetVerified  = true
  await user.save()

  const resetToken = jwt.sign( { id: user.UserID } , process.env.TOKEN_SECRET, {expiresIn: '30min'} )
  res.header('reset-token',resetToken);
  res.status(200).json({status: "Success"})

})

const resetPassword = asyncHandler( async (req,res,next)=>{
  logger.info(`the endpoint ${req.route.path} has been accessed`)
  try {
    // 1) Get reset-token from header
    const resetToken = req.headers['reset-token'];
    if (!resetToken) {
      console.log("1");
      return next(new ApiError("Reset token is missing", 401));
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.TOKEN_SECRET);
    } catch (err) {
      console.log("2");
      return next(new ApiError("Invalid or expired reset token", 401));
    }

    // 3) Find user by email inside the token
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log("3");
      return next(new ApiError("User not found", 404));
    }

    // 4) Check if reset code was verified
    if (!user.PasswordResetVerified) {
      console.log("4");
      return next(new ApiError("Reset code is not verified", 403));
    }

    // 5) Hash new password and reset fields
    user.PasswordHash  = await Hashing(req.body.NewPassword);
    user.PasswordResetCode  = null;
    user.PasswordResetExpires = null;
    user.PasswordResetVerified = null;

    await user.save()

    // 6) generate token
    const token  = createToken({ id: user.UserID, email: user.Email });
    res.header('token',token);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})



module.exports = { 
  login,
  protect,
  restrictTo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
 }