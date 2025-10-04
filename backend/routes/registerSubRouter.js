const express = require('express');

const {
  getAvailableSubjects,
  registerSubject,
  dropEnrollment,
  getRegisteredSchedule
} = require('../controller/registerSubController');

const {
  setCurrentSemester,
  getStudentId
} = require('../middlewares/registerSubMiddleware')

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const registerSubRouter = express.Router();


registerSubRouter
  .get('/available-subjects', 
    protect, 
    restrictTo("student"), 
    getStudentId, 
    setCurrentSemester, 
    getAvailableSubjects
  );
registerSubRouter
  .post('/register-subject', 
    protect, 
    restrictTo("student"),
    getStudentId, 
    setCurrentSemester, 
    registerSubject
  );
registerSubRouter
  .delete('/drop-enrollment', 
    protect, 
    restrictTo("student"), 
    getStudentId,
    setCurrentSemester, 
    dropEnrollment
  );
registerSubRouter
  .get('/registered-schedule', 
    protect, 
    restrictTo("student"),
    getStudentId, 
    setCurrentSemester, 
    getRegisteredSchedule
  );







module.exports = { registerSubRouter };
