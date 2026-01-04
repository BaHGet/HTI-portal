const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const db = require("../models/index");




exports.PendingEvaluations=asyncHandler(async(req,res,next)=>{
  const student = req.student;
  const enrollmentId = req.params.enrollmentId

  ////// STEP (1): Queries //////
  const [enrollment, questions] = await Promise.all([

    db.Enrollment.findOne({
    where: { 
      EnrollmentID: enrollmentId,
      StudentID: student.StudentID 
    },
    attributes: ['EnrollmentID'], 
    include: [
      {
        model: db.EvaluationTracking, 
        required: false 
      }
    ]
  }),

  db.EvaluationQuestions.findAll({
    where: { IsActive: true },
    attributes: ['QuestionID', 'QuestionText', 'TargetType']
  })
  ]) 

  ////// STEP (2): Checks //////
  if (!enrollment) {
    return res.status(404).json({ status: 'fail', message: 'Enrollment not found or access denied.' });
  }
  if (enrollment.EvaluationTracking) {
    return res.status(400).json({ 
      status: 'fail', 
      message: 'You have already submitted evaluation for this course.',
      isEvaluated: true 
    });
  } 

  ////// STEP (3): Formatting Results //////
  const structuredQuestions = {
    Course: questions.filter(q => q.TargetType === 'Course'),
    Professor: questions.filter(q => q.TargetType === 'Professor'),
    Assistant: questions.filter(q => q.TargetType === 'Assistant'),
    General: questions.filter(q => q.TargetType === 'General')
  };

  ////// STEP (4): Response //////
  res.status(200).json({
    status: 'success',
    isEvaluated: false,
    data: structuredQuestions
  });
});




exports.EvaluationAnswer=asyncHandler(async(req,res,next)=>{
  const student = req.student;
  const enrollmentId = req.params.enrollmentId
  const { answers } = req.body

  ////// STEP (1): Check //////
  const enrollment = await db.Enrollment.findOne({
    where: { 
      EnrollmentID: enrollmentId,
      StudentID: student.StudentID 
    },
    attributes: ['EnrollmentID'],
    include: [{
      model: db.CourseGroup,
      attributes: ['GroupID'] 
    }]
  });

  if (!enrollment) {
    return next(new ApiError('Enrollment not found or access denied.', 404));
  }


  const t = await db.sequelize.transaction();
  try {
    await db.EvaluationTracking.create(
      { EnrollmentID: enrollmentId },
      { transaction: t }
    );

    const groupId = enrollment.CourseGroup.GroupID;

    const formattedAnswers = answers.map(ans => {
      return {
        QuestionID: ans.questionId,
        GroupID: groupId,
        Score: (ans.score) ? ans.score : null, 
        TextResponse: (ans.text) ? ans.text : null 
      };
    });

    await db.EvaluationAnswers.bulkCreate(formattedAnswers, { transaction: t });
    await t.commit();

    res.status(201).json({
      status: 'success',
      message: 'Evaluation submitted successfully.'
    });
  }catch(error){

    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new ApiError('You have already submitted evaluation for this course.', 400));
    }
    return next(error);
  }
})


