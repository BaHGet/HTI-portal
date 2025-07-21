const express = require('express');
const {getAllUsers, addUser, getUser} = require('../controller/user');
const { VerifyToken } = require('../middlewares/authMiddleware');

const {
  getUserValidator,
  addUserValidator
} = require('../validations/userValidation')
const userRouter = express.Router();

userRouter.get('/getallusers', getAllUsers)
userRouter.get('/getuser', getUserValidator,VerifyToken, getUser)
userRouter.post('/adduser', addUserValidator,addUser)

module.exports = {userRouter}; 