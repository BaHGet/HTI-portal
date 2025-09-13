const { DataTypes } = require('sequelize');

module.exports = (Sequelize) => {
  const College = Sequelize.define('College',{
    CollegeID:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CollegeName:{
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  },{
    tableName: 'Colleges',
    timestamps: false
  })

  return College;
}

