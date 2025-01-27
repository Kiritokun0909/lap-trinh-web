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

        manga.CreateAt = formatISODate(manga.CreateAt);
        manga.UpdateAt = formatISODate(manga.UpdateAt);

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
        items: transformedRows,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new MangaService();
