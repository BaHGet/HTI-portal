const express = require('express');
const {getAllStudent, getStudentById} = require('../controller/user')
const userRouter = express.Router();

userRouter.get('/all', getAllStudent);
userRouter.post('/all', getStudentById);

module.exports = {userRouter}; 
