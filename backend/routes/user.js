const express = require('express');
const {getAllUsers, addUser, getUser} = require('../controller/user');
const { VerifyToken } = require('../middlewares/authMiddleware');
const {getUserValidator,addUserValidator} = require('../validations/userValidation');
const {protect,restrictTo} = require('../controller/authController');

const userRouter = express.Router();

userRouter.get('/getallusers', protect, restrictTo('admin'), getAllUsers)
userRouter.get('/getuser', protect, restrictTo('admin'), getUserValidator, getUser)
userRouter.post('/adduser', protect, restrictTo('admin'), addUserValidator,addUser)

module.exports = {userRouter}; 