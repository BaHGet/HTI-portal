const { param  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')




exports.getGradesValidator=[
  param('semester_id')
    .notEmpty().withMessage('Semester ID is required (use "all" for transcript).')
    .isInt().withMessage('Semester ID must be a valid integer.'),
  validatorMiddleware
];




