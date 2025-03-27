const db = require('../../configs/DbPoolConfig');
const HandleCode = require('../../utils/HandleCode');

class AuthorService {
  async getAuthors(keyword, page = 1, limit = 10) {
    try {
      const [totalRows] = await db.query(
        `SELECT COUNT(*) as total 
          FROM authors
          WHERE authorName LIKE ?`,
        [`%${keyword}%`]
      );
      const totalAuthors = totalRows[0].total;

      const offset = (page - 1) * limit;
      const [rows] = await db.query(
        `SELECT authorId, authorName, avatar, biography, updateAt 
          FROM authors
          WHERE authorName LIKE ?
          ORDER BY updateAt DESC
          LIMIT ? OFFSET ?`,
        [`%${keyword}%`, limit, offset]
      );
      return {
        totalItems: totalAuthors,
        totalPages: Math.ceil(totalAuthors / limit),
        currentPage: page,
        items: rows,
      };
    } catch (err) {
      throw err;
    }
  }

  async addAuthor(avatar, authorName, biography) {
    try {
      await db.query(
        `INSERT INTO authors (avatar, authorName, biography) VALUES (?, ?, ?)`,
        [avatar, authorName, biography]
      );
    } catch (err) {
      throw err;
    }
  }

  async updateAuthor(authorId, avatar, authorName, biography) {
    try {
      console.log('>>> bio: ', biography);

      const fields = [];
      const values = [];

      if (avatar && avatar.trim().length > 0) {
        fields.push('avatar = ?');
        values.push(avatar);
      }
      if (authorName && authorName.trim().length > 0) {
        fields.push('authorName = ?');
        values.push(authorName);
      }
      if (biography !== null) {
        fields.push('biography = ?');
        values.push(biography);
      }

      if (fields.length === 0) {
        return { code: HandleCode.NO_FIELDS_TO_UPDATE };
      }

      values.push(authorId);

      const query = `UPDATE authors SET ${fields.join(', ')} WHERE authorId = ?`;
      const [rows] = await db.query(query, values);

      if (rows.affectedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
    } catch (err) {
      throw err;
    }
  }

  async removeAuthor(authorId) {
    try {
      const [rows] = await db.query(`DELETE FROM authors WHERE authorId = ?`, [authorId]);

      if (rows.affectedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AuthorService();
