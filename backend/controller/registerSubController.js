
const asyncHandler = require('express-async-handler');
const { Op } = require("sequelize");



const db = require("../models/index");
const { model } = require('mongoose');
const enrollment = require('../models/enrollment');


// @desc    Get Avialable Subjects for specific student
// @route   GET /api/registration/available-subjects
// @access  Private (Student)
exports.getAvailableSubjects = asyncHandler (async (req, res, next) => {
  const today = new Date();

  // Step 0: GetStudentInfo (including finished courses)
  let student = await db.Student.findOne({
    where: { UserID: req.user.id },
    include: [{
        model: db.Course, 
        include: [{
          model: db.CourseCategory
        }] 
    }]
  });
  if(!student){
    return next(new ApiError('User not found', 404));
  }

  /////////////////// step 1: Find Semester Available Courses and student Regulation ///////////////////
  // step 1.1: find the current semester
  const currentSemester = await db.Semester.findOne({
    where: {
      StartDate: { [Op.lte]: today },
      EndDate: { [Op.gte]: today }
    }
  });
  if(!currentSemester){
    return next(new ApiError('No active semester found', 404));
  }
  // step 1.2: Fetch all courses offered in this semester
  const semesterCourses = await db.Course.findAll({
    include: [
      { 
        model: db.Semester, 
        where: { SemesterID: currentSemester.SemesterID } 
      },
      { 
        model: db.Prerequisite, 
        as: 'Prerequisites'
      },
      {
        model: db.CourseCategory 
      },
      {
        model: db.CourseGroup,
        include: [{
          model:db.GroupSchedule
        }]
      }
    ]
  });
  if (!semesterCourses.length) {
    return next(new ApiError('No courses found for the current semester', 404));
  }
  // step 1.3: find Student AcademicRegulations
  const studentRegulation = await student.getAcademicRegulation();
  if (!studentRegulation) {
    return next(new ApiError('Could not find the academic regulation for this student', 404));
  }

  //////////////// step 2: filter(1) semesterCourses based on studentRegulation ////////////////
  const studentAllCourses = semesterCourses
    .filter(course => course.RegulationID === studentRegulation.RegulationID);

  //////////////// step 3: filter(2) studentAllCourses based on student completed courses ////////////////
  // step 3.1: get completed course
  const completedCourses = student.Courses;
  const completedCourseIds = completedCourses
    .map(id => id.CourseID);

  // step 3.2: filtration process
  const unFinishedCourses = studentAllCourses
    .filter(course => !completedCourseIds.includes(course.id));

  //////////////// step 4: filter studentCourses based on prerequisites ////////////////
  const finishedPrerequisiteCourses = unFinishedCourses
    .filter(course =>{
      if(!course.prerequisite || course.Prerequisites.length === 0) return true;
      return course.Prerequisites
        .every(prerequisite => completedCourseIds.includes(prerequisite.PrerequisiteCourseID));
    })
  
  //////////////// step 5: filter based on category ////////////////
  const availableCourses = finishedPrerequisiteCourses
    .filter(course => {
      const requiredCredits = course.CourseCategory.RequiredCredits;
      const categoryId = course.CourseCategory.CourseCategoryID;

      if ( requiredCredits === null || requiredCredits === 0) return true;

      const completedCreditsInCategory = completedCourses.reduce((total, completed) => {
        if (completed.CourseCategory && completed.CourseCategory.CourseCategoryID === categoryId) {
            return total + completed.CreditHours; 
        }
        return total;
      }, 0);
      return completedCreditsInCategory < requiredCredits;
    })
  
  /////////////// step 6: Appling Search based on Course Id ///////////////
  const { search } = req.query;

  let finalResult = availableCourses;

  if (search) {
    const searchTerm = search.toLowerCase(); 
    
    finalResult = availableCourses.filter(course => {
        const codeMatch = course.CourseCode.toLowerCase().includes(searchTerm); 
        return codeMatch ;
    });
  }
  if(finalResult.length === 0){
    return next(new ApiError('No available courses found', 404));
  }

  /////////////// step 7: return the available courses ////////////////
  
  res.status(200).json({
        success: true,
        count: finalResult.length,
        data: finalResult
  });
});



// @desc    Register specific subject for specific student
// @route   POST /api/registration/register-subjects
// @access  Private (Student)
exports.registerSubject = asyncHandler (async (req, res, next) => {

  const transaction = await db.sequelize.transaction();
  try {
    /////////////////// Step 1: Seat Availability Check ///////////////////
    const courseGroupId = req.body.GroupID;
    const courseGroup = await db.CourseGroup.findByPk(courseGroupId,{
      include:[{
        model: db.Course,
        attributes: ['CreditHours']
      },
      {
        model: db.GroupSchedule,
        attributes: ['DayOfWeek'],
        include:[{
          model: db.TimePeriod
        }],
      }],
      transaction 
    });
    if(!courseGroup){
      throw new ApiError("Course group not found",404);
    }
    if (courseGroup.CurrentEnrolled >= courseGroup.Capacity){
      throw new ApiError("No seates available",400);
    }
      

    /////////////////// step 2: Credit Hour Limit Check ///////////////////
    const totalStudentCredits = await db.Course.sum('CreditHours', {
      include: [{
          model: db.CourseGroup,
          attributes: [], 
          required: true,
          include: [{
              model: db.Enrollment,
              attributes: [], 
              required: true,
              where: {
                  StudentID: req.user.id,
                  status: "Registered"
              }
          }]
      }],
      transaction
    });

    const currentCredits = totalStudentCredits || 0;
    const newCourseCredits = courseGroup.Course.CreditHours;
    const studentMaxCredits = 18;

    if ((currentCredits + newCourseCredits) > studentMaxCredits){
      throw new ApiError("Credit hour limit exceeded",400);
    }
      

    /////////////////// step 3: Time Conflict Check ///////////////////
    const newGroupAppointments = courseGroup.GroupSchedules || [];

    const currentUserAppointments = await db.GroupSchedule.findAll({
      include: [{
          model: db.TimePeriod
      }, {
          model: db.CourseGroup, 
          attributes: [], 
          required: true,
          include: [{
              model: db.Enrollment, 
              attributes: [], 
              required: true,
              where: { StudentID: req.user.id, status: "Registered" }
          }]
      }],
      transaction
    });

    const hasConflict = checkTimeConflict(newGroupAppointments, currentUserAppointments);
    if (hasConflict) {
      throw new ApiError ("Time Conflict",400)
    }

    /////////////////// step 4: Calculate Attempt Number ///////////////////
    const courseId = courseGroup.CourseID;
    const existingEnrollment = await db.Enrollment.findOne({
      where: {
          StudentID: req.user.id,
          status: 'Registered' 
      },
      include: [{
          model: db.CourseGroup,
          required: true,
          attributes: [],
          where: {
            CourseID: courseId 
          }
      }],
      transaction
    });

    if (existingEnrollment) {
        throw new ApiError('You are already registered for this course in another group.', 400);
    }

    /////////////////// step 5: Calculate Attempt Number ///////////////////
    const previousAttemptsCount = await db.Enrollment.count({
      include: [{
          model: db.CourseGroup,
          attributes: [], 
          required: true,
          where: {
            CourseID: courseId 
          }
      }],
      where: {
          StudentID: req.user.id 
      },
      transaction
    });
    const newAttemptNumber = previousAttemptsCount + 1;

    /////////////////// step 6: Add course to student Schedule ///////////////////
    await db.Enrollment.create({
      StudentID: req.user.id,
      GroupID: courseGroupId,
      status: "Registered",
      AttemptNumber: newAttemptNumber
    }, { transaction });

    await courseGroup.increment('CurrentEnrolled', { by: 1, transaction });
    await transaction.commit();

  }catch (error) {
    await transaction.rollback();
    next(error);
  }

});


// exports.dropSubject = async (req, res, next) => {};


// exports.getRegisteredSchedule = async (req, res, next) => {};


