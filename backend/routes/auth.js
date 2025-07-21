const express = require('express');
const { login } = require('../controller/authController');
const {loginValidator} = require('../validations/authValidator')
const authRouter = express.Router();

authRouter.post('/auth', loginValidator, login);

module.exports = { authRouter };