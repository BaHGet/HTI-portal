const { check  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')




exports.EnrollmentValidator = [
  check('EnrollmentID')
    .notEmpty()
    .withMessage('GroupID is required')
    .isInt()
    .withMessage('GroupID must be a number (integer)'),
    validatorMiddleware
];



