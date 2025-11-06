const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true         
      }
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PasswordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PasswordResetCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PasswordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PasswordResetVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    NationalID: {
      type: DataTypes.CHAR(14), 
      unique: true,
      allowNull: false 
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: true
    },
    BirthDate: {
      type: DataTypes.DATEONLY, 
      allowNull: true
    },
    AccountType: {
      type: DataTypes.ENUM('student', 'professor', 'admin', 'Graduated'),
      defaultValue: 'student'
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    defaultScope: { 
      attributes: { exclude: ['PasswordHash'] },
    }
  });

  return User;
};
