const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('EvaluationAnswer', {
    AnswerID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    QuestionID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Score: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      validate: { min: 1, max: 5 }
    },
    TextResponse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'EvaluationAnswers',
    timestamps: false 
  });
};