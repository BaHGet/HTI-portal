const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AcademicRegulation', {
    RegulationID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RegulationName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    RegulationDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: false 
    }
  }, {
    tableName: 'AcademicRegulations',
    timestamps: false
  });
};
