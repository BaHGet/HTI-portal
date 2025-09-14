const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Semester', {
    SemesterID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    SemesterName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AcademicYear: {
      type: DataTypes.STRING(9),
      allowNull: false
    }
  }, {
    tableName: 'Semesters',
    timestamps: false
  });
};
