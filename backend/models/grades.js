const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Grade', {
    GradeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    EnrollmentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Midterm: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Final: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Activities: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    LetterGrade: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    AttemptNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    IsRetake: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    SemesterID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AcademicYear: {
      type: DataTypes.STRING(9),
      allowNull: true
    }
  }, {
    tableName: 'Grades',
    timestamps: false
  });
};

