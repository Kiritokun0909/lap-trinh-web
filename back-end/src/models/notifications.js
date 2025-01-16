const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    NotificationId: {
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
    Message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    IsRead: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "0: is not read, 1: is read"
    },
    CreateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    MangaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mangas',
        key: 'MangaId'
      }
    }
  }, {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NotificationId" },
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
        name: "notifications_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "MangaId" },
        ]
      },
    ]
  });
};
