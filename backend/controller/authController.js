
const crypto = require('crypto')
const asyncHandler = require('express-async-handler');


const User = require('../models/users');
const { comparing } = require('../utils/hashingPass');
const { createToken, verifyToken } = require('../middlewares/authMiddleware');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');



const login = async (req, res) => {
  // data to validate user with
  const user = req.body
  try {
    const checkUser = await User.findOne({ email: user.email /* maybe the user id or whatever */ });
    if (!checkUser) return res.status(400).send('Invalid User');

    const validPass = await comparing(user.password, checkUser.passwordHash);
    if (!validPass) return res.status(400).send('Invalid Password');

    const token = createToken({ email: user.email })
    res.header('token', token);
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
};

const protect = asyncHandler(async (req,res,next) => {

  // 1) check if token exist, if exist ==> get
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ApiError('You are not logged in, please login to get access', 401));
  }

  // 2) verify token (nochange happens, expired token)
  const decoded = verifyToken(token) 

  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId)
  if (!currentUser) {
    return next(new ApiError('User that belong to that token no longer exist', 401));
  }
  // 4) check if user change his pass after token created
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
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403))
    }
    next();
});

const forgotPassword = asyncHandler(async (req,res,next) => {
  // 1) get user email
  const user = await User.findOne({email:req.body.email})
  if (!user) {
    return next(new ApiError('No User for this Email', 404))
  }
  // 2) if user exist, generate hash random 6 digits and save it in db 
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

  // save hased password reset code in db
  user.passwordResetCode = hashedResetCode;
  // add exp time for reset code (1 min)
  user.passwordResetExpires = Date.now() + 60*1000
  user.passwordResetVerified = false;

  user.save()
  // 3) send the reset code via email (./utils/sendEmail)
  try{
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      message: `Your RestCode is ${resetCode}, (valid for 10 min)`
    })
  }catch(err){
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save()
    return next(new ApiError('There is a problem in sending email', 500))
  }

  res.status(200).json({status:"sucess", message:"Reset code sent to your email"})
})

const verifyPassResetCode = asyncHandler( async (req,res,next)=>{
  // 1)get user based on reset code
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


  // 2) Reset code vaild
  user.passwordResetVerified = true
  await user.save()

  res.status(200).json({status: "Success"})


})

const resetPassword = asyncHandler( async (req,res,next)=>{
  // 1) check user email 
  const user = await User.findOne({email: req.body.email})
  if(!user){
    return next(new ApiError(`this email ${req.body.email}  not found`, 404))
  }
  // 2) check reset code verified
  if (!user.passwordResetVerified){
    return next(new ApiError("Password Reset Code is not verified", 404))
  }

  // 3) create new password
  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save()

  // 4) generate token
  const token = createToken({ email: user.email });
  res.status(200).json({ token });
})


module.exports = { 
  login,
  protect,
  restrictTo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
 }