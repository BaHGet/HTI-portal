const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  getStudent
} = require('../middlewares/registerSubMiddleware')

const {
  getStudentSemester,
  getStudentResults
} = require('../controller/resultsController')

const {
  getGradesValidator
} = require('../validations/resultsValidator')

const ResultsRouter = express.Router();

ResultsRouter
  .get('/semesters-list',
    protect,
    restrictTo("student"),
    getStudent,
    getStudentSemester
  )

  ResultsRouter
  .get('/my-results/:semester_id',
    protect,
    restrictTo("student"),
    getStudent,
    getGradesValidator,
    getStudentResults
  )


module.exports = { ResultsRouter };