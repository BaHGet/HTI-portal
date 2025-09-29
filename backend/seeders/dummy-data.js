// استيراد مكتبة Faker لتوليد البيانات الوهمية باللغة العربية
const { fakerAR: faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs'); // مكتبة لتشفير كلمات المرور

// ================== إعدادات قابلة للتعديل ==================
const NUM_STUDENTS = 500;
const NUM_PROFESSORS = 25;
const NUM_COURSES_PER_DEPT = 20;
const NUM_GROUPS_PER_COURSE_SEMESTER = 2;
// ==========================================================

// --- توليد بيانات أساسية ---
const colleges = [{ CollegeID: 1, CollegeName: 'كلية الحاسبات والذكاء الاصطناعي' }];

const departments = [
  { DepartmentID: 1, DepartmentName: 'علوم الحاسب', CollegeID: 1 },
  { DepartmentID: 2, DepartmentName: 'نظم المعلومات', CollegeID: 1 },
  { DepartmentID: 3, DepartmentName: 'تكنولوجيا المعلومات', CollegeID: 1 },
  { DepartmentID: 4, DepartmentName: 'الذكاء الاصطناعي', CollegeID: 1 },
];

const academicRegulations = [
  { RegulationID: 1, RegulationName: 'لائحة 2024 - علوم الحاسب', DepartmentID: 1, TotalRequiredCredits: 172 },
  { RegulationID: 2, RegulationName: 'لائحة 2024 - نظم المعلومات', DepartmentID: 2, TotalRequiredCredits: 170 },
  { RegulationID: 3, RegulationName: 'لائحة 2024 - تكنولوجيا المعلومات', DepartmentID: 3, TotalRequiredCredits: 168 },
  { RegulationID: 4, RegulationName: 'لائحة 2024 - الذكاء الاصطناعي', DepartmentID: 4, TotalRequiredCredits: 175 },
];

const courseCategories = [
  { CourseCategoryID: 1, DepartmentID: 1, CategoryName: 'متطلب تخصص إجباري', RequiredCredits: 60 },
  { CourseCategoryID: 2, DepartmentID: 1, CategoryName: 'متطلب تخصص اختياري', RequiredCredits: 15 },
  { CourseCategoryID: 3, DepartmentID: 1, CategoryName: 'متطلب كلية', RequiredCredits: 20 },
];

const semesters = [
    { SemesterID: 1, SemesterName: 'خريف 2024', StartDate: '2024-09-01', EndDate: '2024-12-31', AcademicYear: '2024/2025' },
    { SemesterID: 2, SemesterName: 'ربيع 2025', StartDate: '2025-02-01', EndDate: '2025-05-31', AcademicYear: '2024/2025' },
    { SemesterID: 3, SemesterName: 'خريف 2025', StartDate: '2025-09-01', EndDate: '2025-12-31', AcademicYear: '2025/2026' },
];

const timePeriods = [
    { PeriodID: 1, PeriodName: 'P1', StartTime: '08:00:00', EndTime: '08:45:00' },
    { PeriodID: 2, PeriodName: 'P2', StartTime: '08:45:00', EndTime: '09:30:00' },
    { PeriodID: 3, PeriodName: 'P3', StartTime: '09:45:00', EndTime: '10:30:00' },
    { PeriodID: 4, PeriodName: 'P4', StartTime: '10:30:00', EndTime: '11:15:00' },
];

const users = [];
const students = [];
const professors = [];
let userIdCounter = 1;

// --- توليد بيانات المستخدمين والطلاب ---
for (let i = 1; i <= NUM_STUDENTS; i++) {
    const fullName = faker.person.firstName() + ' ' + faker.person.lastName();
    const email = faker.internet.email({ firstName: `student${i}` });

    users.push({
        UserID: userIdCounter,
        FullName: fullName,
        Email: email,
        PasswordHash: bcrypt.hashSync('123456', 10),
        AccountType: 'student',
        Gender: faker.helpers.arrayElement(['male', 'female'])
    });

    const department = faker.helpers.arrayElement(departments);
    students.push({
        StudentID: 20240000 + i, // ID جامعي فريد
        UserID: userIdCounter,
        DepartmentID: department.DepartmentID,
        RegulationID: department.DepartmentID, // ربط الطالب بلائحة قسمه
        gpa: faker.number.float({ min: 2.0, max: 4.0, precision: 0.01 }),
        CreditHours: faker.number.int({ min: 12, max: 90 }),
        isLastTerm: faker.datatype.boolean() // تمت إضافة الحقل الجديد
    });
    userIdCounter++;
}

// --- توليد بيانات الأساتذة ---
for (let i = 1; i <= NUM_PROFESSORS; i++) {
    const fullName = 'د. ' + faker.person.firstName() + ' ' + faker.person.lastName();
    const email = faker.internet.email({ firstName: `prof${i}` });

    users.push({
        UserID: userIdCounter,
        FullName: fullName,
        Email: email,
        PasswordHash: bcrypt.hashSync('123456', 10),
        AccountType: 'professor',
        Gender: faker.helpers.arrayElement(['male', 'female'])
    });
    
    professors.push({
        ProfessorID: 1000 + i, // ID وظيفي فريد
        UserID: userIdCounter,
        DepartmentID: faker.helpers.arrayElement(departments).DepartmentID,
        AcademicTitle: faker.helpers.arrayElement(['أستاذ مساعد', 'محاضر', 'أستاذ'])
    });
    userIdCounter++;
}

// --- توليد بيانات المواد ---
const courses = [];
let courseIdCounter = 1;
departments.forEach(dept => {
    for(let i=1; i <= NUM_COURSES_PER_DEPT; i++) {
        courses.push({
            CourseID: courseIdCounter,
            CourseCode: `${dept.DepartmentName.substring(0,2).toUpperCase()}${100+i}`,
            CourseName: `مادة ${dept.DepartmentName} رقم ${i}`,
            CreditHours: faker.helpers.arrayElement([2, 3]),
            DepartmentID: dept.DepartmentID,
            RegulationID: dept.DepartmentID,
            CourseCategoryID: faker.helpers.arrayElement(courseCategories).CourseCategoryID,
        });
        courseIdCounter++;
    }
});


// --- توليد بيانات متطلبات سابقة (مثال بسيط) ---
const coursePrerequisites = [];
for (let i = 0; i < courses.length - 1; i++) {
    if (courses[i].DepartmentID === courses[i+1].DepartmentID) {
        coursePrerequisites.push({ CourseID: courses[i+1].CourseID, PrerequisiteCourseID: courses[i].CourseID });
    }
}

// --- توليد بيانات المواد المتاحة بالفصول والجروبات ---
const semesterCourses = [];
const courseGroups = [];
let semesterCourseIdCounter = 1;
let groupIdCounter = 1;
semesters.forEach(semester => {
    courses.forEach(course => {
        semesterCourses.push({
            SemesterCourseID: semesterCourseIdCounter,
            SemesterID: semester.SemesterID,
            CourseID: course.CourseID,
        });
        for(let i = 1; i <= NUM_GROUPS_PER_COURSE_SEMESTER; i++) {
            courseGroups.push({
                GroupID: groupIdCounter,
                CourseID: course.CourseID,
                SemesterID: semester.SemesterID,
                GroupNumber: `G${i}`,
                Capacity: faker.number.int({ min: 30, max: 100 }),
                ProfessorID: faker.helpers.arrayElement(professors).ProfessorID
            });
            groupIdCounter++;
        }
        semesterCourseIdCounter++;
    });
});


// --- توليد بيانات تسجيلات وهمية ---
const enrollments = [];
const grades = [];
let enrollmentIdCounter = 1;
students.forEach(student => {
    for(let i=0; i<5; i++){
        const randomGroup = faker.helpers.arrayElement(courseGroups);
        enrollments.push({
            EnrollmentID: enrollmentIdCounter,
            StudentID: student.StudentID,
            GroupID: randomGroup.GroupID,
            Status: faker.helpers.arrayElement(['Registered', 'Completed', 'Failed'])
        });

        const midterm = faker.number.float({min: 10, max: 25, precision: 0.5});
        const final = faker.number.float({min: 20, max: 50, precision: 0.5});
        const activities = faker.number.float({min: 5, max: 25, precision: 0.5});
        grades.push({
            GradeID: enrollmentIdCounter,
            EnrollmentID: enrollmentIdCounter,
            Midterm: midterm,
            Final: final,
            Activities: activities,
            LetterGrade: faker.helpers.arrayElement(['A+', 'B', 'C+', 'D', 'F']),
            SemesterID: randomGroup.SemesterID
        });
        enrollmentIdCounter++;
    }
});

// --- توليد بيانات جداول ومواعيد وهمية ---
const groupSchedules = [];
let scheduleIdCounter = 1;
courseGroups.forEach(group => {
    groupSchedules.push({
        ScheduleID: scheduleIdCounter++,
        GroupID: group.GroupID,
        DayOfWeek: faker.helpers.arrayElement(['D1', 'D2', 'D3', 'D4', 'D5']),
        PeriodID: faker.helpers.arrayElement(timePeriods).PeriodID,
        Room: `Room ${faker.number.int({ min: 101, max: 404 })}`,
        SessionType: 'Lecture'
    });
});

const exams = []; 
const studentCompletedCourses = [];


// تصدير كل البيانات لتكون جاهزة للاستخدام في سكربت الإدخال
module.exports = {
    colleges, departments, academicRegulations, courseCategories, semesters,
    timePeriods, users, students, professors, courses, coursePrerequisites,
    semesterCourses, courseGroups, enrollments, grades, groupSchedules,
    exams, studentCompletedCourses
};

