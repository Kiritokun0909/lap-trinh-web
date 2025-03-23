const ChapterService = require('../services/ChapterService');
const { StatusCodes } = require('http-status-codes');
const {
  getHeaderToken,
  getUserFromToken,
  getUserIdFromToken,
} = require('../../utils/TokenUtil');
const { parse } = require('dotenv');
class ChapterController {
  async getChapterImages(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = getUserIdFromToken(getHeaderToken(req));
      const chapterImagesList = await ChapterService.getImagesByChapterId(
        parseInt(chapterId),
        userId
      );

      if (!chapterImagesList) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Chapter not found' });
      }

      return res.status(StatusCodes.OK).json(chapterImagesList);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

module.exports = new ChapterController();
