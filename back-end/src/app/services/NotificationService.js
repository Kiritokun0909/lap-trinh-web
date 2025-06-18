const db = require('../../configs/DbPoolConfig');
const { formatISODate } = require('../../utils/DateUtil');

class NotificationService {
  //#region notify-new-chapter
  async notifyNewChapter(mangaId) {
    try {
      const [userRows] = await db.query(
        `SELECT userId FROM following WHERE mangaId = ?`,
        [mangaId]
      );

      for (let i = 0; i < userRows.length; i++) {
        await this.addNotification(
          userRows[i].userId,
          'Truyện vừa đăng chương mới',
          mangaId
        );
      }
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region add-notification
  async addNotification(userId, message, mangaId = 0) {
    try {
      const [rows] = await db.query(
        'INSERT INTO notifications (userId, message, mangaId) VALUES (?, ?, ?)',
        [userId, message, mangaId]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region count-unread-notification
  async countUnreadNotification(userId) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(notificationId) as total FROM notifications WHERE userId = ? AND isRead = 0',
        [userId]
      );
      return rows[0].total;
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region get-notifications
  async getNotifications(itemsPerPage = 5, pageNumber = 1, userId) {
    try {
      const [totalRows] = await db.query(
        `SELECT COUNT(n.notificationId) as total 
      FROM notifications n
        LEFT JOIN mangas m ON n.mangaId = m.mangaId
      WHERE userId = ? AND m.isHide = 0`,
        [userId]
      );

      const total = totalRows[0].total;
      const totalPages = Math.ceil(total / itemsPerPage);
      if (pageNumber > totalPages) {
        return {
          pageNumber,
          totalPages,
          notifications: [],
        };
      }

      const offset = (pageNumber - 1) * itemsPerPage;
      const [rows] = await db.query(
        `SELECT notificationId, message, isRead, n.createAt, n.mangaId, m.coverImageUrl, m.mangaName
      FROM notifications n
      LEFT JOIN mangas m ON n.mangaId = m.mangaId
      WHERE n.userId = ? AND m.isHide = 0
      ORDER BY n.createAt DESC
      LIMIT ? OFFSET ?`,
        [userId, itemsPerPage, offset]
      );

      const formattedRows = rows.map((row) => ({
        ...row,
        createAt: formatISODate(row.createAt),
      }));

      return {
        pageNumber,
        totalPages,
        notifications: formattedRows,
      };
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region update-notification
  async readNotification(notificationId) {
    try {
      const [rows] = await db.query(
        'UPDATE notifications SET isRead = 1 WHERE notificationId = ?',
        [notificationId]
      );
      if (rows.affectedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }
    } catch (err) {
      throw err;
    }
  }
  //#endregion
}

module.exports = new NotificationService();
