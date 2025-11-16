const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const db = require('../models');
const ApiError = require('../utils/apiError');


////////////////////// THIS MIDDLEWARE IS GUST FOR TEST //////////////////////
exports.getpastSemester = asyncHandler(async (req, res, next) => {
  const targetEndDate = '2025-05-31';

  const pastSemester = await db.Semester.findOne({
    where: {
      EndDate: targetEndDate 
    },
    attributes: ['SemesterID']
  });
  if (!pastSemester) {
    return next(new ApiError(`Test semester ending on ${targetEndDate} not found in DB.`, 404));
  }
  req.currentSemester = pastSemester;
  next();
});
