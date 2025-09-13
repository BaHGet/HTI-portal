const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('CoursePrerequisite', {
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    PrerequisiteCourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'CoursePrerequisites',
    timestamps: false
  });
};
