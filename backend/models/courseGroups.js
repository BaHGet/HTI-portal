const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('CourseGroup', {
    GroupID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CourseID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SemesterID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GroupNumber: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CurrentEnrolled: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ProfessorID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'CourseGroups',
    timestamps: false,
    indexes: [ 
      {
        unique: true,
        fields: ['CourseID', 'SemesterID', 'GroupNumber']
      }
    ]
  });
};
