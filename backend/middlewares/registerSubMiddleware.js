const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const db = require('../models');
const ApiError = require('../utils/apiError');
const redisClient = require('../utils/redisClient');


exports.setCurrentSemester = asyncHandler(async (req, res, next) => {
  const cacheKey = 'global:currentSemester';
  let cachedSemester = await redisClient.get(cacheKey);

  if (cachedSemester) {
    req.currentSemester = JSON.parse(cachedSemester);
    return next();
  }

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

  await redisClient.setEx(cacheKey, 60 , JSON.stringify(currentSemester));
  req.currentSemester = currentSemester;
  next();
});

exports.getStudent = asyncHandler(async(req,res,next)=>{
  const studentCacheKey = `student:profile:user:${req.user.UserID}`;
  let cachedStudent = await redisClient.get(studentCacheKey);

  if (cachedStudent) {
    req.student = JSON.parse(cachedStudent);
    return next();
  }
  const student = await db.Student.findOne({
    where: { UserID: req.user.UserID },
  });

  if (!student) {
    return next(new ApiError('Forbidden: This user does not have a student profile.', 403));
  }

  await redisClient.setEx(studentCacheKey, 60 , JSON.stringify(student));
  req.student = student;
  next();
})

