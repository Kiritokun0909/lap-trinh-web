const { chapters, chapter_images } = require('../../models/init-models')(
  require('../../configs/DbConfig')
);

class ChapterService {
  async setUserIsReadChapter(chapterId, userId) {
    try {
      if (!chapterId || !userId) {
        return false;
      }
      const isRead = await user_chapter_history.findOne({
        where: { ChapterId: chapterId, UserId: userId },
      });

      if (isRead) {
        return true;
      }

      await user_chapter_history.create({
        ChapterId: chapterId,
        UserId: userId,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getImagesByChapterId(chapterId, user = null) {
    try {
      const chapterImagesList = await chapter_images.findAll({
        where: { ChapterId: chapterId },
        order: [['PageNumber', 'ASC']],
      });

      if (!chapterImagesList) {
        return [];
      }

      if (user) {
        this.setUserIsReadChapter(chapterId, user.UserId);
      }

      return chapterImagesList;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ChapterService();
