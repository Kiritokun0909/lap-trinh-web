const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_chapter_history', {
    HistoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'UserId'
      }
    },
    ChapterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapters',
        key: 'ChapterId'
      }
    },
    CreateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user_chapter_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "HistoryId" },
        ]
      },
      {
        name: "history_ibfk_1_idx",
        using: "BTREE",
        fields: [
          { name: "ChapterId" },
        ]
      },
      {
        name: "history_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
    ]
  });
};
