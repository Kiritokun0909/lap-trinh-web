const { Op } = require("sequelize");
const { mangas, chapters, genres, user_chapter_history } =
  require("../../models/init-models")(require("../../configs/DbConfig"));
const { formatISODate } = require("../../utils/DateUtil");
const { ROLE_ADMIN, ROLE_USER } = require("../../utils/HandleCode");
const convertKeysToCamelCase = require("../../utils/CamelCaseUtil");
class MangaService {
  async getAllMangas(search_query, page = 1, limit = 10, user = null) {
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (user == null || user.roleId !== ROLE_ADMIN) {
      whereClause.IsHide = false;
    }

    if (search_query) {
      const keywords = search_query.split(" ").map((keyword) => `%${keyword}%`);
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
          "MangaId",
          "MangaName",
          "CoverImageUrl",
          "NumViews",
          "NumLikes",
          "NumFollows",
        ],
        include: [
          {
            model: chapters,
            as: "Chapters",
            limit: 3,
            order: [["PublishedDate", "DESC"]],
            attributes: { exclude: ["MangaId"] },
          },
        ],
        offset,
        limit,
      });

      const transformedRows = rows.map((row) => {
        const manga = row.toJSON();
        manga.Genres = manga.GenreId_genres;

        manga.Chapters = manga.Chapters.map((chapter) => {
          chapter.PublishedDate = formatISODate(chapter.PublishedDate);
          chapter.UpdateAt = formatISODate(chapter.UpdateAt);
          return chapter;
        });
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
      throw new Error(error);
    }
  }

  async getMangaById(mangaId, user) {
    try {
      const whereClause = {};
      if (user == null || user.roleId !== ROLE_ADMIN) {
        whereClause.IsHide = false;
      }

      const manga = await mangas.findOne({
        where: { MangaId: mangaId, ...whereClause },
        include: [
          {
            model: genres,
            as: "GenreId_genres",
            attributes: ["GenreId", "GenreName"],
          },
        ],
      });

      if (!manga) {
        return null;
      }

      const mangaData = manga.toJSON();
      const mangaGenres = mangaData.GenreId_genres.map((genre) => {
        delete genre.manga_genres;
        return genre;
      });
      mangaData.Genres = mangaGenres;
      delete mangaData.GenreId_genres;
      mangaData.CreateAt = formatISODate(mangaData.CreateAt);
      mangaData.UpdateAt = formatISODate(mangaData.UpdateAt);
      return convertKeysToCamelCase(mangaData);
    } catch (error) {
      throw new Error(error);
    }
  }

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
        attributes: { exclude: ["MangaId"] },
        order: [["PublishedDate", "DESC"]],
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
      throw new Error(error);
    }
  }

  async getAllChaptersOfManga(mangaId, user) {
    if (user) {
      return await this.getAllChaptersOfMangaForUser(mangaId, user);
    } else {
      return await this.getAllChaptersOfMangaPublic(mangaId);
    }
  }
}

module.exports = new MangaService();
