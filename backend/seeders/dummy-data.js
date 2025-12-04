// استيراد مكتبة Faker لتوليد البيانات الوهمية
const { fakerAR: faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// ===================================================================================
// --- 1. البيانات الأساسية الثابتة ---
// ===================================================================================

const colleges = [
  { CollegeID: 1, CollegeName: 'كلية الهندسة والتكنولوجيا' }
];

const departments = [
  { DepartmentID: 1, DepartmentName: 'ميكاترونكس', CollegeID: 1 },
  { DepartmentID: 2, DepartmentName: 'اتصالات', CollegeID: 1 },
  { DepartmentID: 3, DepartmentName: 'طبية', CollegeID: 1 },
];

const academicRegulations = [
  { RegulationID: 1, RegulationName: 'لائحة 2024 - ميكاترونكس', DepartmentID: 1, TotalRequiredCredits: 160 },
  { RegulationID: 2, RegulationName: 'لائحة 2024 - اتصالات', DepartmentID: 2, TotalRequiredCredits: 170 },
  { RegulationID: 3, RegulationName: 'لائحة 2024 - طبية', DepartmentID: 3, TotalRequiredCredits: 180 },
];

const courseCategories = [
  { CourseCategoryID: 1, DepartmentID: 1, CategoryName: 'متطلبات تخصص إجبارية' },
  { CourseCategoryID: 2, DepartmentID: 1, CategoryName: 'متطلبات تخصص اختيارية' },
  { CourseCategoryID: 3, DepartmentID: 2, CategoryName: 'متطلبات تخصص إجبارية' },
  { CourseCategoryID: 4, DepartmentID: 2, CategoryName: 'متطلبات تخصص اختيارية' },
  { CourseCategoryID: 5, DepartmentID: 3, CategoryName: 'متطلبات تخصص إجبارية' },
  { CourseCategoryID: 6, DepartmentID: 3, CategoryName: 'متطلبات تخصص اختيارية' },
];

const today = new Date();
const semesters = [
    { SemesterID: 1, SemesterName: 'ربيع 2025', StartDate: '2025-02-01', EndDate: '2025-05-31' }, // Past Semester
    { SemesterID: 2, SemesterName: 'خريف 2025', StartDate: new Date(today.getFullYear(), 8, 1), EndDate: new Date(today.getFullYear(), 11, 28) }, // Current Active Semester
];
const CURRENT_SEMESTER_ID = 2;
const PAST_SEMESTER_ID = 1;

const timePeriods = [
    { PeriodID: 1, PeriodName: 'P1', StartTime: '08:00:00', EndTime: '09:30:00' },
    { PeriodID: 2, PeriodName: 'P2', StartTime: '09:45:00', EndTime: '11:15:00' },
    { PeriodID: 3, PeriodName: 'P3', StartTime: '11:30:00', EndTime: '13:00:00' },
];

// ===================================================================================
// --- 2. توليد المستخدمين (Admins, Students, Professors) ---
// ===================================================================================

const users = []; 
const students = []; 
const professors = [];
let userIdCounter = 1;
let studentIdCounter = 2021000;

// إنشاء 2 Admin
for (let i = 1; i <= 2; i++) {
    const fullName = `مسؤول ${i}`;
    users.push({ UserID: userIdCounter, FullName: fullName, Email: `admin${i}@test.com`, PasswordHash: bcrypt.hashSync('123456', 10), AccountType: 'admin' });
    userIdCounter++;
}

// إنشاء 9 طلاب
departments.forEach(dept => {
    for (let i = 1; i <= 3; i++) {
        const isLastTermStudent = (i === 1); 
        const fullName = `طالب ${dept.DepartmentName} ${i}`;
        users.push({ UserID: userIdCounter, FullName: fullName, Email: `student_${dept.DepartmentName.slice(0,3)}${i}@test.com`, PasswordHash: bcrypt.hashSync('123456', 10), AccountType: 'student' });
        students.push({ 
            StudentID: studentIdCounter++, 
            UserID: userIdCounter,
            StudentName: fullName, 
            DepartmentID: dept.DepartmentID, 
            RegulationID: dept.DepartmentID, 
            gpa: isLastTermStudent ? 3.5 : faker.number.float({ min: 2.1, max: 3.4, precision: 0.01 }),
            isLastTerm: isLastTermStudent 
        });
        userIdCounter++;
    }
});

// إنشاء 3 أساتذة
for (let i = 1; i <= 3; i++) {
    const fullName = `د. أستاذ ${i}`;
    users.push({ UserID: userIdCounter, FullName: fullName, Email: `prof${i}@test.com`, PasswordHash: bcrypt.hashSync('123456', 10), AccountType: 'professor' });
    professors.push({ 
        ProfessorID: 1000 + i, 
        UserID: userIdCounter, 
        ProfessorName: fullName, 
        DepartmentID: departments[i-1].DepartmentID 
    });
    userIdCounter++;
}

// ===================================================================================
// --- 3. توليد المواد والمتطلبات ---
// ===================================================================================

const courses = []; 
const coursePrerequisites = [];
let courseIdCounter = 100;

departments.forEach(dept => {
    const deptCategories = courseCategories.filter(c => c.DepartmentID === dept.DepartmentID);
    
    deptCategories.forEach(category => {
        let lastCourseId = null;
        for (let i = 1; i <= 5; i++) {
            const courseId = courseIdCounter++;
            courses.push({ 
                CourseID: courseId, 
                CourseCode: `${dept.DepartmentName.slice(0,3).toUpperCase()}${category.CourseCategoryID*100 + i}`, 
                CourseName: `مادة ${i} (${category.CategoryName})`, 
                CreditHours: 3, 
                DepartmentID: dept.DepartmentID, 
                RegulationID: dept.DepartmentID, 
                CourseCategoryID: category.CourseCategoryID
            });
            if (i > 1 && lastCourseId) { 
                coursePrerequisites.push({ CourseID: courseId, PrerequisiteCourseID: lastCourseId }); 
            }
            lastCourseId = courseId;
        }
    });
});

// ===================================================================================
// --- 4. ربط المواد بالفصول الدراسية ---
// ===================================================================================

const semesterCourses = [];
let semesterCourseIdCounter = 1;
courses.forEach(course => {
    semesterCourses.push({ SemesterCourseID: semesterCourseIdCounter++, CourseID: course.CourseID, SemesterID: PAST_SEMESTER_ID });
    
    if (course.CourseID % 10 < 7) {
        semesterCourses.push({ SemesterCourseID: semesterCourseIdCounter++, CourseID: course.CourseID, SemesterID: CURRENT_SEMESTER_ID });
    }
});

// ===================================================================================
// --- 5. توليد الجروبات والجداول ---
// ===================================================================================

const courseGroups = []; 
const groupSchedules = [];
let groupIdCounter = 1;

const currentSemesterCourseIds = semesterCourses.filter(sc => sc.SemesterID === CURRENT_SEMESTER_ID).map(sc => sc.CourseID);
currentSemesterCourseIds.forEach(courseId => {
    const capacity = 30;
    const enrolled = 29; 
    
    const group1Id = groupIdCounter++;
    courseGroups.push({ GroupID: group1Id, CourseID: courseId, SemesterID: CURRENT_SEMESTER_ID, GroupNumber: `G1`, Capacity: capacity, CurrentEnrolled: enrolled, ProfessorID: faker.helpers.arrayElement(professors).ProfessorID });
    groupSchedules.push({ GroupID: group1Id, DayOfWeek: 'D2', PeriodID: 1, Room: `R101` }); 

    const group2Id = groupIdCounter++;
    courseGroups.push({ GroupID: group2Id, CourseID: courseId, SemesterID: CURRENT_SEMESTER_ID, GroupNumber: `G2`, Capacity: capacity, CurrentEnrolled: enrolled, ProfessorID: faker.helpers.arrayElement(professors).ProfessorID });
    groupSchedules.push({ GroupID: group2Id, DayOfWeek: 'D2', PeriodID: 1, Room: `R102` });

    const group3Id = groupIdCounter++;
    courseGroups.push({ GroupID: group3Id, CourseID: courseId, SemesterID: CURRENT_SEMESTER_ID, GroupNumber: `G3`, Capacity: capacity, CurrentEnrolled: enrolled, ProfessorID: faker.helpers.arrayElement(professors).ProfessorID });
    groupSchedules.push({ GroupID: group3Id, DayOfWeek: 'D3', PeriodID: 2, Room: `R201` });
});

const pastSemesterCourseIds = semesterCourses.filter(sc => sc.SemesterID === PAST_SEMESTER_ID).map(sc => sc.CourseID);
pastSemesterCourseIds.forEach(courseId => {
    courseGroups.push({ 
        GroupID: groupIdCounter++, 
        CourseID: courseId, 
        SemesterID: PAST_SEMESTER_ID, 
        GroupNumber: 'G1', 
        Capacity: 50, 
        ProfessorID: faker.helpers.arrayElement(professors).ProfessorID 
    });
});

// ===================================================================================
// --- 6. توليد تاريخ دراسي ---
// ===================================================================================

const enrollments = [];
const grades = [];
const studentCompletedCourses = [];
let enrollmentIdCounter = 1;
let gradeIdCounter = 1;

const studentsWithHistory = students.filter(s => !s.isLastTerm);

studentsWithHistory.forEach(student => {
    const studentDeptCourses = courses.filter(c => c.DepartmentID === student.DepartmentID).slice(0, 2);

    studentDeptCourses.forEach(course => {
        const groupForHistory = courseGroups.find(g => g.CourseID === course.CourseID && g.SemesterID === PAST_SEMESTER_ID);

        if (groupForHistory) {
            enrollments.push({
                EnrollmentID: enrollmentIdCounter,
                StudentID: student.StudentID,
                GroupID: groupForHistory.GroupID,
                Status: 'Completed'
            });

            grades.push({
                GradeID: gradeIdCounter,
                EnrollmentID: enrollmentIdCounter,
                Midterm: 20, Final: 45, Activities: 20, LetterGrade: 'A',
                SemesterID: PAST_SEMESTER_ID
            });

            studentCompletedCourses.push({
                StudentID: student.StudentID,
                CourseID: course.CourseID,
                SemesterID: PAST_SEMESTER_ID,
                GradeID: gradeIdCounter
            });
            
            enrollmentIdCounter++;
            gradeIdCounter++;
        }
    });
});

// ===================================================================================
// --- 7. توليد الامتحانات ---
// ===================================================================================

const exams = [];
let examIdCounter = 1;

semesterCourses.forEach(sc => {
    const isPastSemester = sc.SemesterID === PAST_SEMESTER_ID;
    
    exams.push({
        ExamID: examIdCounter++,
        SemesterCourseID: sc.SemesterCourseID,
        ExamType: 'Midterm',
        ExamDate: isPastSemester ? '2025-03-15' : '2025-10-15',
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        Room: `M-${faker.number.int({ min: 101, max: 200 })}`
    });

    exams.push({
        ExamID: examIdCounter++,
        SemesterCourseID: sc.SemesterCourseID,
        ExamType: 'Final',
        ExamDate: isPastSemester ? '2025-05-20' : '2025-12-10',
        StartTime: '09:00:00',
        EndTime: '12:00:00',
        Room: `F-${faker.number.int({ min: 301, max: 400 })}`
    });
});

const evaluationQuestions = [
    { QuestionID: 1, QuestionText: 'ما هو تقييمك لأداء الدكتور وشرحه للمادة؟', TargetType: 'Professor', IsActive: true },
    { QuestionID: 2, QuestionText: 'ما هو تقييمك لأداء المعيد في السكشن/المعمل؟', TargetType: 'Assistant', IsActive: true },
    { QuestionID: 3, QuestionText: 'ما هو تقييمك للمحتوى العلمي للمادة؟', TargetType: 'Course', IsActive: true },
    { QuestionID: 4, QuestionText: 'ما هي مقترحاتك للتحسين والتطوير؟', TargetType: 'General', IsActive: true }
];

// ===================================================================================
// --- 8. (جديد) البيانات المالية للطلاب ---
// ===================================================================================

const studentFinancials = [];
const CURRENT_ACADEMIC_YEAR = '2025/2026'; // السنة الدراسية الحالية المتوافقة مع خريف 2025

students.forEach(student => {
    // 1. تحديد المصاريف الأساسية والإضافية
    const basicFees = 20000.00;
    const cardFees = 200.00;
    // إضافة تنوع: بعض الطلاب عليهم مصاريف إضافية أو إعادة
    const additionalFees = faker.datatype.boolean() ? 500.00 : 0.00;
    const retakeFees = faker.datatype.boolean() ? 300.00 : 0.00;
    const appealFees = 0.00;

    // حساب الإجماليات
    const totalRequired = basicFees + cardFees + additionalFees + retakeFees + appealFees;
    // القسط الأول عادة يشمل الكارنيه + الإضافي + الإعادة + نصف المصاريف الأساسية
    const firstInstallmentReq = (basicFees / 2) + cardFees + additionalFees + retakeFees;

    // 2. تحديد حالة الدفع (سيناريوهات مختلفة للـ Testing)
    // none: لم يدفع شيء
    // partial: دفع جزء بسيط
    // first_installment: دفع القسط الأول بالكامل
    // full: دفع المصاريف بالكامل
    const paymentScenario = faker.helpers.arrayElement(['none', 'partial', 'first_installment', 'full']);
    
    let totalPaid = 0;
    let isFirstPaid = false;
    let isFullPaid = false;

    switch (paymentScenario) {
        case 'none':
            totalPaid = 0;
            break;
        case 'partial':
            totalPaid = 3000.00; // مبلغ عشوائي أقل من القسط الأول
            break;
        case 'first_installment':
            totalPaid = firstInstallmentReq;
            isFirstPaid = true;
            break;
        case 'full':
            totalPaid = totalRequired;
            isFirstPaid = true;
            isFullPaid = true;
            break;
    }

    studentFinancials.push({
        StudentID: student.StudentID,
        AcademicYear: CURRENT_ACADEMIC_YEAR,
        BasicFees: basicFees,
        AdditionalFees: additionalFees,
        CardFees: cardFees,
        RetakeFees: retakeFees,
        AppealFees: appealFees,
        FirstInstallmentAmount: firstInstallmentReq,
        TotalPaid: totalPaid,
        IsFirstInstallmentPaid: isFirstPaid,
        IsFullPaid: isFullPaid
    });
});

// ===================================================================================
// --- 9. تصدير كل البيانات ---
// ===================================================================================

module.exports = {
    colleges, departments, academicRegulations, courseCategories, semesters, timePeriods, users,
    students, professors, courses, coursePrerequisites, semesterCourses,
    studentCompletedCourses, courseGroups, groupSchedules,
    enrollments, grades, exams, evaluationQuestions, studentFinancials 
};