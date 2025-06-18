const { mangas, users } = require('../../models/init-models')(
  require('../../configs/DbConfig')
);

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
