
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const db = require("../models/index");



exports.getStudentSub = asyncHandler ( async(req , res, next )=>{
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;

  const studentEnrollments = await db.Enrollment.findAll({
    where: { StudentID: student.StudentID},
    attributes:['EnrollmentID','Status'],
    include:[{
      model: db.CourseGroup,
      where: { SemesterID: semesterId },
      attributes: ['GroupNumber'],
      include:[
        {
        model: db.Course,
        attributes:['CourseName','CourseCode','CreditHours'],
        }
      ]
    }]
  })

  res.status(200).json({
    success: true,
    count: studentEnrollments.length,
    data: studentEnrollments
  });
})

exports.withdrawalSub = asyncHandler ( async(req , res, next )=>{

  const t = await db.sequelize.transaction();
  try{
    ///////////////// Step 0: ///////////////////
    const student = req.student
    const semesterId = req.currentSemester.SemesterID;

    const enrollmentId = req.body.EnrollmentID;
    if (!enrollmentId) {
      throw new ApiError("Please provide the EnrollmentID to withdraw.", 400);
    }
    
    ///////////////// Step 1: ///////////////////
    const currentWithdrawalCount = await db.Enrollment.count({
      where: {
        StudentID: student.StudentID,
        Status: 'Withdrawn' 
      },
      include: [{
        model: db.CourseGroup,
        where: { SemesterID: semesterId },
        attributes: [] 
      }],
      transaction: t
    });

    if (currentWithdrawalCount >= 4) {
      throw new ApiError('You have already reached the maximum withdrawal limit (4 subjects).', 400);
    }

    ///////////////// Step 2: ///////////////////
    const enrollmentToWithdraw = await db.Enrollment.findOne({
      where: {
        EnrollmentID: enrollmentId,
        StudentID: student.StudentID 
      },
      attributes:['EnrollmentID','Status'],
      include: [{
        model: db.CourseGroup,
        where: { SemesterID: semesterId },
        attributes: [] 
      }],
      transaction: t
    });

    if (!enrollmentToWithdraw) {
      throw new ApiError('Enrollment record not found or does not apply to the current semester.', 404);
    }

    if (enrollmentToWithdraw.Status !== 'Registered') { 
      throw new ApiError(`This subject cannot be withdrawn (Current status: ${enrollmentToWithdraw.Status}).`, 400);
    }

    enrollmentToWithdraw.Status = 'Withdrawn'; 
    await enrollmentToWithdraw.save({ transaction: t });

    await t.commit();
    ///////////////// Step 3: ///////////////////
    res.status(200).json({
      success: true,
      message: 'Subject withdrawn successfully.',
      data: enrollmentToWithdraw 
    });

  }catch(error){
    await t.rollback();
    next(error);
  }
  
})

exports.restoringSub = asyncHandler ( async(req , res, next )=>{
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;

  const enrollmentId = req.body.EnrollmentID;
  if (!enrollmentId) {
    return next(new ApiError("Please provide the EnrollmentID to withdraw.", 400));
  }

  const withdrawToEnrollment = await db.Enrollment.findOne({
    where: {
      EnrollmentID: enrollmentId,
      StudentID: student.StudentID 
    },
    attributes:['EnrollmentID','Status'],
    include: [{
      model: db.CourseGroup,
      where: { SemesterID: semesterId },
      attributes: [] 
    }]
  });

  if (!withdrawToEnrollment) {
    return next(new ApiError('Enrollment record not found or does not apply to the current semester.', 404));
  }

  if (withdrawToEnrollment.Status !== 'Withdrawn') { 
    return next(new ApiError(`This subject cannot be restored (Current status: ${withdrawToEnrollment.Status}).`, 400));
  }

  withdrawToEnrollment.Status = 'Registered'; 
  await withdrawToEnrollment.save();

  ///////////////// Step 3: ///////////////////
  res.status(200).json({
    success: true,
    message: 'Subject restored successfully.',
    data: withdrawToEnrollment 
  });

})



