const express = require('express');
const { login } = require('../controller/authController');

const authRouter = express.Router();

authRouter.post('/auth', login);

module.exports = { authRouter };