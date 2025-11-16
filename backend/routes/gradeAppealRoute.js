const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  setCurrentSemester,
  getStudent,
} = require('../middlewares/registerSubMiddleware')

// test middleware //
const {getpastSemester} = require('../middlewares/gradeAppealMiddleware.js')

const {
  getGrades,
  createAppeal
} = require('../controller/GradeAppealController.js');

const {createAppealValidator} = require('../validations/GradeAppealValidator.js');

const GradeAppealRouter = express.Router();

GradeAppealRouter
  .get('/my-grades',
    protect,
    restrictTo("student"),
    getStudent,
    getpastSemester,
    getGrades
  )

GradeAppealRouter
  .post('/createappeal',
    protect,
    restrictTo("student"),
    createAppealValidator,
    getStudent,
    getpastSemester,
    createAppeal
  )

module.exports = { GradeAppealRouter };