const { Op } = require('sequelize');
const { mangas, chapters, genres, user_chapter_history } = require('../../models/init-models')(
  require('../../configs/DbConfig')
);
const { formatISODate } = require('../../utils/DateUtil');
const { ROLE_ADMIN, ROLE_USER } = require('../../utils/HandleCode');
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
      const keywords = search_query.split(' ').map((keyword) => `%${keyword}%`);
      whereClause[Op.and] = keywords.map((keyword) => ({
        [Op.or]: [{ MangaName: { [Op.like]: keyword } }, { OtherName: { [Op.like]: keyword } }],
      }));
    }

    try {
      const { count, rows } = await mangas.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['AuthorId'] },
        include: [
          {
            model: chapters,
            as: 'Chapters',
            limit: 3,
            order: [['PublishedDate', 'DESC']],
            attributes: { exclude: ['MangaId'] },
          },
          {
            model: genres,
            as: 'GenreId_genres',
            through: { attributes: [] },
          },
        ],
        offset,
        limit,
      });

      const transformedRows = rows.map((row) => {
        const manga = row.toJSON();
        manga.Genres = manga.GenreId_genres;
        delete manga.GenreId_genres;
        return manga;
      });
      // if (user && user.RoleId === ROLE_USER) {
      //   // for each chapter of each manga, check if user has read it

      //   const userChapterHistories = await user_chapter_history.findAll({
      //     where: {
      //       UserId: user.UserId,
      //       ChapterId: {
      //         [Op.in]: transformedRows.map((row) => row.Chapters.map((chapter) => chapter.ChapterId)).flat(),
      //       },
      //     },
      //   });

      //   transformedRows.forEach((manga) => {
      //     manga.Chapters.forEach((chapter) => {
      //       const isRead = userChapterHistories.some((history) => history.ChapterId === chapter.ChapterId);
      //       chapter.IsRead = isRead;
      //     });
      //   });
      // }

      const formattedDateRows = transformedRows.map((row) => {
        row.CreateAt = formatISODate(row.CreateAt);
        row.UpdateAt = formatISODate(row.UpdateAt);

        row.Chapters = row.Chapters.map((chapter) => {
          chapter.PublishedDate = formatISODate(chapter.PublishedDate);
          chapter.UpdateAt = formatISODate(chapter.UpdateAt);
          return chapter;
        });
        return row;
      });

      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        items: formattedDateRows,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new MangaService();
