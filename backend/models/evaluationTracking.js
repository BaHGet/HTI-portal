const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('EvaluationTracking', {
    TrackingID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    EnrollmentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true 
    },
    SubmittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'EvaluationTracking',
    timestamps: false 
  });
};