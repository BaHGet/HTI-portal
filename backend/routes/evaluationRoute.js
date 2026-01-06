const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  getStudent,
  setCurrentSemester
} = require('../middlewares/registerSubMiddleware')

const {
  getEvaluations,
  PendingEvaluations,
  EvaluationAnswer
} = require('../controller/evaluationController')

const {
  PendingEvaluationsValidator,
  EvaluationAnswerValidator
} = require('../validations/evaluationValidation')

const EvaluationRouter = express.Router();

EvaluationRouter
  .get('/get-subjects',
    protect,
    restrictTo("student"),
    getStudent,
    setCurrentSemester,
    getEvaluations
  )

EvaluationRouter
  .get('/pending-eval/:enrollmentId',
    protect,
    restrictTo("student"),
    PendingEvaluationsValidator,
    getStudent,
    setCurrentSemester,
    PendingEvaluations
  )

EvaluationRouter
  .post('/eval-answers/:enrollmentId',
    protect,
    restrictTo("student"),
    EvaluationAnswerValidator,
    getStudent,
    setCurrentSemester,
    EvaluationAnswer
  )


  module.exports = { EvaluationRouter };