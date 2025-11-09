const { check  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')
const ApiError = require('../utils/apiError');

exports.createAppealValidator=[
  check('gradeId')
    .notEmpty().withMessage('GradeID is required.')
    .isInt().withMessage('GradeID must be a valid integer.'),
  check('appealMidterm')
    .optional()
    .isBoolean().withMessage('AppealMidterm must be true or false.'),
  check('appealFinal')
    .optional()
    .isBoolean().withMessage('AppealFinal must be true or false.'),
  check('appealActivities')
    .optional()
    .isBoolean().withMessage('AppealActivities must be true or false.'),
  check('studentNotes')
    .optional({ nullable: true }) 
    .isString().withMessage('Student notes must be a string.')
    .trim(),

  validatorMiddleware
]