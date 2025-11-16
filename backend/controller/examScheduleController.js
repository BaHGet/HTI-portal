const asyncHandler = require('express-async-handler');


const db = require("../models/index");
const { Op } = require('sequelize');


exports.getMyExamSchedule = asyncHandler(async(req,res,next)=>{
  const student = req.student
  const semesterId = req.currentSemester.SemesterID;
  const examType = req.query.type;

  const studentEnrollments = await db.Enrollment.findAll({
    where: {
      StudentID: student.StudentID,
      Status: 'Registered' 
    },
    subQuery: true,
    include: [{
      model: db.CourseGroup,
      where: { SemesterID: semesterId }, 
      attributes: ['CourseID'] 
    }],
    attributes: []
  });

  const studentCourseIds = studentEnrollments.map(e => e.CourseGroup.CourseID);
  if (studentCourseIds.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      message: 'You are not registered for any courses this semester.',
      data: [] 
    });
  }
  
  const exams = await db.Exam.findAll({
    where: {
      ExamType: examType 
    },
    attributes: ['ExamDate','StartTime','EndTime','Room'],
    order: [['ExamDate', 'ASC'], ['StartTime', 'ASC']],
    include: [{
      model: db.SemesterCourse,
      attributes: ['CourseID'], 
      where: {
        SemesterID: semesterId,
        CourseID: { [Op.in]: studentCourseIds } 
      },
      include: [{
        model: db.Course,
        attributes: ['CourseName', 'CourseCode']
      }]
    }]
  });

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams
  });

})



