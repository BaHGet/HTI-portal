const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  getStudent,
} = require('../middlewares/registerSubMiddleware')

// test middleware //
const {getpastSemester} = require('../middlewares/gradeAppealMiddleware.js')
const {setCurrentAcademicYear} = require('../middlewares/studentFinancialMiddleware.js')

const {
  getGrades,
  createAppeal
} = require('../controller/gradeAppealController.js');

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
  .post('/createappeal/:gradeId',
    protect,
    restrictTo("student"),
    createAppealValidator,
    getStudent,
    getpastSemester,
    setCurrentAcademicYear,
    createAppeal
  )

module.exports = { GradeAppealRouter };