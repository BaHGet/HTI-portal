const { DataTypes } = require('sequelize');

// هذا المودل يمثل جدول مواعيد الجروبات الجديد
module.exports = (sequelize) => {
  const GroupSchedule = sequelize.define('GroupSchedule', {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DayOfWeek: {
      type: DataTypes.ENUM('D1','D2','D3','D4','D5','D6','D7'),
      allowNull: false
    },
    PeriodID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Room: {
      type: DataTypes.STRING(50)
    },
    SessionType: {
      type: DataTypes.ENUM('Lecture', 'Section', 'Lab')
    }
  }, {
    tableName: 'GroupSchedules',
    timestamps: false
  });

  return GroupSchedule;
};
