const { body, param  } = require('express-validator');
const validatorMiddleware = require ('../middlewares/validatorMiddleware')




exports.PendingEvaluationsValidator=[
  param('enrollmentId')
    .notEmpty().withMessage('Enrollment ID is required.')
    .isInt().withMessage('Enrollment ID must be a valid integer.'),
  validatorMiddleware
];

exports.EvaluationAnswerValidator=[
  param('enrollmentId')
    .notEmpty().withMessage('Enrollment ID is required in the URL.')
    .isInt().withMessage('Enrollment ID must be a valid integer.'),

  body('answers')
    .isArray({ min: 1, max:20 }).withMessage('Answers must be a non-empty array.')
    .withMessage('You must provide answers.'),

  body('answers.*.questionId')
    .notEmpty().withMessage('Question ID is required for each answer.')
    .isInt().withMessage('Question ID must be an integer.'),

  body('answers.*.score')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 }).withMessage('Score must be an integer between 1 and 5.'),

  body('answers.*.text')
    .optional({ nullable: true }) 
    .isString().withMessage('Text response must be a string.')
    .trim(),

  body('answers.*').custom((val) => {
    const hasScore = (val.score !== undefined && val.score !== null);
    const hasText = (val.text && val.text.trim().length > 0);

    if (!hasScore && !hasText) {
      throw new Error('Each answer must contain either a valid "score" or "text" response.');
    }
    return true;
  }),
  
  validatorMiddleware
];


