const { DataTypes } = require('sequelize');

module.exports =  (sequelize) => {
  return sequelize.define('Professor', {
  
    ProfessorID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    JobCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DepartmentID: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    AcademicTitle: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AltEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'Professors',
    timestamps: false
  });

};

