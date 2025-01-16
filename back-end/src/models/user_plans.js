const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_plans', {
    UserPlanId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'UserId'
      }
    },
    PlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plans',
        key: 'PlanId'
      }
    },
    StartAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    EndAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    PaymentStatus: {
      type: DataTypes.ENUM('pending','completed','failed'),
      allowNull: true,
      defaultValue: "pending"
    },
    PaymentMethod: {
      type: DataTypes.ENUM('vnpay','other'),
      allowNull: true,
      defaultValue: "vnpay"
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_plans',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserPlanId" },
        ]
      },
      {
        name: "UserId",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
      {
        name: "user_plans_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "PlanId" },
        ]
      },
    ]
  });
};
