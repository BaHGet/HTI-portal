const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('StudentFinancial', {
    FinancialID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AcademicYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BasicFees: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    AdditionalFees: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    CardFees: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    RetakeFees: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    AppealFees: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    FirstInstallmentAmount: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    TotalPaid: { 
      type: DataTypes.DECIMAL(10, 2), 
      defaultValue: 0 
    },
    IsFirstInstallmentPaid: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    IsFullPaid: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    }

  }, {
    tableName: 'StudentFinancials',
    timestamps: true 
  });
};

