const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Student', {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    StudentAddress: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CreditHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RegulationID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2), 
      allowNull: false,
      validate: {
        min: 0,
        max: 4
      }
    },
    isLastTerm: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    
    tableName: 'Students',
    timestamps: false 
  });
  
};




