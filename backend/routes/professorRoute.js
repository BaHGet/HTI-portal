const express = require('express');

const {
  getStudent,
} = require('../middlewares/registerSubMiddleware')

const { 
  protect,
  restrictTo, 
} = require('../controller/authController')

const {getAllProfessors} = require ('../controller/professorController')
const professorsRouter = express.Router();

professorsRouter
  .get('/get-professors', 
    protect, 
    restrictTo("student"), 
    getStudent, 
    getAllProfessors
  );

module.exports = { professorsRouter };