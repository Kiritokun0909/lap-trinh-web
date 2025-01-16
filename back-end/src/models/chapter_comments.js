const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter_comments', {
    CommentId: {
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
      defaultValue: 0
    },
    CommentParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chapter_comments',
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
        name: "UK_ChapterComments",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CreateAt" },
          { name: "ChapterId" },
          { name: "UserId" },
        ]
      },
      {
        name: "chapter_comments_ibfk_1_idx",
        using: "BTREE",
        fields: [
          { name: "ChapterId" },
        ]
      },
      {
        name: "chapter_comments_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "UserId" },
        ]
      },
    ]
  });
};
