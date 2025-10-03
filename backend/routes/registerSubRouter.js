const express = require('express');

const {
  getAvailableSubjects,
  registerSubject,
  dropEnrollment,
  getRegisteredSchedule
} = require('../controller/registerSubController');

const {
  setCurrentSemester
} = require('../middlewares/registerSubMiddleware')

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const registerSubRouter = express.Router();


registerSubRouter.get('/available-subjects', protect, restrictTo("student"), setCurrentSemester, getAvailableSubjects);
registerSubRouter.post('/register-subject', protect, restrictTo("student"), setCurrentSemester, registerSubject);
registerSubRouter.delete('/drop-enrollment', protect, restrictTo("student"), setCurrentSemester, dropEnrollment);
registerSubRouter.get('/registered-schedule', protect, restrictTo("student"), setCurrentSemester, getRegisteredSchedule);







module.exports = { registerSubRouter };
