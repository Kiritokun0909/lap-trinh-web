const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapter_images', {
    PageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PageNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ChapterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapters',
        key: 'ChapterId'
      }
    }
  }, {
    sequelize,
    tableName: 'chapter_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PageId" },
        ]
      },
      {
        name: "ChapterId",
        using: "BTREE",
        fields: [
          { name: "ChapterId" },
        ]
      },
    ]
  });
};
