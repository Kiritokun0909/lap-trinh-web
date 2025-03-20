const MangaService = require('../services/MangaService');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { getHeaderToken, getUserFromToken } = require('../../utils/TokenUtil');
const Messages = require('../../utils/Messages');
class MangaController {
  async getAllMangas(req, res) {
    try {
      const { search_query, page, limit } = req.query;
      const user = getUserFromToken(getHeaderToken(req));

      const mangaList = await MangaService.getAllMangas(
        search_query,
        page,
        limit,
        user
      );

      return res.status(StatusCodes.OK).json(mangaList);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(Messages.ERROR.TOKEN_EXPIRED);
      } else if (error.name === 'JsonWebTokenError') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(Messages.ERROR.TOKEN_INVALID);
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  async getMangaById(req, res) {
    try {
      const { mangaId } = req.params;
      const user = getUserFromToken(getHeaderToken(req));

      const manga = await MangaService.getMangaById(mangaId, user);
      if (!manga) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });
      }
      return res.status(StatusCodes.OK).json(manga);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async getAllChaptersOfManga(req, res) {
    try {
      const { mangaId } = req.params;
      const user = getUserFromToken(getHeaderToken(req));
      const chapterList = await MangaService.getAllChaptersOfManga(
        mangaId,
        user
      );

      return res.status(StatusCodes.OK).json(chapterList);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

module.exports = new MangaController();
