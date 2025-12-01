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
} = require('../middlewares/registerSubMiddleware')

const {
  GroupSubValidator,
} = require('../validations/registerSubValidator')

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
    GroupSubValidator,
    getStudent, 
    setCurrentSemester,
    registerSubject
  );
registerSubRouter
  .delete('/drop-enrollment', 
    protect, 
    restrictTo("student"), 
    GroupSubValidator,
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
