const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authors', {
    AuthorId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AuthorName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Biography: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    UpdateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'authors',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "AuthorId" },
        ]
      },
    ]
  });
};
