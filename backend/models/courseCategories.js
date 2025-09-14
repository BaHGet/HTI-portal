const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('CourseCategory', {
    CourseCategoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CategoryName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RequiredCredits: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IncludesLecture: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    IncludesLab: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    IncludesExam: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'CourseCategories',
    timestamps: false
  });
};
