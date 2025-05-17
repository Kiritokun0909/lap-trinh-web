const db = require('../../configs/DbPoolConfig');
const mangaService = require('./MangaService');
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

  //#region Get-Chapter-By-Id
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
        prev_index === null ? prev_index : listChapterRows[prev_index].chapterId;
      const next_chapterid =
        next_index === null ? next_index : listChapterRows[next_index].chapterId;
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
  //#endregion

  //#region Add-Chapter
  async addChapter(mangaId, chapterNumber, chapterImages) {
    try {
      const [insertRow] = await db.query(
        `INSERT INTO chapters (mangaId, chapterNumber)
         VALUES (?, ?)`,
        [mangaId, chapterNumber]
      );

      const chapterId = insertRow.insertId;

      await this.updateChapter(chapterId, chapterImages);
      await mangaService.updateMangaNewestChapterNumber(mangaId, chapterNumber);
      await mangaService.updateMangaNumChapters(mangaId);

      return { chapterId: chapterId };
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return { code: HandleCode.NOT_FOUND };
      }

      throw err;
    }
  }
  //#endregion

  //#region Update-Chapter-Images
  async updateChapter(chapterId, images) {
    try {
      await db.query(`DELETE FROM chapter_images WHERE ChapterId = ?`, [chapterId]);

      for (let i = 0; i < images.length; i++) {
        await db.query(
          `INSERT INTO chapter_images(ChapterId, PageNumber, ImageUrl) 
           VALUES(?, ?, ?);
          `,
          [chapterId, i + 1, images[i]]
        );
      }
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region Delete-Chapter
  async deleteChapter(chapterId) {
    try {
      const [row] = await db.query(`SELECT mangaId FROM chapters WHERE chapterId = ?`, [
        chapterId,
      ]);

      if (row.length === 0) {
        return { code: HandleCode.NOT_FOUND };
      }

      await db.query(`DELETE FROM chapters WHERE chapterId = ?`, [chapterId]);
      await mangaService.updateMangaNumChapters(row[0].mangaId);
    } catch (error) {
      throw error;
    }
  }
  //#endregion
}

module.exports = new ChapterService();
