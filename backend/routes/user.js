const express = require('express');

const {protect,restrictTo} = require('../controller/authController');

const {
  getAllUsers,
  addUser, 
  getUser,
  changeUserRole,
  getLoggedUserData,
  updateLoggedUserPassword
} = require('../controller/user');

const {
  getUserValidator,
  addUserValidator,
  changeUserRoleValidation
} = require('../validations/userValidation');



const userRouter = express.Router();
// User Routes
userRouter.get('/getme', protect, getLoggedUserData)
userRouter.put('/changemypassword', protect, updateLoggedUserPassword)

// Admin Routes
userRouter.get('/getallusers', protect, restrictTo('admin'), getAllUsers)
userRouter.get('/getuser', protect, restrictTo('admin'), getUserValidator, getUser)
userRouter.post('/adduser', protect, restrictTo('admin'), addUserValidator, addUser)
userRouter.put('/changerole', protect, restrictTo('admin'), changeUserRoleValidation, changeUserRole)

module.exports = {userRouter}; 