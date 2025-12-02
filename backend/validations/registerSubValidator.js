const { check, param  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')




exports.GroupSubValidator = [
  param('groupId')
    .notEmpty()
    .withMessage('GroupID is required')
    .isInt()
    .withMessage('GroupID must be a number (integer)'),
    validatorMiddleware
];



