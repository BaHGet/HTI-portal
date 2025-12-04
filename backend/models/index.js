const  Sequelize  = require('sequelize');

const {sequelize} = require('../config/mysqlDB');

const College = require('./colleges')(sequelize);
const Department = require('./departments')(sequelize);
const User = require('./userSql')(sequelize,Sequelize);
const Student = require('./students')(sequelize);
const Professor = require('./professors')(sequelize);
const AcademicRegulation = require('./academicRegulations')(sequelize);
const CourseCategory = require('./courseCategories')(sequelize);
const Course = require('./courses')(sequelize);
const Semester = require('./semesters')(sequelize);
const SemesterCourse = require('./semesterCourses')(sequelize);
const CoursePrerequisite = require('./coursePrerequisites')(sequelize);
const CourseGroup = require('./courseGroups')(sequelize);
const Enrollment = require('./enrollment')(sequelize); 
const Exam = require('./exams')(sequelize);
const TimePeriod = require('./timePeriod')(sequelize); 
const GroupSchedule = require('./groupSchedule')(sequelize); 
const Grade = require('./grades')(sequelize);
const GradeAppeal = require('./gradeAppeals')(sequelize);
const StudentCompletedCourse = require('./studentCompletedCourses')(sequelize);
const EvaluationQuestions = require('./evaluationQuestions')(sequelize);
const EvaluationTracking = require('./evaluationTracking')(sequelize);
const EvaluationAnswers = require('./evaluationAnswers')(sequelize);
const StudentFinancial = require('./studentFinancial')(sequelize);

//////////////////////////// Define Relationships between models ///////////////////////////////

// Relation between College and ( Departments )
College.hasMany(Department, { foreignKey: 'CollegeID' });
Department.belongsTo(College, { foreignKey: 'CollegeID' });

// Relation between User and ( Student & Professor )
User.hasOne(Student, { foreignKey: 'UserID' });
Student.belongsTo(User, { foreignKey: 'UserID' });

User.hasOne(Professor, { foreignKey: 'UserID' });
Professor.belongsTo(User, { foreignKey: 'UserID' });

// Relation between Department and ( Student & Professor )
Department.hasMany(Student, { foreignKey: 'DepartmentID' });
Student.belongsTo(Department, { foreignKey: 'DepartmentID' });

Department.hasMany(Professor, { foreignKey: 'DepartmentID' });
Professor.belongsTo(Department, { foreignKey: 'DepartmentID' });

// Relation between Department and ( CourseCategories & Courses )
Department.hasMany(CourseCategory, { foreignKey: 'DepartmentID' });
CourseCategory.belongsTo(Department, { foreignKey: 'DepartmentID' });

Department.hasMany(Course, { foreignKey: 'DepartmentID' });
Course.belongsTo(Department, { foreignKey: 'DepartmentID' });

// Relation between Courses and ( CourseCategory & AcademicRegulations)
Course.belongsTo(CourseCategory, { foreignKey: 'CourseCategoryID' });
CourseCategory.hasMany(Course, { foreignKey: 'CourseCategoryID' });

Course.belongsTo(AcademicRegulation, { foreignKey: 'RegulationID' });
AcademicRegulation.hasMany(Course, { foreignKey: 'RegulationID' });

// Relation between CoursePrerequisites and ( Courses )
Course.belongsToMany(Course, {
  through: CoursePrerequisite,
  as: 'Prerequisites', 
  foreignKey: 'CourseID',
  otherKey: 'PrerequisiteCourseID'
});
Course.belongsToMany(Course, {
  through: CoursePrerequisite,
  as: 'IsPrerequisiteFor', 
  foreignKey: 'PrerequisiteCourseID',
  otherKey: 'CourseID'
});

// Relation between SemesterCourses and (Semester & Courses) - many to many
Course.belongsToMany(Semester, { through: SemesterCourse, foreignKey: 'CourseID' });
Semester.belongsToMany(Course, { through: SemesterCourse, foreignKey: 'SemesterID' });

SemesterCourse.belongsTo(Course, { foreignKey: 'CourseID' });
Course.hasMany(SemesterCourse, { foreignKey: 'CourseID' });

SemesterCourse.belongsTo(Semester, { foreignKey: 'SemesterID' });
Semester.hasMany(SemesterCourse, { foreignKey: 'SemesterID' });

// Relation between CourseGroups and (Semester & Courses & Professors) 
CourseGroup.belongsTo(Course, { foreignKey: 'CourseID' });
Course.hasMany(CourseGroup, { foreignKey: 'CourseID' });

CourseGroup.belongsTo(Semester, { foreignKey: 'SemesterID' });
Semester.hasMany(CourseGroup, { foreignKey: 'SemesterID' });

CourseGroup.belongsTo(Professor, { foreignKey: 'ProfessorID' });
Professor.hasMany(CourseGroup, { foreignKey: 'ProfessorID' });

// Relation between Enrollment and (Student & CourseGroup) 
Enrollment.belongsTo(Student, { foreignKey: 'StudentID' });
Student.hasMany(Enrollment, { foreignKey: 'StudentID' });

Enrollment.belongsTo(CourseGroup, { foreignKey: 'GroupID' });
CourseGroup.hasMany(Enrollment, { foreignKey: 'GroupID' });

// Relation between Exam and (SemesterCourse)
Exam.belongsTo(SemesterCourse, { foreignKey: 'SemesterCourseID' });
SemesterCourse.hasMany(Exam, { foreignKey: 'SemesterCourseID' });

// Relation between GroupSchedule and (CourseGroup & TimePeriod)
GroupSchedule.belongsTo(CourseGroup, { foreignKey: 'GroupID', onDelete: 'CASCADE' });
CourseGroup.hasMany(GroupSchedule, { foreignKey: 'GroupID' });

GroupSchedule.belongsTo(TimePeriod, { foreignKey: 'PeriodID' });
TimePeriod.hasMany(GroupSchedule, { foreignKey: 'PeriodID' });

// Relation between Grade and ( Enrollment & Semester)
Grade.belongsTo(Enrollment, { foreignKey: 'EnrollmentID' });
Enrollment.hasOne(Grade, { foreignKey: 'EnrollmentID' });

Grade.belongsTo(Semester, { foreignKey: 'SemesterID' });
Semester.hasMany(Grade, { foreignKey: 'SemesterID' });

// Relation between StudentCompletedCourse and ( Student & Course & Semester & Grade)
Student.belongsToMany(Course, { through: StudentCompletedCourse, foreignKey: 'StudentID' });
Course.belongsToMany(Student, { through: StudentCompletedCourse, foreignKey: 'CourseID' });

StudentCompletedCourse.belongsTo(Semester, { foreignKey: 'SemesterID' });
Semester.hasMany(StudentCompletedCourse, { foreignKey: 'SemesterID' });

StudentCompletedCourse.belongsTo(Grade, { foreignKey: 'GradeID' });
Grade.hasMany(StudentCompletedCourse, { foreignKey: 'GradeID' });

// Relation between AcademicRegulation and ( Student & Department)
Department.hasMany(AcademicRegulation, { foreignKey: 'DepartmentID' });
AcademicRegulation.belongsTo(Department, { foreignKey: 'DepartmentID' });

AcademicRegulation.hasMany(Student, { foreignKey: 'RegulationID' });
Student.belongsTo(AcademicRegulation, { foreignKey: 'RegulationID' });

// Relation between GradeAppeal and ( Student & Grades)
Grade.hasOne(GradeAppeal, { foreignKey: 'GradeID' });
GradeAppeal.belongsTo(Grade, { foreignKey: 'GradeID' });

Student.hasMany(GradeAppeal, { foreignKey: 'StudentID' });
GradeAppeal.belongsTo(Student, { foreignKey: 'StudentID' });

// Relation between EvaluationTracking and ( Enrollment )
EvaluationTracking.belongsTo(Enrollment, { foreignKey: 'EnrollmentID' });
Enrollment.hasOne(EvaluationTracking, { foreignKey: 'EnrollmentID' });

// Relation between EvaluationAnswer and ( EvaluationQuestion )
EvaluationAnswers.belongsTo(EvaluationQuestions, { foreignKey: 'QuestionID' });
EvaluationQuestions.hasMany(EvaluationAnswers, { foreignKey: 'QuestionID' });

// Relation between EvaluationAnswer and ( CourseGroup )
EvaluationAnswers.belongsTo(CourseGroup, { foreignKey: 'GroupID' });
CourseGroup.hasMany(EvaluationAnswers, { foreignKey: 'GroupID' });

// Relation between Student and ( StudentFinancials )
Student.hasMany(StudentFinancial, { foreignKey: 'StudentID' });
StudentFinancial.belongsTo(Student, { foreignKey: 'StudentID' });

const db = {
  sequelize, 
  Sequelize,
  College, 
  Department, 
  User, 
  Student, 
  Professor, 
  AcademicRegulation, 
  CourseCategory, 
  Course, 
  Semester,
  SemesterCourse, 
  CoursePrerequisite, 
  CourseGroup,  
  Enrollment,
  Exam, 
  TimePeriod,
  GroupSchedule,
  Grade, 
  GradeAppeal,
  StudentCompletedCourse,
  EvaluationQuestions,
  EvaluationTracking,
  EvaluationAnswers,
  StudentFinancial
};


module.exports = db;


