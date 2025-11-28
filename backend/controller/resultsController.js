const asyncHandler = require('express-async-handler');


const db = require("../models/index");
const { Op } = require('sequelize');


exports.getStudentSemester = asyncHandler(async(req,res,next)=>{
  const studentId = req.student.StudentID;

  const semesters = await db.Semester.findAll({
    attributes: ['SemesterID', 'SemesterName', 'StartDate'], 
    order: [['StartDate', 'DESC']], 
    raw: true,
    include: [{
      model: db.CourseGroup,
      attributes: [], 
      required: true, 
      include: [{
        model: db.Enrollment,
        attributes: [], 
        required: true, 
        where: { 
          StudentID: studentId 
        }
      }]
    }],
    group: ['SemesterID','SemesterName', 'StartDate'] 
  });

  const responseList = [
    { SemesterID: 'all', SemesterName: 'All Semesters (Cumulative)' },
    ...semesters
  ];

  res.status(200).json({
    success: true,
    count: semesters.length,
    data: responseList
  });

})



exports.getStudentResults = asyncHandler(async(req,res,next)=>{
  const student = req.student;
  const { semester_id } = req.params;

  const semester = {};
  if (semester_id && semester_id !== 'all') {
    semester.SemesterID = semester_id;
  }

  const grades = await db.Grade.findAll({
    where: semester, 
    attributes: ['LetterGrade','Total'],
    order: [
        [db.Semester, 'StartDate', 'ASC'] 
    ],
    raw: true, 
    nest: true,
    include: [
      {
        model: db.Enrollment,
        attributes: ['GroupID'], 
        where: { StudentID: student.StudentID }, 
        required: true, 
        include: [{
          model: db.CourseGroup,
          attributes: ['CourseID'],
          include: [{
            model: db.Course,
            attributes: ['CourseName', 'CourseCode', 'CreditHours'] 
          }]
        }]
      },
      {
        model: db.Semester,
        attributes: ['SemesterName', 'SemesterID', 'StartDate']
      }
    ]
  });

  let responseData = [];

  if (semester_id !== 'all') {
    responseData = grades.map(g => ({
      CourseName: g.Enrollment.CourseGroup.Course.CourseName,
      CourseCode: g.Enrollment.CourseGroup.Course.CourseCode,
      CreditHours: g.Enrollment.CourseGroup.Course.CreditHours,
      Total: g.Total,
      LetterGrade: g.LetterGrade
    }));
  }else {
    const grouped = {};

    grades.forEach(g => {
      const semName = g.Semester.SemesterName;
      const semID = g.Semester.SemesterID;

      if (!grouped[semID]) {
        grouped[semID] = {
          SemesterName: semName,
          Results: []  
        };
      }

      grouped[semID].Results.push({
        CourseName: g.Enrollment.CourseGroup.Course.CourseName,
        CourseCode: g.Enrollment.CourseGroup.Course.CourseCode,
        CreditHours: g.Enrollment.CourseGroup.Course.CreditHours,
        Total: g.Total,
        LetterGrade: g.LetterGrade
      });
    });

    responseData = Object.values(grouped);
  }


  res.status(200).json({
    success: true,
    type: semester_id === 'all' ? 'transcript' : 'single_semester',
    GPA: student.gpa,
    data: responseData
  });
})

