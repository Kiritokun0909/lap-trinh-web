const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plan_mangas', {
    PlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'plans',
        key: 'PlanId'
      }
    },
    MangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'mangas',
        key: 'MangaId'
      }
    }
  }, {
    sequelize,
    tableName: 'plan_mangas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PlanId" },
          { name: "MangaId" },
        ]
      },
      {
        name: "subscription_chapters_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "MangaId" },
        ]
      },
    ]
  });
};
