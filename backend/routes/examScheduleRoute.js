const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  setCurrentSemester,
  getStudent,
} = require('../middlewares/registerSubMiddleware')

const {
  getRegisteredSchedule
} = require('../controller/registerSubController')

const {
  getMyExamSchedule
} = require('../controller/examScheduleController')

const {
  examTypeValidator
} = require('../validations/examScheduleValidator')

const SchedulesRouter = express.Router();

SchedulesRouter
  .get('/my-exam-schedule',
    protect,
    restrictTo("student"),
    examTypeValidator,
    getStudent,
    setCurrentSemester,
    getMyExamSchedule
  )

  SchedulesRouter
  .get('/my-weekly-schedule',
    protect,
    restrictTo("student"),
    getStudent,
    setCurrentSemester,
    getRegisteredSchedule
  )


module.exports = { SchedulesRouter };