const db = require('../../configs/DbPoolConfig');
const MangaService = require('./MangaService');
const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
const HandleCode = require('../../utils/HandleCode');
class UserService {
  //#region check like-follow
  async isLikeFollowManga(mangaId, userId, type = 'like') {
    try {
      const table = type === 'like' ? 'favorites' : 'following';
      const [rows] = await db.query(
        `SELECT * FROM ${table} WHERE mangaId = ? AND userId = ?`,
        [mangaId, userId]
      );
      if (rows.length === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region like-follow
  async likeFollowManga(mangaId, userId, type = 'like') {
    try {
      const table = type === 'like' ? 'favorites' : 'following';
      const [rows] = await db.query(
        `INSERT INTO ${table} (mangaId, userId) VALUES (?, ?)`,
        [mangaId, userId]
      );
      await MangaService.updateMangaLikeFollow(mangaId, type);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return { code: HandleCode.USER_ALREADY_LIKE };
      }
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return { code: HandleCode.NOT_FOUND };
      }
      throw err;
    }
  }
  //#endregion

  //#region un-like-follow
  async unLikeFollowManga(mangaId, userId, type = 'like') {
    try {
      const table = type === 'like' ? 'favorites' : 'following';
      const [rows] = await db.query(
        `DELETE FROM ${table} WHERE mangaId = ? AND userId = ?`,
        [mangaId, userId]
      );
      if (rows.affectedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
      await MangaService.updateMangaLikeFollow(mangaId, type);
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region get-user-like-follow-list
  async getUserLikeFollowList(
    page = 1,
    limit = 10,
    userId,
    type = 'like',
    keyword = '',
    filterCode = HandleCode.FILTER_BY_USER_LIKE_FOLLOW_DATE_DESC
  ) {
    try {
      const table = type === 'like' ? 'favorites' : 'following';
      const offset = (page - 1) * limit;

      let whereClause = `WHERE l.userId = ?`;
      const params = [userId];

      if (keyword) {
        whereClause += ` AND (m.mangaName LIKE ? OR m.otherName LIKE ?)`;
        const searchKeyword = `%${keyword}%`;
        params.push(searchKeyword, searchKeyword);
      }

      const [totalRows] = await db.query(
        `SELECT COUNT(*) as total 
          FROM ${table} l
            JOIN mangas m ON l.mangaId = m.mangaId
        ${whereClause}`,
        params
      );
      const totalMangas = totalRows[0].total;

      let orderByClause = '';
      switch (filterCode) {
        case HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC:
          orderByClause = `ORDER BY m.updateAt DESC`;
          break;
        case HandleCode.FILTER_BY_MANGA_UPDATE_AT_ASC:
          orderByClause = `ORDER BY m.updateAt ASC`;
          break;
        case HandleCode.FILTER_BY_USER_LIKE_FOLLOW_DATE_ASC:
          orderByClause = `ORDER BY l.createAt ASC`;
          break;
        default:
          orderByClause = `ORDER BY l.createAt DESC`;
      }

      const [rows] = await db.query(
        `SELECT 
          m.mangaId, 
          m.coverImageUrl, 
          m.mangaName, 
          m.updateAt, 
          l.createAt
        FROM ${table} l
          JOIN mangas m ON l.mangaId = m.mangaId
        ${whereClause}
        ${orderByClause}
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return {
        totalItems: totalMangas,
        totalPages: Math.ceil(totalMangas / limit),
        currentPage: page,
        items: rows,
      };
    } catch (err) {
      throw err;
    }
  }
  //#endregion
}

module.exports = new UserService();
