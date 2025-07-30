
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

exports.forgetPasswordValidator = [
  
  check('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email format'),

  validatorMiddleware
]


exports.resestPasswordValidator = [
  
  check('NewPassword')
  .notEmpty().withMessage('Password is required')
  .isLength({min:6}).withMessage('Password must be at least 6 characters long'),
  
  check('ConfirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.NewPassword) {
        throw new Error('Confirm password must match new password');
      }
      return true;
    }),

  validatorMiddleware
]