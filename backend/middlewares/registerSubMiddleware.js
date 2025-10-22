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

exports.getStudent = asyncHandler(async(req,res,next)=>{
  const student = await db.Student.findOne({
    where: { UserID: req.user.UserID },
  });

  if (!student) {
    return next(new ApiError('Forbidden: This user does not have a student profile.', 403));
  }

  req.student = student;
  next();
})

exports.loadCurrentEnrollments = asyncHandler(async (req, res, next) => {
  const studentId = req.student.StudentID;
  const semesterId = req.currentSemester.SemesterID;

  if (!req.student || !req.currentSemester) {
    return next(new ApiError('Student or Semester data is missing', 500));
  }

  const enrollments = await db.Enrollment.findAll({
    where: {
      StudentID: studentId,
      status: "Registered"
    },
    include: [{
      model: db.CourseGroup,
      required: true,
      where: { SemesterID: semesterId },
      include: [
        { 
          model: db.Course,
          attributes: ['CourseID', 'CreditHours'] 
        },
        { 
          model: db.GroupSchedule, 
          include: [db.TimePeriod] 
        }
      ]
    }],
    transaction: req.transaction 
  });

  req.currentEnrollments = enrollments || [];
  next();
});
