const express = require('express');

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {
  getStudent
} = require('../middlewares/registerSubMiddleware')

const {
  setCurrentAcademicYear
} = require('../middlewares/studentFinancialMiddleware')

const {
  getStudentFinantial
} = require('../controller/studentFinancialController')

const PaymentRouter = express.Router();

PaymentRouter
  .get('/student-payment',
    protect,
    restrictTo("student"),
    getStudent,
    setCurrentAcademicYear,
    getStudentFinantial
  )


module.exports = { PaymentRouter };