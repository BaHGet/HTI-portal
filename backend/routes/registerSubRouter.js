const express = require('express');

const {
  getAvailableSubjects,
  registerSubject,
  dropEnrollment,
  getRegisteredSchedule
} = require('../controller/registerSubController');

const {
  setCurrentSemester,
  getStudent,
  loadCurrentEnrollments
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
    getStudent, 
    setCurrentSemester, 
    getAvailableSubjects
  );
registerSubRouter
  .post('/register-subject', 
    protect, 
    restrictTo("student"),
    getStudent, 
    setCurrentSemester,
    loadCurrentEnrollments,
    registerSubject
  );
registerSubRouter
  .delete('/drop-enrollment', 
    protect, 
    restrictTo("student"), 
    getStudent,
    setCurrentSemester, 
    dropEnrollment
  );
registerSubRouter
  .get('/registered-schedule', 
    protect, 
    restrictTo("student"),
    getStudent, 
    setCurrentSemester, 
    getRegisteredSchedule
  );





module.exports = { registerSubRouter };
