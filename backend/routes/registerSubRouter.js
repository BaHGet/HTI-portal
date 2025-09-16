const express = require('express');

const {
  getAvailableSubjects,
  registerSubject,
  dropSubject,
  getRegisteredSchedule
} = require('../controller/registerSubController');


const registerSubRouter = express.Router();




registerSubRouter.get('/available-subjects', getAvailableSubjects);
registerSubRouter.post('/register-subjects', registerSubject);
registerSubRouter.get('/dropsub', );
registerSubRouter.get('/registerschedule', );







module.exports = { registerSubRouter };
