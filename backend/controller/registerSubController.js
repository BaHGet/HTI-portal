
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const checkTimeConflict = require('../utils/timeConflict')

const db = require("../models/index");




// @desc    Get Avialable Subjects for specific student
// @route   GET /api/registration/available-subjects
// @access  Private (Student)
exports.getAvailableSubjects = asyncHandler (async (req, res, next) => {
  // Step 0: GetStudentInfo (including finished courses)
  const student = req.student;
  const completedCourses = await student.getCourses({
    attributes: ['CourseID','CreditHours'],
    include: [{ 
      model: db.CourseCategory,
      attributes: ['CourseCategoryID', 'RequiredCredits']
     }]
  });
  /////////////////// step 1: Find Semester Available Courses and student Regulation ///////////////////
  // step 1.1: Fetch all courses offered in this semester
  const semesterCourses = await db.Course.findAll({
    attributes: ['CourseID', 'CourseCode', 'CourseName', 'CreditHours', 'RegulationID', 'CourseCategoryID'],
    include: [
      { 
        model: db.Semester, 
        where: { SemesterID: req.currentSemester.SemesterID },
        attributes: [] 
      },
      { 
        model: db.Course, 
        as: 'Prerequisites',
        attributes: ['CourseID', 'CourseName'] 
      },
      {
        model: db.CourseCategory,
        attributes: ['CourseCategoryID', 'RequiredCredits'] 
      },
      {
        model: db.CourseGroup,
        attributes: ['GroupID', 'GroupNumber', 'Capacity', 'CurrentEnrolled'],
        include: [
        {
          model: db.Professor,
          attributes: ['ProfessorName'], 
        },
        {
          model: db.GroupSchedule,
          attributes: ['DayOfWeek', 'Room'],
          include:[{
            model: db.TimePeriod,
            attributes: ['PeriodName']
          }]
        }]
      }
    ]
  });
  if (!semesterCourses.length) {
    return res.status(200).json({ success: true, count: 0, data: [] });
  }
  // step 1.2: find Student AcademicRegulations
  const studentRegulation = await student.getAcademicRegulation({
    attributes: ['RegulationID']
  });
  if (!studentRegulation) {
    return next(new ApiError('Could not find the academic regulation for this student', 404));
  }

  //////////////// step 2: filter(1) semesterCourses based on studentRegulation ////////////////
  const studentAllCourses = semesterCourses
    .filter(course => course.RegulationID === studentRegulation.RegulationID);

  //////////////// step 3: filter(2) studentAllCourses based on student completed courses ////////////////
  // step 3.1: get completed course
  const completedCourseIdsSet = new Set(completedCourses.map(course => course.CourseID));

  // step 3.2: filtration process
  const unFinishedCourses = studentAllCourses
  .filter(course => !completedCourseIdsSet.has(course.CourseID));

  //////////////// step 4: filter studentCourses based on prerequisites ////////////////
  const finishedPrerequisiteCourses = unFinishedCourses
    .filter(course =>{
      if(!course.Prerequisites || course.Prerequisites.length === 0) return true;
      return course.Prerequisites
        .every(prerequisite => completedCourseIdsSet.has(prerequisite.CourseID));
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

  ///////////// step 6: GroupIDs the student is currently enrolled in for this semester ///////////////
  const currentEnrollments = await db.Enrollment.findAll({
    where: {
      StudentID: student.StudentID, 
    },
    attributes: ['GroupID'],
    include: [{
      model: db.CourseGroup,
      attributes:[],
      where: {SemesterID: req.currentSemester.SemesterID}
    }]
  });
  const enrolledGroupIdsSet = new Set(currentEnrollments.map(enrollment => enrollment.GroupID));
  ///////////// step 7: Format the final result ///////////////
  const formattedResult = availableCourses.flatMap(course => {
    return course.CourseGroups
      .filter(group => !enrolledGroupIdsSet.has(group.GroupID))
      .map(group => {
        const availableSeats = group.Capacity - group.CurrentEnrolled;
        const scheduleObjects = group.GroupSchedules
          .map(schedule => {
            let timeString = '';
            if (schedule.TimePeriod) {
              timeString = `${schedule.TimePeriod.PeriodName}`;
            }
            return {
              day: schedule.DayOfWeek,
              time: timeString,
              room: schedule.Room
            };
        });
        let professorName;
        if (group.Professor && group.Professor.User) {
          professorName = group.Professor.User.FullName;
        }

        return {
          courseCode: course.CourseCode,
          courseName: course.CourseName,
          creditHours: course.CreditHours,
          groupNumber: group.GroupNumber,
          professorName: professorName,
          availableSeats: availableSeats,
          schedule: scheduleObjects,
          groupId: group.GroupID,
          courseId: course.CourseID,
        };
      });
  });

  /////////////// step 7: return the available courses ////////////////
  
  res.status(200).json({
        success: true,
        count: formattedResult.length,
        data: formattedResult
  });
});



// @desc    Register specific subject for specific student
// @route   POST /api/registration/register-subjects
// @access  Private (Student)
exports.registerSubject = asyncHandler (async (req, res, next) => {

  const transaction = await db.sequelize.transaction();
  try {
    ////////////////////// Step 1: Extract Pre-fetched Data from Middlewares ///////////////////
    const student = req.student;
    const currentEnrollments = req.currentEnrollments;

    ////////////////////// Step 2: Process the Pre-fetched Data in Memory ///////////////////
    const currentCredits = currentEnrollments.reduce((sum, enrollment) => {
        return sum + enrollment.CourseGroup.Course.CreditHours;
    }, 0);

    const currentUserAppointments = currentEnrollments.flatMap(
        enrollment => enrollment.CourseGroup.GroupSchedules || []
    );

    const registeredCourseIds = new Set(
        currentEnrollments.map(enrollment => enrollment.CourseGroup.Course.CourseID)
    );

    /////////////////// Step 3: Fetch New Group Data & Check Seats ///////////////////
    const courseGroupId = req.body.GroupID;
    const courseGroup = await db.CourseGroup.findByPk(courseGroupId,{
      include:[{
        model: db.Course,
        attributes: ['CourseID','CreditHours']
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
    if (student.isLastTerm === false && courseGroup.CurrentEnrolled >= courseGroup.Capacity) {
      throw new ApiError("No seats available in this group", 400);
    }

    /////////////////// step 2: Student Credit Hours Limit Check ///////////////////
    const newCourseCredits = courseGroup.Course.CreditHours;

    let baseMaxCredits;
    if (student.gpa >= 3) {
      baseMaxCredits = 21;
    } else if (student.gpa >= 2) {
      baseMaxCredits = 18;
    } else {
      baseMaxCredits = 14;
    }
    

    if (student.isLastTerm === true) {
      const proposedTotal = currentCredits + newCourseCredits;
      if (proposedTotal > baseMaxCredits) {
          const isWithinExtendedLimit = proposedTotal <= (baseMaxCredits + 3);
          const isFirstCourseOverLimit = currentCredits <= baseMaxCredits;

          if (!isWithinExtendedLimit && !isFirstCourseOverLimit) {
              throw new ApiError(`Credit hour limit exceeded. As a graduating student, you can only exceed your limit by one course or up to 3 extra credits.`, 400);
          }
      }
    } else {
      if ((currentCredits + newCourseCredits) > baseMaxCredits) {
          throw new ApiError(`Credit hour limit exceeded. Your GPA allows a maximum of ${baseMaxCredits} hours.`, 400);
      }
    }
      

    /////////////////// step 3: Time Conflict Check ///////////////////
    const newGroupAppointments = courseGroup.GroupSchedules || [];

    const hasConflict = checkTimeConflict(newGroupAppointments, currentUserAppointments);
    if (hasConflict) {
      throw new ApiError ("Time Conflict",400)
    }

    /////////////////// step 4: Subject Enrolled Conflict Check ///////////////////
    const newCourseId = courseGroup.Course.CourseID;
    if (registeredCourseIds.has(newCourseId)) {
      throw new ApiError('You are already registered for this course in another group.', 400);
    }

    /////////////////// step 5: Add course to student Schedule ///////////////////
    await db.Enrollment.create({
      StudentID: student.StudentID,
      GroupID: courseGroupId,
      status: "Registered",
    }, { transaction });

    await courseGroup.increment('CurrentEnrolled', { by: 1, transaction });
    await transaction.commit();

    /////////////////// step 6: Sending Response ///////////////////
    const availableSeats = courseGroup.Capacity - (courseGroup.CurrentEnrolled + 1);
    
    res.status(201).json({
      success: true,
      message: "Course registered successfully",
      data: {
          enrollment: {
            GroupID: courseGroupId,
            availableSeats: availableSeats
          }
      }
    });

  }catch (error) {
    await transaction.rollback();
    next(error);
  }

});



// @desc    Drop specific subject for student
// @route   Delete /api/registration/drop-Enrollment
// @access  Private (Student)
exports.dropEnrollment = asyncHandler(async (req, res, next) => {
  /////////////////// step 1: Get studentID, GroupID ///////////////////
  const student = req.student
  const groupId = req.body.GroupID;
  const semesterId = req.currentSemester.SemesterID;
  /////////////////// step 2: find matched data and destroy it ///////////////////
  const enrollment  = await db.Enrollment.findOne({
    where: {
      StudentID: student.StudentID,
      GroupID: groupId
    },
     include: [{
      model: db.CourseGroup,
      where: { SemesterID: semesterId }, 
    }],
  });
  if (!enrollment) {
    return next(new ApiError("This enrollment was not found in the current semester.", 404));
  }
  /////////////////// step 3: Updating Seats & Sending Response ///////////////////
  try{
    await db.sequelize.transaction(async (t) => {

      await enrollment.CourseGroup.decrement('CurrentEnrolled', { by: 1, transaction: t });
      await enrollment.destroy({ transaction: t });
      await transaction.commit();
      
      res.status(200).json({
        Success: true,
        message: "Enrollment dropped successfully and the seat has been made available."
      });

    });
  } catch (error) {
    await transaction.rollback()
    next(error);
  }
  
});



// @desc    Get Student Schedule 
// @route   Get /api/registration/registeredschedule
// @access  Private (Student)
exports.getRegisteredSchedule = asyncHandler( async(req, res, next) => {

  const student = req.student
  const semesterId = req.currentSemester.SemesterID;
  ///////////////////// step 1: get all student enrollments data ///////////////////
  const studentEnrollments = await db.Enrollment.findAll({
    where: { StudentID: student.StudentID},
    attributes:[],
    include:[{
      model: db.CourseGroup,
      where: { SemesterID: semesterId },
      attributes: ['GroupNumber'],
      include:[
        {
        model: db.Course,
        attributes:['CourseName','CourseCode','CreditHours'],
        },
        {
          model: db.Professor,
          attributes: ['ProfessorName'],
        },
        {
          model: db.GroupSchedule,
          attributes: ['DayOfWeek','Room','SessionType'],
          include: {
            model: db.TimePeriod,
            attributes: ['PeriodName']
          }
        }
      ]
    }]
  })

  if(!studentEnrollments) {
    return next (new ApiError("Student Schedule Not Found",404))
  }

  ///////////////////// step 2: Sendind Response ///////////////////
  res.status(200).json({
    success: true,
    count: studentEnrollments.length,
    data: studentEnrollments
  });
});


