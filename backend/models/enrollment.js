const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const Enrollment = sequelize.define('Enrollment', {
    EnrollmentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RegistrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    AttemptNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    Status: {
      type: DataTypes.ENUM('Registered', 'Completed', 'Withdrawn', 'Failed'),
      defaultValue: 'Registered'
    }
  }, {
    tableName: 'Enrollments',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['StudentID', 'GroupID']
      }
    ]
  });

  return Enrollment;
};

