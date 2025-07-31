const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const userModel = require('../models/users')
const ApiError = require('../utils/apiError');
const { Hashing } = require('../utils/hashingPass')
const { createToken } = require('../middlewares/authMiddleware');

const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
  logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user._id.toString()}`)
  try {
      const users = await userModel.find({}).select(['fullName', 'email'])
      // check if the users exists
      if(!users){
        new Error('Intrnal Server Error')
      }
      res.json({success: true, users})

  } catch (error) {
      logger.error(`${err.status || 500} - ${err.message}`);
      res.status(500).json({success: false, message: "Something went wrong", error})
  }
}

const addUser = async (req, res) => {
    const userData = req.body;
    try {
        userData.passwordHash = await Hashing(userData.password)
        delete userData.password
        const newUser = new userModel(userData);
        await newUser.save();
        res.status(201).json({ success: true, message: "user added successfully" });
    } catch (error) {
         logger.error(`${err.status || 500} - ${err.message}`);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


const getUser = async (req, res) => {
    try {
        const user = req.body;

        const userData = await userModel.findOne({email:user.email});
        delete userData.passwordHash;
        res.status(200).json({success : true, userData})
    } catch (error) {
        logger.error(`${err.status || 500} - ${err.message}`);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

const changeUserRole = asyncHandler( async (req,res,next)=>{
  const updatedUser = await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      accountType: req.body.accountType,
      phone: req.body.phone,
    },
    {new: true}
  )

  res.status(200).json({ data: updatedUser })

})


const getLoggedUserData = asyncHandler(async(req,res,next)=>{
  res.status(200).json({
    status: 'success',
    data: req.user
  });
  next();
})


const updateLoggedUserPassword = asyncHandler(async(req,res,next)=>{

  // 1) Get user from database
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // 2) Check Current Password is correct
  const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.passwordHash); 
  if (!isCorrectPassword) {
    return next(new ApiError('Current password is incorrect', 401));
  }

  // 3) Hash the new password and update it
  user.passwordHash = await Hashing(req.body.newPassword);
  user.passwordChangedAt = Date.now();
  await user.save()

  // 4) generate token and send response
  const token = createToken({ email: user.email });
  res.header('token',token);
  res.status(200).json({data: user})
})


module.exports = {
    getAllUsers, 
    addUser, 
    getUser,
    changeUserRole,
    getLoggedUserData,
    updateLoggedUserPassword
}