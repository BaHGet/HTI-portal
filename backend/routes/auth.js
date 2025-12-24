const express = require('express');

const { 
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
} = require('../controller/authController');

const {
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator
} = require('../validations/authValidator')

const {
  authLimiter
} = require ('../utils/rateLimiter')

const authRouter = express.Router();

authRouter.post('/login', authLimiter, loginValidator, login);
authRouter.post('/forgotpassword', forgetPasswordValidator, forgotPassword);
authRouter.post('/verifyresetcode', verifyPassResetCode);
authRouter.put('/resetpassword', resetPasswordValidator, resetPassword);


module.exports = { authRouter };