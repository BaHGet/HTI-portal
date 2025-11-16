const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('GradeAppeal', {
    AppealID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    GradeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    StudentNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AppealMidterm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    AppealFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    AppealActivities: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending'
    },
  }, {
    tableName: 'GradeAppeals',
    timestamps: true,
    createdAt: 'CreatedAt', 
    updatedAt: 'UpdatedAt'
  });
};

