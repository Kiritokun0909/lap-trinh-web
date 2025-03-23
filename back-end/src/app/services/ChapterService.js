const db = require('../../configs/DbPoolConfig');
const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
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
      const [chapterInfoRows] = await db.query(
        `SELECT 
              current.chapterId,
              current.chapterNumber,
              mangainfo.mangaName,
              current.mangaId,
              current.updateAt
          FROM chapters AS current
          JOIN mangas as mangainfo
            ON current.MangaId = mangainfo.MangaId
          WHERE current.ChapterId = ?
          LIMIT 1;
      `,
        [chapterId]
      );

      if (chapterInfoRows.length === 0) {
        return { code: HandleCode.NOT_FOUND };
      }

      const [chapterImageRows] = await db.query(
        `
          SELECT pageId,pageNumber, imageUrl 
          FROM chapter_images 
          WHERE ChapterId = ?
          ORDER BY PageNumber ASC;
      `,
        [chapterId]
      );

      const mangaId = chapterInfoRows[0].mangaId;
      const [listChapterRows] = await db.query(
        `
          SELECT chapterId
          FROM chapters
          WHERE MangaId = ?
          ORDER BY 
            chapterNumber DESC
          ;
      `,
        [mangaId]
      );

      console.log(listChapterRows);
      // console.log('length=', listChapterRows.length);
      const index = listChapterRows.findIndex(
        (chapter) => chapter.chapterId === chapterId
      );
      console.log('curr index=', index);

      const prev_index = index + 1 >= listChapterRows.length ? null : index + 1;
      const next_index = index - 1 < 0 ? null : index - 1;
      console.log('Next index=', next_index);
      console.log('Prev index=', prev_index);

      const prev_chapterid =
        prev_index === null
          ? prev_index
          : listChapterRows[prev_index].chapterId;
      const next_chapterid =
        next_index === null
          ? next_index
          : listChapterRows[next_index].chapterId;
      // console.log('Next ChapterID=', next_chapterid);
      // console.log('Prev ChapterID=', prev_chapterid);

      // await mangaService.updateMangaViews(mangaId);

      return {
        mangaId: mangaId,
        mangaName: chapterInfoRows[0].mangaName,
        chapterNumber: chapterInfoRows[0].chapterNumber,
        updateAt: chapterInfoRows[0].updateAt,
        prevChapterId: prev_chapterid,
        nextChapterId: next_chapterid,
        chapterImages: chapterImageRows,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ChapterService();
