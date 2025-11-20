const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('EvaluationQuestion', {
    QuestionID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    QuestionText: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TargetType: {
      type: DataTypes.ENUM('Course', 'Professor', 'Assistant','General'),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'EvaluationQuestions',
    timestamps: false 
  });
};