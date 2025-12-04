require("dotenv").config();
const dummyData = require('./dummy-data');
const db = require('../models'); // تأكد من أن المسار صحيح

const seedDatabase = async () => {
  console.log('Starting custom database seeding...');

  try {
    // --- 1. إعادة إنشاء الجداول ---
    
    console.log('Seeding data in correct order...');

    // --- 2. إدخال البيانات بالترتيب الصحيح ---
    
    // المستوى 0: جداول لا تعتمد على أي شيء
    await db.College.bulkCreate(dummyData.colleges);
    await db.TimePeriod.bulkCreate(dummyData.timePeriods);
    await db.Semester.bulkCreate(dummyData.semesters);

    // المستوى 1: يعتمد على المستوى 0
    await db.Department.bulkCreate(dummyData.departments);
    
    // المستوى 2: يعتمد على المستويات السابقة
    await db.AcademicRegulation.bulkCreate(dummyData.academicRegulations);
    await db.CourseCategory.bulkCreate(dummyData.courseCategories);
    await db.User.bulkCreate(dummyData.users);

    // المستوى 3:
    await db.Student.bulkCreate(dummyData.students);
    await db.Professor.bulkCreate(dummyData.professors);
    await db.Course.bulkCreate(dummyData.courses);
    
    // المستوى 4:
    await db.CoursePrerequisite.bulkCreate(dummyData.coursePrerequisites);
    await db.SemesterCourse.bulkCreate(dummyData.semesterCourses);
    await db.CourseGroup.bulkCreate(dummyData.courseGroups);

    // المستوى 5:
    await db.GroupSchedule.bulkCreate(dummyData.groupSchedules);

    // المستوى 6: (التاريخ الدراسي)
    await db.Enrollment.bulkCreate(dummyData.enrollments);
    
    // المستوى 7:
    await db.Grade.bulkCreate(dummyData.grades);
    
    // المستوى 8:
    await db.StudentCompletedCourse.bulkCreate(dummyData.studentCompletedCourses);
    
    if (dummyData.exams && dummyData.exams.length > 0) {
        await db.Exam.bulkCreate(dummyData.exams);
    }

    if (dummyData.evaluationQuestions && dummyData.evaluationQuestions.length > 0) {
        await db.EvaluationQuestions.bulkCreate(dummyData.evaluationQuestions);
    }

    if (dummyData.studentFinancials && dummyData.studentFinancials.length > 0) {
      await db.StudentFinancial.bulkCreate(dummyData.studentFinancials);
    }

    console.log('🎉 Seeding completed successfully with custom data!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await db.sequelize.close();
  }
};

seedDatabase();

