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
  resestPasswordValidator
} = require('../validations/authValidator')


const authRouter = express.Router();

authRouter.post('/login', loginValidator, login);
authRouter.post('/forgotpassword', forgetPasswordValidator, forgotPassword);
authRouter.post('/verifyresetcode', verifyPassResetCode);
authRouter.put('/resetpassword', resestPasswordValidator, resetPassword);


module.exports = { authRouter };