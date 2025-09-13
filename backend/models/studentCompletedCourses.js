const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('StudentCompletedCourse', {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    SemesterID: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    GradeID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CompletionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'StudentCompletedCourses',
    timestamps: false
  });
};

