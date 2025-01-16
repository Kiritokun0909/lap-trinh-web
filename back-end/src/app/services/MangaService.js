const { Op, where } = require('sequelize');
const { mangas, chapters, genres } = require('../../models/init-models')(require('../../configs/DbConfig'));

class MangaService {
  async getAllMangas(search_query, page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const whereClause = {
      IsHide: false,
    };

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
          // {
          //   model: authors,
          //   as: 'authors',
          //   attributes: ['AuthorName'],
          // },
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
