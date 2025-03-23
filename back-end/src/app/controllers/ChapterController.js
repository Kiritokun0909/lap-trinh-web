const ChapterService = require('../services/ChapterService');
const { StatusCodes } = require('http-status-codes');
const {
  getHeaderToken,
  getUserFromToken,
  getUserIdFromToken,
} = require('../../utils/TokenUtil');
class ChapterController {
  async getChapterImages(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = getUserIdFromToken(getHeaderToken(req));
      const chapterImagesList = await ChapterService.getImagesByChapterId(
        chapterId,
        userId
      );

      return res.status(StatusCodes.OK).json(chapterImagesList);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

module.exports = new ChapterController();
