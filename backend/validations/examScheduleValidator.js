const { query  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')




exports.examTypeValidator=[
  query('type')
    .notEmpty().withMessage('Query parameter "type" is required.')
    .isIn(['Midterm', 'Final']).withMessage('Type must be either "Midterm" or "Final".'),
    validatorMiddleware
];




