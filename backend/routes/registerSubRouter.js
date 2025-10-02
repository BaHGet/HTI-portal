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



const registerSubRouter = express.Router();
const router = express.Router();

router.use(setCurrentSemester);

registerSubRouter.get('/available-subjects', getAvailableSubjects);
registerSubRouter.post('/register-subject', registerSubject);
registerSubRouter.get('/drop-enrollment', dropEnrollment);
registerSubRouter.get('/registered-schedule', getRegisteredSchedule);







module.exports = { registerSubRouter };
