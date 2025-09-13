const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const TimePeriod = sequelize.define('TimePeriod', {
    PeriodID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PeriodName: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'TimePeriods',
    timestamps: false
  });

  return TimePeriod;
};
