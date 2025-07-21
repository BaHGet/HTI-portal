
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const { comparing } = require('../utils/hashingPass');
const { createToken } = require('../middlewares/authMiddleware');
const ApiError = require('../utils/apiError');
const {verifyToken} = require('../middlewares/authMiddleware')




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




module.exports = { 
  login,
  protect,
  restrictTo
 }