const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chapters', {
    ChapterId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ChapterNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ChapterName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PublishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    MangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mangas',
        key: 'MangaId'
      }
    }
  }, {
    sequelize,
    tableName: 'chapters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ChapterId" },
        ]
      },
      {
        name: "chapters_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "MangaId" },
        ]
      },
    ]
  });
};
