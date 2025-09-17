const express = require('express');

const {
  getAvailableSubjects,
  registerSubject,
  dropEnrollment,
  getRegisteredSchedule
} = require('../controller/registerSubController');


const registerSubRouter = express.Router();




registerSubRouter.get('/available-subjects', getAvailableSubjects);
registerSubRouter.post('/register-subjects', registerSubject);
registerSubRouter.get('/drop-enrollment', dropEnrollment);
registerSubRouter.get('/registeredschedule', getRegisteredSchedule);







module.exports = { registerSubRouter };
