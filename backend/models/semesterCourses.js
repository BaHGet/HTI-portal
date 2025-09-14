const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SemesterCourse', {
    SemesterCourseID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    SemesterID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CourseID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'SemesterCourses',
    timestamps: false
  });
};
