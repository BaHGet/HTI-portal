const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const db = require("../models/index");

exports.getAllProfessors = asyncHandler(async (req, res, next) => {
  
  const professors = await db.Professor.findAll({
    attributes: [
        'ProfessorID', 
        'ProfessorName', 
        'AltEmail' 
    ],
    include: [{
      model: db.Department,
      attributes: ['DepartmentName'],
    }],
    order: [['ProfessorName', 'ASC']] 
  });

  res.status(200).json({
    status: 'success',
    count: professors.length,
    data: professors
  });
});