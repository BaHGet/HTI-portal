const { DataTypes } = require('sequelize');

module.exports =  (Sequelize) => {
  return Sequelize.define('department',{
    DepartmentID:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DepartmentName:{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CollegeID:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },{
    tableName: 'Departments',
    timestamps: false
  })

}

