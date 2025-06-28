const express = require('express');
const {getAllUsers, addUser, getUser} = require('../controller/user');
const { VerifyToken } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.get('/getallusers', getAllUsers)
userRouter.get('/getuser', VerifyToken, getUser)
userRouter.post('/adduser', addUser)

module.exports = {userRouter}; 