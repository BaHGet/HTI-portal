const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Course', {
    CourseID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CourseCode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    CourseName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CreditHours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RegulationID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CourseCategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Courses',
    timestamps: false
  });
};
