const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manga_genres', {
    MangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'mangas',
        key: 'MangaId'
      }
    },
    GenreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'genres',
        key: 'GenreId'
      }
    }
  }, {
    sequelize,
    tableName: 'manga_genres',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MangaId" },
          { name: "GenreId" },
        ]
      },
      {
        name: "mangagenres_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "GenreId" },
        ]
      },
    ]
  });
};
