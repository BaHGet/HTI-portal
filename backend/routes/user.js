const express = require('express');
const {getAllUsers, addUser, getUserById} = require('../controller/user')

const userRouter = express.Router();

userRouter.get('/getallusers', getAllUsers)
userRouter.get('/getoneuser', getUserById)
userRouter.post('/add-newuser', addUser)

module.exports = {userRouter}; 
