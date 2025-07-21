const express = require('express');

const {protect,restrictTo} = require('../controller/authController');

const {
  getAllUsers,
  addUser, 
  getUser,
  chandeUserRole,
  getLoggedUserData,
  updateLoggedUserPassword
} = require('../controller/user');

const {
  getUserValidator,
  addUserValidator
} = require('../validations/userValidation');



const userRouter = express.Router();
// User Routes
userRouter.get('/getme', protect, getLoggedUserData)
userRouter.put('/changemypassword', protect, updateLoggedUserPassword)

// Admin Routes
userRouter.get('/getallusers', protect, restrictTo('admin'), getAllUsers)
userRouter.get('/getuser', protect, restrictTo('admin'), getUserValidator, getUser)
userRouter.post('/adduser', protect, restrictTo('admin'), addUserValidator,addUser)
userRouter.delete('/changerole', protect, restrictTo('admin'), chandeUserRole)

module.exports = {userRouter}; 