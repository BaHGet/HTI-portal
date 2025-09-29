// استيراد البيانات الوهمية من الملف المخصص
const dummyData = require('./dummy-data.js');
// استيراد كائن db الذي يحتوي على كل الموديلات والعلاقات
const db = require('../models/index.js'); // المسار الصحيح للخروج من مجلد seeders والذهاب لمجلد models

// دالة رئيسية غير متزامنة لتنفيذ عملية البذر
const seedDatabase = async () => {
  console.log('Starting database seeding...');

  try {
    // ⚠️ تحذير خطير: هذا الأمر سيقوم بحذف كل الجداول والبيانات الموجودة فيها ثم يعيد إنشاءها من جديد
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized! (All tables dropped and recreated)');

    // إدخال البيانات بالترتيب الصحيح الذي يحترم العلاقات
    console.log('Seeding data from dummy-data.js...');
    
    // المستوى 0: جداول لا تعتمد على أي جداول أخرى
    await db.College.bulkCreate(dummyData.colleges);
    await db.TimePeriod.bulkCreate(dummyData.timePeriods);
    await db.Semester.bulkCreate(dummyData.semesters);
    console.log('✅ Seeded Level 0 data.');

    // المستوى 1: يعتمد على المستوى 0
    await db.Department.bulkCreate(dummyData.departments);
    console.log('✅ Seeded Level 1 data.');
    
    // المستوى 2: يعتمد على المستويات السابقة
    await db.AcademicRegulation.bulkCreate(dummyData.academicRegulations);
    await db.CourseCategory.bulkCreate(dummyData.courseCategories);
    await db.User.bulkCreate(dummyData.users);
    console.log('✅ Seeded Level 2 data.');

    // المستوى 3: يعتمد على المستويات السابقة
    await db.Student.bulkCreate(dummyData.students);
    await db.Professor.bulkCreate(dummyData.professors);
    await db.Course.bulkCreate(dummyData.courses);
    console.log('✅ Seeded Level 3 data.');

    // المستوى 4
    await db.CoursePrerequisite.bulkCreate(dummyData.coursePrerequisites);
    await db.SemesterCourse.bulkCreate(dummyData.semesterCourses);
    await db.CourseGroup.bulkCreate(dummyData.courseGroups);
    console.log('✅ Seeded Level 4 data.');

    // المستوى 5
    await db.Enrollment.bulkCreate(dummyData.enrollments);
    await db.Exam.bulkCreate(dummyData.exams);
    await db.GroupSchedule.bulkCreate(dummyData.groupSchedules);
    console.log('✅ Seeded Level 5 data.');
    
    // المستوى 6
    await db.Grade.bulkCreate(dummyData.grades);
    console.log('✅ Seeded Level 6 data.');

    // المستوى 7
    await db.StudentCompletedCourse.bulkCreate(dummyData.studentCompletedCourses);
    console.log('✅ Seeded Level 7 data.');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    // إغلاق الاتصال بقاعدة البيانات لإنهاء العملية
    await db.sequelize.close();
  }
};

// تشغيل الدالة
seedDatabase();

