const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Exam', {
    ExamID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    SemesterCourseID: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ExamType: {
      type: DataTypes.ENUM('Midterm', 'Final'),
      allowNull: false
    },
    ExamDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StartTime: {
      type: DataTypes.TIME, 
      allowNull: false
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Room: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'Exams',
    timestamps: false
  });
};

