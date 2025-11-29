const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const db = require("../models/index");
const { Op } = require('sequelize');

exports.getGrades = asyncHandler(async(req,res,next)=>{
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;

  const grades = await db.Grade.findAll({
    where: {
      SemesterID: semesterId
    },
    attributes: ['GradeID','Midterm','Final','Activities','Total','LetterGrade'],
    include:[
    {
      model: db.Enrollment,
      where: {
        StudentID:student.StudentID,
        Status: {[Op.in]: ['Completed', 'Failed']}
      },
      attributes: [],
      include:[{
        model: db.CourseGroup,
        attributes: [],
        include:[{
          model: db.Course,
          attributes: ['CourseName']
        }],  
      }],  
    },
    {
      model: db.GradeAppeal,
      attributes:['Status'],
      required: false
    }]
  });
  
  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades
  });
})


exports.createAppeal = asyncHandler(async(req,res,next)=>{
  ////////////////////// step 0: Get Data //////////////////////
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;
  const currentAcademicYear = req.currentAcademicYear;

  const { 
    gradeId, 
    studentNotes, 
    appealMidterm, 
    appealFinal, 
    appealActivities 
  } = req.body;

  ////////////////////// step 1: Get grade that matched the (gradeId&studentid) //////////////////////
  const gradeRecord = await db.Grade.findOne({
    where: {
      GradeID: gradeId,
      SemesterID: semesterId 
    },
    include: [{
      model: db.Enrollment,
      where: { StudentID: student.StudentID }, 
      attributes: [] 
    }]
  });

  if(!gradeRecord){
    return next (new ApiError('Grade not found, not part of the current appeal window, or you do not have permission', 404))
  }

  ////////////////////// step 2: Create Appeal //////////////////////
  const t = await db.sequelize.transaction();
  try {
    const newAppeal = await db.GradeAppeal.create({
      GradeID: gradeId,
      StudentID: student.StudentID,
      StudentNotes: studentNotes,
      AppealMidterm: appealMidterm || false,
      AppealFinal: appealFinal || false,
      AppealActivities: appealActivities || false,
      Status: 'Pending' 
    }, { transaction: t });

    const APPEAL_COST = 100;
    const updatedFinance = await db.StudentFinancial.increment(
      { AppealFees: APPEAL_COST }, 
      { 
        where: { 
          StudentID: student.StudentID,
          AcademicYear: currentAcademicYear 
        } ,
        transaction: t 
      }
    );
    if (!updatedFinance || updatedFinance[0][1] === 0) {
      throw new ApiError (`No financial record found`,400)
    }

    await t.commit();
    
    const appealResponse = newAppeal.toJSON();
    delete appealResponse.StudentID;

    res.status(201).json({
      success: true,
      message: 'Grade appeal submitted successfully.',
      data: appealResponse
    });

  } catch (error) {
    
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new ApiError('You have already submitted an appeal for this grade. Only one appeal is allowed.', 400));
    }
    
    return next(new ApiError('Server error while creating appeal.', 500));
  }
});

