const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manga_comments', {
    CommentId: {
      autoIncrement: true,
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
    MangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mangas',
        key: 'MangaId'
      }
    },
    Context: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CreateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    IsHide: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0: not hide, 1: is hidden"
    },
    CommentParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'manga_comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CommentId" },
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
        name: "MangaId",
        using: "BTREE",
        fields: [
          { name: "MangaId" },
        ]
      },
      {
        name: "manga_comments_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "CommentParentId" },
        ]
      },
    ]
  });
};
