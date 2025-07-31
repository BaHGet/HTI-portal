const  {check}  = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')
const User = require('../models/users');



exports.getUserValidator=[
  // 1- rules
  check('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email format'),
  // 2-middleware
  validatorMiddleware
]

exports.addUserValidator=[
  check('fullName').notEmpty().withMessage('User required')
  .isLength({min:3}).withMessage('Name is too short')
  .custom( (val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email format')
 .custom(async (val) => {
    const user = await User.findOne({ email: val });
    if (user) {
      throw new Error('Email already in use');
    }
  }),
  check('password')
  .notEmpty().withMessage('Password is required')
  .isLength({min:6}).withMessage('Password must be at least 6 characters long'),

  check('nationalId').notEmpty().withMessage('National Id must be 14 unique digits '),

  check('accountType').optional().isIn(["student", "staff", "admin", "Graduated"]).withMessage('Role must be either user or admin'),

  check('phoneNumber').isMobilePhone("ar-EG").withMessage('Invalid phone number'),
  validatorMiddleware
]

exports.changeUserRoleValidation=[
  check('accountType')
    .notEmpty().withMessage("New user role required")
    .isIn(["student", "staff", "admin", "Graduate"]),
  check('phoneNumber')
    .optional()
    .isMobilePhone("ar-EG").withMessage('Invalid phone number'),
  validatorMiddleware
]

exports.updateLoggedUserPassValidation = [
  check('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  check('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),

  check('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error('Confirm password must match new password');
      }
      return true;
    }),
  validatorMiddleware
];


