const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const checkTimeConflict = require('../utils/timeConflict')
const redisClient = require('../utils/redisClient');
const { emitSeatsUpdate } = require("../Sockets/courseHooks");

const db = require("../models/index");




// @desc    Get Avialable Subjects for specific student
// @route   GET /api/registration/available-subjects
// @access  Private (Student)
exports.getAvailableSubjects = asyncHandler (async (req, res, next) => {
  const student = req.student;
  const semester= req.currentSemester

  //////////////////// Cash Keys ////////////////////
  const studentCompletedKey = `student:${student.StudentID}:completed`; 
  const catalogKey = `catalog:reg:${student.RegulationID}`; 

  //////////////////// STEP(1): All Queries ////////////////////
  //////////////////// STEP(1.1): Redis Multi-Get ////////////////////
  const [cachedCompletedCourses, cachedsemesterCourses] = await redisClient.mGet([
    studentCompletedKey,
    catalogKey
  ]);

  let completedCourses = cachedCompletedCourses ? JSON.parse(cachedCompletedCourses) : null;
  let semesterCourses = cachedsemesterCourses ? JSON.parse(cachedsemesterCourses) : null;

  //////////////////// STEP(1.2): Smart DB Fetching (All in One) ////////////////////
  const dbTasks = [];

  let completedIdx = -1;
  if (!completedCourses) {
    completedIdx = dbTasks.push(db.StudentCompletedCourse.findAll({
      where: { StudentID: student.StudentID },
      attributes: ['CourseID', 'GradeID', 'CompletionDate'],
      include: [{
        model: db.Course,
        attributes: ['CreditHours'],
        include: [{ 
          model: db.CourseCategory, 
          attributes: ['CourseCategoryID', 'RequiredCredits'] 
        }]
      }]
    })) - 1;
  }

  let catalogIdx = -1;
  if (!semesterCourses) {
    catalogIdx = dbTasks.push(db.Course.findAll({
      attributes: ['CourseID', 'CourseCode', 'CourseName', 'CreditHours', 'CourseCategoryID'],
      where: { RegulationID: student.RegulationID },
      include: [
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
          where: { SemesterID: semester.SemesterID },
          attributes: ['GroupID', 'GroupNumber', 'CourseID'], 
          include: [
            { 
              model: db.Professor, 
              attributes: ['ProfessorName'] 
            },
            { 
              model: db.GroupSchedule, 
              attributes: ['DayOfWeek', 'Room'],
              include: [
                { 
                  model: db.TimePeriod, 
                  attributes: ['PeriodName'] 
                }
              ]
            }
          ]
        }
      ]
    })) - 1;
  }

  const groupsIdx = dbTasks.push(db.CourseGroup.findAll({
    where: { SemesterID: semester.SemesterID },
    attributes: ['GroupID', 'Capacity', 'CurrentEnrolled'], 
  })) - 1;

  const enrollmentsIdx = dbTasks.push(db.Enrollment.findAll({
    where: { StudentID: student.StudentID },
    attributes: ['GroupID'],
    include: [
      { 
        model: db.CourseGroup, 
        attributes: [], 
        where: { SemesterID: semester.SemesterID } 
      }
    ]
  })) - 1;

  const dbResults = await Promise.all(dbTasks);

  if (!completedCourses) {
    completedCourses = dbResults[completedIdx];
    await redisClient.setEx(studentCompletedKey, 60 , JSON.stringify(completedCourses));
  }
  if (!semesterCourses) {
    semesterCourses = dbResults[catalogIdx];
    await redisClient.setEx(catalogKey, 60 , JSON.stringify(semesterCourses));
  }
  const liveGroups = dbResults[groupsIdx];
  const currentEnrollments = dbResults[enrollmentsIdx];

  if (!semesterCourses.length) {
    return res.status(200).json({ success: true, count: 0, data: [] });
  }

  const liveGroupsMap = new Map(liveGroups.map(g => [g.GroupID, g]));

  //////////////////// STEP(2): All Filters ////////////////////
  // Filter(1): Completed CoursesIds
  const completedCourseIdsSet = new Set(completedCourses.map(course => course.CourseID));
  // Filter(2): UnFinishedCourses 
  const unFinishedCourses = semesterCourses
  .filter(course => !completedCourseIdsSet.has(course.CourseID));
  // Filter(3): Finished Prerequisite Courses 
  const finishedPrerequisiteCourses = unFinishedCourses
    .filter(course =>{
      if(!course.Prerequisites || course.Prerequisites.length === 0) return true;
      return course.Prerequisites
        .every(prerequisite => completedCourseIdsSet.has(prerequisite.CourseID));
    })
  // Filter(4): Student Available Courses 
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
  // Filter(5): Student Current Enrollments
  const enrolledGroupIdsSet = new Set(currentEnrollments.map(enrollment => enrollment.GroupID));

  //////////////////// STEP(3): Formatte Results ////////////////////
  const formattedResult = availableCourses.flatMap(course => {
    return course.CourseGroups
      .filter(group => !enrolledGroupIdsSet.has(group.GroupID))
      .map(group => {
        const liveData = liveGroupsMap.get(group.GroupID);
        const availableSeats = liveData ? (liveData.Capacity - liveData.CurrentEnrolled) : 0;
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
        if (group.Professor) {
          professorName = group.Professor.ProfessorName;
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

  //////////////////// STEP(4): Resposnse ////////////////////
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
    const student = req.student;
    const semesterId = req.currentSemester.SemesterID;
    const courseGroupId = req.params.groupId;
    //////////////////// STEP(1): All Queries ////////////////////
    const [currentEnrollments, courseGroup] = await Promise.all([
    // Query(1): Student Current Enrollments
    db.Enrollment.findAll({
      where: {
        StudentID: student.StudentID,
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
      transaction 
    }),
    // Query(2): New Group Data
    db.CourseGroup.findByPk(courseGroupId,{
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
    })

    ])
    //////////////////// STEP(2): Checks & Processing ////////////////////
    // Group Check
    if(!courseGroup){
      throw new ApiError("Course group not found",404);
    }

    // Processing Currnet Enrollment Data
    const currentCredits = currentEnrollments.reduce((sum, enrollment) => {
        return sum + enrollment.CourseGroup.Course.CreditHours;
    }, 0);

    const currentUserAppointments = currentEnrollments.flatMap(
        enrollment => enrollment.CourseGroup.GroupSchedules || []
    );

    const registeredCourseIds = new Set(
        currentEnrollments.map(enrollment => enrollment.CourseGroup.Course.CourseID)
    );

    // Check Available Seats
    if (student.isLastTerm === false && courseGroup.CurrentEnrolled >= courseGroup.Capacity) {
      throw new ApiError("No seats available in this group", 400);
    }

    // Check Credit hours
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
      
    // Check Time Conflict
    const newGroupAppointments = courseGroup.GroupSchedules || [];

    const hasConflict = checkTimeConflict(newGroupAppointments, currentUserAppointments);
    if (hasConflict) {
      throw new ApiError ("Time Conflict",400)
    }

    // Check Subject Conflict
    const newCourseId = courseGroup.Course.CourseID;
    if (registeredCourseIds.has(newCourseId)) {
      throw new ApiError('You are already registered for this course in another group.', 400);
    }

    //////////////////// STEP(3): New Enrollment & AvailableSeats ////////////////////
    await db.Enrollment.create({
      StudentID: student.StudentID,
      GroupID: courseGroupId,
      status: "Registered",
    }, { transaction });

    await courseGroup.increment('CurrentEnrolled', { by: 1, transaction });
    courseGroup.CurrentEnrolled += 1;
    await transaction.commit();

    const availableSeats = courseGroup.Capacity - courseGroup.CurrentEnrolled;

    emitSeatsUpdate(courseGroupId, courseGroup.CurrentEnrolled, courseGroup.Capacity);

    //////////////////// STEP(4): Response ////////////////////
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
  const groupId = req.params.groupId;
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
    });

    const newAvailableSeats = enrollment.CourseGroup.Capacity - (enrollment.CourseGroup.CurrentEnrolled - 1);
    emitSeatsUpdate(groupId,  enrollment.CourseGroup.CurrentEnrolled - 1, enrollment.CourseGroup.Capacity);

    res.status(200).json({
      Success: true,
      message: "Enrollment dropped successfully and the seat has been made available."
    });
  } catch (error) {
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
    where: { StudentID: student.StudentID, Status:{[Op.ne]: 'Withdrawn'}},
    attributes:['GroupID'],
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


