const { mangas, users, genres } = require('../../models/init-models')(
  require('../../configs/DbConfig')
);

const db = require('../../configs/DbPoolConfig');

const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
const HandleCode = require('../../utils/HandleCode');

class StatisticService {
  //#region get-top-mangas
  async getTopMangas(page = 1, limit = 10, filter = HandleCode.STATISTIC_NUM_VIEWS_DESC) {
    try {
      page = parseInt(page) > 0 ? parseInt(page) : 1;
      limit = parseInt(limit);

      const offset = (page - 1) * limit;

      let orderField = 'NumViews';
      if (filter === HandleCode.STATISTIC_NUM_LIKES_DESC) {
        orderField = 'NumLikes';
      } else if (filter === HandleCode.STATISTIC_NUM_FOLLOWS_DESC) {
        orderField = 'NumFollows';
      }

      const { count, rows } = await mangas.findAndCountAll({
        attributes: [
          'MangaId',
          'MangaName',
          'CoverImageUrl',
          'NumViews',
          'NumLikes',
          'NumFollows',
        ],
        order: [[orderField, 'DESC']],
        offset,
        limit,
        raw: true,
      });

      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        items: convertKeysToCamelCase(rows),
      };
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region get-top-genres
  async getTopGenres(page = 1, limit = 10, filter = HandleCode.STATISTIC_NUM_VIEWS_DESC) {
    try {
      page = parseInt(page) > 0 ? parseInt(page) : 1;
      limit = parseInt(limit);

      const offset = (page - 1) * limit;

      let orderField = 'TotalViews DESC';
      if (filter === HandleCode.STATISTIC_NUM_LIKES_DESC) {
        orderField = 'TotalLikes DESC';
      } else if (filter === HandleCode.STATISTIC_NUM_FOLLOWS_DESC) {
        orderField = 'TotalFollows DESC';
      }

      const count = await genres.count();

      const [rows] = await db.query(
        `SELECT 
          g.GenreId,
          g.GenreName,
          SUM(m.NumViews) AS TotalViews, 
          SUM(m.NumLikes) AS TotalLikes, 
          SUM(m.NumFollows) AS TotalFollows
        FROM genres g
        LEFT JOIN manga_genres mg on mg.GenreId = g.GenreId
        LEFT JOIN (select MangaId, NumViews, NumLikes, NumFollows from mangas) m on mg.MangaId = m.MangaId
        GROUP BY 
	        g.GenreId
        ORDER BY
          ${orderField}
        LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      console.log(rows);
      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        items: convertKeysToCamelCase(rows),
      };
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region get-total-user-number
  async getTotalUserNumber() {
    try {
      const count = await users.count();
      return count;
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region get-total-manga-number
  async getTotalMangaNumber() {
    try {
      const count = await mangas.count();
      return count;
    } catch (err) {
      throw err;
    }
  }
  //#endregion
}

module.exports = new StatisticService();
