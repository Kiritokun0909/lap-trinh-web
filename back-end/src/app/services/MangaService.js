const { Op } = require('sequelize');
const {
  mangas,
  manga_genres,
  authors,
  chapters,
  genres,
  user_chapter_history,
  favorites,
  following,
} = require('../../models/init-models')(require('../../configs/DbConfig'));
const { formatISODate } = require('../../utils/DateUtil');
const { ROLE_ADMIN } = require('../../utils/HandleCode');
const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
const HandleCode = require('../../utils/HandleCode');

class MangaService {
  //#region Get All Mangas
  async getAllMangas(search_query, page = 1, limit = 10, user = null) {
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (user == null || user.roleId !== ROLE_ADMIN) {
      whereClause.IsHide = false;
    }

    if (search_query) {
      const keywords = search_query.split(' ').map((keyword) => `%${keyword}%`);
      whereClause[Op.and] = keywords.map((keyword) => ({
        [Op.or]: [
          { MangaName: { [Op.like]: keyword } },
          { OtherName: { [Op.like]: keyword } },
        ],
      }));
    }

    try {
      const { count, rows } = await mangas.findAndCountAll({
        where: whereClause,
        attributes: [
          'MangaId',
          'MangaName',
          'OtherName',
          'CoverImageUrl',
          'NumViews',
          'NumLikes',
          'NumFollows',
          'PublishedYear',
          'UpdateAt',
        ],
        include: [
          {
            model: chapters,
            as: 'Chapters',
            limit: 3,
            order: [['PublishedDate', 'DESC']],
            attributes: { exclude: ['MangaId'] },
          },
          {
            model: authors,
            as: 'Author',
            attributes: ['AuthorId', 'AuthorName'],
          },
        ],
        offset,
        limit,
      });

      const transformedRows = rows.map((row) => {
        const manga = row.toJSON();

        manga.Chapters = manga.Chapters.map((chapter) => {
          chapter.PublishedDate = formatISODate(chapter.PublishedDate);
          chapter.UpdateAt = formatISODate(chapter.UpdateAt);
          return chapter;
        });

        manga.UpdateAt = formatISODate(manga.UpdateAt);

        manga.Genres = manga.GenreId_genres;
        delete manga.GenreId_genres;

        return manga;
      });

      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        items: convertKeysToCamelCase(transformedRows),
      };
    } catch (error) {
      throw error;
    }
  }
  //#endregion

  //region Get Manga By MangaId
  async getMangaById(mangaId, user = null) {
    try {
      const whereClause = {};
      if (user == null || user.roleId !== ROLE_ADMIN) {
        whereClause.IsHide = HandleCode.MANGA_SHOW_STATUS;
      }

      const manga = await mangas.findOne({
        where: { MangaId: mangaId, ...whereClause },
        include: [
          {
            model: genres,
            as: 'GenreId_genres',
            attributes: ['GenreId', 'GenreName'],
          },
          {
            model: authors,
            as: 'Author',
            attributes: ['AuthorId', 'AuthorName'],
          },
        ],
      });

      if (!manga) {
        return null;
      }

      const mangaData = manga.toJSON();

      mangaData.CreateAt = formatISODate(mangaData.CreateAt);
      mangaData.UpdateAt = formatISODate(mangaData.UpdateAt);

      const mangaGenres = mangaData.GenreId_genres.map((genre) => {
        delete genre.manga_genres;
        return genre;
      });
      mangaData.Genres = mangaGenres;
      delete mangaData.GenreId_genres;

      delete mangaData.AuthorId;

      return convertKeysToCamelCase(mangaData);
    } catch (error) {
      throw error;
    }
  }
  //endregion

  //#region Get All Chapters Of Manga By MangaId
  async getAllChaptersOfMangaForUser(mangaId, user) {
    try {
      const chapterList = await this.getAllChaptersOfMangaPublic(mangaId);
      const readingHistory = await user_chapter_history.findAll({
        where: { UserId: user.userId },
      });

      const transformedChapterList = await Promise.all(
        chapterList.map(async (chapterData) => {
          // const chapterData = chapter.toJSON();
          chapterData.IsRead = readingHistory.some(
            (history) => history.ChapterId === chapterData.ChapterId
          );

          return chapterData;
        })
      );

      return transformedChapterList;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllChaptersOfMangaPublic(mangaId) {
    try {
      const chapterList = await chapters.findAll({
        where: { MangaId: mangaId },
        attributes: { exclude: ['MangaId'] },
        order: [['PublishedDate', 'DESC']],
      });

      const transformedChapterList = await Promise.all(
        chapterList.map(async (chapter) => {
          const chapterData = chapter.toJSON();
          chapterData.PublishedDate = formatISODate(chapterData.PublishedDate);
          chapterData.UpdateAt = formatISODate(chapterData.UpdateAt);

          return chapterData;
        })
      );

      return convertKeysToCamelCase(transformedChapterList);
    } catch (error) {
      throw error;
    }
  }

  async getAllChaptersOfManga(mangaId, user) {
    if (user) {
      return await this.getAllChaptersOfMangaForUser(mangaId, user);
    } else {
      return await this.getAllChaptersOfMangaPublic(mangaId);
    }
  }
  //#endregion

  //#region Add-Update-Delete Manga
  async addManga(
    mangaName = '',
    otherName = '',
    coverImageUrl = '',
    publishedYear = '',
    description = '',
    ageLimit = '',
    authorId
  ) {
    try {
      console.log('>>>> data: ', mangaName);
      const data = {};

      if (mangaName.trim()) data.MangaName = mangaName;
      if (otherName.trim()) data.OtherName = otherName;
      if (coverImageUrl.trim()) data.CoverImageUrl = coverImageUrl;
      if (publishedYear.trim()) data.PublishedYear = publishedYear;
      if (description.trim()) data.Description = description;
      if (ageLimit.trim()) data.AgeLimit = ageLimit;
      if (authorId?.toString().trim()) data.AuthorId = authorId;

      if (Object.keys(data).length === 0) {
        return { code: HandleCode.NO_FIELDS_TO_UPDATE };
      }

      // console.log('>>>> data: ', data);

      const manga = await mangas.create(data);
      return { mangaId: manga.MangaId };
    } catch (error) {
      throw error;
    }
  }

  async updateManga(
    mangaId,
    mangaName,
    otherName,
    coverImageUrl,
    publishedYear,
    description,
    ageLimit,
    authorId
  ) {
    try {
      const manga = await mangas.findByPk(mangaId);
      if (!manga) {
        return { code: HandleCode.NOT_FOUND }; // Manga does not exist
      }

      const data = {};

      if (mangaName?.trim()) data.MangaName = mangaName;
      if (otherName?.trim()) data.OtherName = otherName;
      if (coverImageUrl?.trim()) data.CoverImageUrl = coverImageUrl;
      if (publishedYear && publishedYear > 1900) data.PublishedYear = publishedYear;
      if (description?.trim()) data.Description = description;
      if (typeof ageLimit === 'number' && ageLimit >= 0) data.AgeLimit = ageLimit;
      if (authorId !== undefined && authorId !== null) data.AuthorId = authorId;

      if (Object.keys(data).length === 0) {
        return { code: HandleCode.NO_FIELDS_TO_UPDATE };
      }

      await mangas.update(data, {
        where: { MangaId: mangaId },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteManga(mangaId) {
    try {
      const manga = await mangas.findByPk(mangaId);
      if (!manga) {
        return { code: HandleCode.NOT_FOUND }; // Manga does not exist
      }

      await mangas.destroy({
        where: { MangaId: mangaId },
      });
    } catch (error) {
      throw error;
    }
  }
  //#endregion

  //#region Update Manga Like-Follow
  async updateMangaLikeFollow(mangaId, type = 'like') {
    try {
      const table = type === 'like' ? favorites : following;
      const field = type === 'like' ? 'NumLikes' : 'NumFollows';

      // Count the total number of rows in the relevant table for the given mangaId
      const count = await table.count({
        where: { MangaId: mangaId },
      });

      // Update the field in the mangas table with the new count
      const [updatedRows] = await mangas.update(
        { [field]: count },
        { where: { MangaId: mangaId } }
      );

      if (updatedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region Update-Manga-Genres
  async updateMangaGenres(mangaId, genreIds) {
    try {
      await manga_genres.destroy({
        where: { MangaId: mangaId },
      });

      if (genreIds && genreIds.length > 0) {
        const newEntries = genreIds.map((genreId) => ({
          MangaId: mangaId,
          GenreId: genreId,
        }));

        await manga_genres.bulkCreate(newEntries);
      }
    } catch (err) {
      throw err;
    }
  }

  //#endregion

  //region Update-Manga-Hide-Status
  async updateMangaHideStatus(mangaId, isHide = HandleCode.MANGA_HIDE_STATUS) {
    try {
      await mangas.update({ IsHide: isHide }, { where: { MangaId: mangaId } });
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //region Update-Manga-Num-Chapters
  async updateMangaNumChapters(mangaId) {
    try {
      const count = await chapters.count({
        where: { MangaId: mangaId },
      });

      await mangas.update({ NumChapters: count }, { where: { MangaId: mangaId } });
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region Update-Manga-Newest-Chapter-Number
  async updateMangaNewestChapterNumber(mangaId, chapterNumber) {
    try {
      await mangas.update(
        { NewestChapterNumber: chapterNumber },
        { where: { MangaId: mangaId } }
      );
    } catch (err) {
      throw err;
    }
  }
  //#endregion
}

module.exports = new MangaService();
