const ChapterService = require('../services/ChapterService');
const { StatusCodes } = require('http-status-codes');
const {
  getHeaderToken,
  getUserFromToken,
  getUserIdFromToken,
} = require('../../utils/TokenUtil');
const { parse } = require('dotenv');
class ChapterController {
  //#region Get-Chapter-By-Id
  async getChapterImages(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = getUserIdFromToken(getHeaderToken(req));
      const chapterImagesList = await ChapterService.getImagesByChapterId(
        parseInt(chapterId),
        userId
      );

      if (!chapterImagesList) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Chapter not found' });
      }

      return res.status(StatusCodes.OK).json(chapterImagesList);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  //#endregion

  //#region Add-Chapter
  async addChapter(req, res) {
    const { mangaId } = req.params;
    const { chapterNumber, chapterImages } = req.body;
    try {
      const result = await ChapterService.addChapter(
        parseInt(mangaId),
        parseInt(chapterNumber),
        chapterImages
      );
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  //#endregion

  //#region Update-Chapter
  async updateChapter(req, res) {
    const { chapterId } = req.params;
    const { chapterImages } = req.body;
    try {
      const result = await ChapterService.updateChapter(
        parseInt(chapterId),
        chapterImages
      );
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  //#endregion

  //#region Delete-Chapter
  async deleteChapter(req, res) {
    const { chapterId } = req.params;
    try {
      const result = await ChapterService.deleteChapter(parseInt(chapterId));
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  //#endregion
}

module.exports = new ChapterController();
