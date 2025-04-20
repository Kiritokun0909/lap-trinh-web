const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'mangas',
    {
      MangaId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      MangaName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      OtherName: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      CoverImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      PublishedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: '2024',
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      AgeLimit: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
      },
      IsFree: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0: paid manga, 1: free manga',
      },
      NumChapters: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      NewestChapterNumber: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      NumViews: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      NumLikes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      NumFollows: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      CreateAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      UpdateAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      IsHide: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0: not hide, 1: is hide',
      },
      AuthorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'authors',
          key: 'AuthorId',
        },
      },
    },
    {
      sequelize,
      tableName: 'mangas',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'MangaId' }],
        },
        {
          name: 'AuthorId',
          using: 'BTREE',
          fields: [{ name: 'AuthorId' }],
        },
      ],
    }
  );
};
