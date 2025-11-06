const express = require('express');

const {
  getStudentSub,
  withdrawalSub,
  restoringSub
} = require('../controller/WithdrawalController.js');


const {
  setCurrentSemester,
  getStudent,
} = require('../middlewares/registerSubMiddleware')

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const withdrawalSubRouter = express.Router();

withdrawalSubRouter
  .get('/get-subjects', 
    protect, 
    restrictTo("student"), 
    getStudent, 
    setCurrentSemester, 
    getStudentSub
  );


withdrawalSubRouter
  .put('/withdrawal-subject', 
    protect, 
    restrictTo("student"), 
    getStudent, 
    setCurrentSemester, 
    withdrawalSub
  );

withdrawalSubRouter
.put('/restoring-subject', 
  protect, 
  restrictTo("student"), 
  getStudent, 
  setCurrentSemester, 
  restoringSub
);

module.exports = { withdrawalSubRouter };
