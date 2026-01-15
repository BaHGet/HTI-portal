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
      attributes: ['GroupID'],
      include:[{
        model: db.CourseGroup,
        attributes: ['CourseID'],
        include:[{
          model: db.Course,
          attributes: ['CourseName','CourseCode']
        }],  
      }],  
    },
    {
      model: db.GradeAppeal,
      attributes:['Status'],
      required: false
    }]
  });
  
  const formattedData = grades.map(grade => {
    return {
      GradeID: grade.GradeID,
      CourseCode: grade.Enrollment.CourseGroup.Course.CourseCode,
      CourseName: grade.Enrollment.CourseGroup.Course.CourseName,
      Midterm: grade.Midterm,
      Final: grade.Final,
      Activities: grade.Activities,
      Total: grade.Total,
      LetterGrade: grade.LetterGrade,
      AppealStatus: grade.GradeAppeal ? grade.GradeAppeal.Status : 'No Appeal'
    };
  });


  res.status(200).json({
    success: true,
    count: formattedData.length,
    data: formattedData
  });
})


exports.createAppeal = asyncHandler(async(req,res,next)=>{
  ////////////////////// step 0: Get Data //////////////////////
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;
  const currentAcademicYear = req.currentAcademicYear;

  const gradeId = req.params.gradeId
  const { 
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
    const [updatedFinance] = await db.StudentFinancial.increment(
      { AppealFees: APPEAL_COST }, 
      { 
        where: { 
          StudentID: student.StudentID,
          AcademicYear: currentAcademicYear 
        } ,
        transaction: t 
      }
    );
    if (updatedFinance === 0) {
      throw new ApiError(`Student financial record for ${currentAcademicYear} not found.`, 400);
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Grade appeal submitted successfully.',
      data: newAppeal.AppealID
    });

  } catch (error) {
    
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new ApiError('You have already submitted an appeal for this grade. Only one appeal is allowed.', 400));
    }
    
    return next(error);
  }
});

