const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const db = require('../models');
const ApiError = require('../utils/apiError');

exports.setCurrentSemester = asyncHandler(async (req, res, next) => {
  const today = new Date();

  const currentSemester = await db.Semester.findOne({
    where: {
      StartDate: {
        [Op.lte]: today
      },
      EndDate: {
        [Op.gte]: today
      }
    },
    attributes: ['SemesterID'] 
  });

  if (!currentSemester) {
    return next(new ApiError('No active semester found. Registration might be closed.', 400));
  }
  req.currentSemester = currentSemester;
  next();
});



