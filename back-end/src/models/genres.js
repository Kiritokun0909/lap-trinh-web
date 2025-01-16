const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genres', {
    GenreId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GenreName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "GenreName"
    }
  }, {
    sequelize,
    tableName: 'genres',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "GenreId" },
        ]
      },
      {
        name: "GenreName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "GenreName" },
        ]
      },
    ]
  });
};
