const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plans', {
    PlanId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PlanName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "price is vnd, need to multiply 1000 to remove the decimal"
    },
    Duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duration in days, if null means user can own this subscriptions forever"
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    StartAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    EndAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "End date of subscription plan, if null means still available in future"
    },
    CreateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    CanReadAll: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0: read paid manga that in subscription list, 1: can read all paid manga"
    }
  }, {
    sequelize,
    tableName: 'plans',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PlanId" },
        ]
      },
    ]
  });
};
