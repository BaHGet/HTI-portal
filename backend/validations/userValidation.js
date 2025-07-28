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
  check('role')
    .notEmpty().withMessage("New user role required")
    .isIn(["student", "staff", "admin", "Graduate"]),
  check('phone')
    .optional()
    .isMobilePhone("ar-EG").withMessage('Invalid phone number'),
  validatorMiddleware
]
