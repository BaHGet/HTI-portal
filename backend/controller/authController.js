const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const asyncHandler = require('express-async-handler');


const User = require('../models/users');
const { comparing, Hashing } = require('../utils/hashingPass');
const { createToken } = require('../middlewares/authMiddleware');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');

const logger = require('../utils/logger');


const login = async (req, res) => {
  logger.info(`the endpoint ${req.route.path} was called from user with email ${req.body.email.toString()}`)
  // data to validate user with
  const user = req.body
  try {
    const checkUser = await User.findOne({ email: user.email }).select('+passwordHash');
    if (!checkUser) return res.status(400).send('Invalid email or password');

    const validPass = await comparing(user.password, checkUser.passwordHash);
    if (!validPass) return res.status(400).send('Invalid email or password');

    const token = createToken({ email: user.email })
    res.header('token',token);
    res.status(200).send()
  } catch (err) {
    logger.error(`${err.status || 500} - ${err.message}`);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
};

const protect = asyncHandler(async (req,res,next) => {

  let token;
  if (req.headers.authorization  && req.headers.authorization .startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ApiError('You are not logged in, please login to get access', 401));
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

  const currentUser = await  User.findOne({ email: decoded.email });
  if (!currentUser) {
    return next(new ApiError('User that belong to that token no longer exist', 401));
  }
  if (currentUser.passwordChangedAt) {
    const passChangeTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10);
    if (passChangeTimestamp > decoded.iat ){
      return next(new ApiError("User changed password recently",401))
    }
  } 
  
  req.user = currentUser;
  next();
})

const restrictTo = (...roles) => 
  asyncHandler(async (req, res, next) => {
    
    if (!roles.includes(req.user.accountType)) {
      return next(new ApiError('You do not have permission to perform this action', 403))
    }
    next();
});


const forgotPassword = asyncHandler(async (req,res,next) => {
  const { email } = req.body;
  logger.info(`the endpoint ${req.route.path} was called from user with email ${email.toString()}`)
  const user = await User.findOne({email})
  if (!user) {
    return next(new ApiError('No User for this Email', 404))
  }
  
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 2*60*1000
  user.passwordResetVerified = false;

  user.save()
  try{
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      message: `Your RestCode is ${resetCode}, (valid for 2 min)`
    })
  }catch(err){
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

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
  
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: {$gt:Date.now()}})

  if (!user) {
    return next(new ApiError("Reset Code Invalid", 404))
  }

  
  user.passwordResetVerified = true
  await user.save()

  const resetToken = jwt.sign( { email: user.email } , process.env.TOKEN_SECRET, {expiresIn: '30min'} )
  res.header('reset-token',resetToken);
  res.status(200).json({status: "Success"})

})

const resetPassword = asyncHandler( async (req,res,next)=>{
  logger.info(`the endpoint ${req.route.path} has been accessed`)
  // 1) Get reset-token from header
  const resetToken = req.headers['reset-token'];
  if (!resetToken) {
    return next(new ApiError("Reset token is missing", 401));
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.TOKEN_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired reset token", 401));
  }

  // 3) Find user by email inside the token
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // 4) Check if reset code was verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 403));
  }

  // 5) Hash new password and reset fields
  user.passwordHash = await Hashing(req.body.NewPassword);
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save()

  // 6) generate token
  const token  = createToken({ email: user.email });
  res.header('token',token);
  res.status(200).send();
})



module.exports = { 
  login,
  protect,
  restrictTo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
 }