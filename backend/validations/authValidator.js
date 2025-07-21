
const { check  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')





exports.loginValidator = [
  
  check('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email format'),

  check('password')
  .notEmpty().withMessage('Password is required')
  .isLength({min:6}).withMessage('Password must be at least 6 characters long'),

  validatorMiddleware
]