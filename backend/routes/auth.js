const express = require('express');

const { 
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
} = require('../controller/authController');

const {loginValidator} = require('../validations/authValidator')


const authRouter = express.Router();

authRouter.post('/login', loginValidator, login);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post('/verifyresetcode', verifyPassResetCode);
authRouter.post('/resetpassword', resetPassword);


module.exports = { authRouter };