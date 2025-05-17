const MangaService = require('../services/MangaService');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { getHeaderToken, getUserFromToken } = require('../../utils/TokenUtil');
const Messages = require('../../utils/Messages');
const HandleCode = require('../../utils/HandleCode');
const { parse } = require('dotenv');
const { get } = require('../../routes/MangaRoute');
class MangaController {
  async getAllMangas(req, res) {
    try {
      const { search_query, page, limit } = req.query;
      // const user = getUserFromToken(getHeaderToken(req));
      const user = req?.user;
      const mangaList = await MangaService.getAllMangas(search_query, page, limit, user);

      return res.status(StatusCodes.OK).json(mangaList);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(StatusCodes.UNAUTHORIZED).send(Messages.ERROR.TOKEN_EXPIRED);
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(StatusCodes.UNAUTHORIZED).send(Messages.ERROR.TOKEN_INVALID);
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  async getMangaById(req, res) {
    try {
      const { mangaId } = req.params;
      // const user1 = getUserFromToken(getHeaderToken(req));
      const user = req?.user;
      // console.log('>>> user: ', user);
      const manga = await MangaService.getMangaById(mangaId, user);
      // console.log('>>> manga: ', manga);
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
      // const user = getUserFromToken(getHeaderToken(req));
      const user = req?.user;
      const chapterList = await MangaService.getAllChaptersOfManga(mangaId, user);

      return res.status(StatusCodes.OK).json(chapterList);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async addManga(req, res) {
    const {
      mangaName,
      otherName,
      coverImageUrl,
      publishedYear,
      description,
      ageLimit,
      authorId,
      genreIds,
    } = req.body;

    try {
      const result = await MangaService.addManga(
        mangaName,
        otherName,
        coverImageUrl,
        publishedYear,
        description,
        ageLimit,
        authorId
      );

      await MangaService.updateMangaGenres(result.mangaId, genreIds);

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Add manga successfully.', mangaId: result.mangaId });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async updateManga(req, res) {
    const { mangaId } = req.params;
    const {
      mangaName,
      otherName,
      coverImageUrl,
      publishedYear,
      description,
      ageLimit,
      authorId,
      genreIds,
    } = req.body;

    try {
      const result = await MangaService.updateManga(
        parseInt(mangaId),
        mangaName,
        otherName,
        coverImageUrl,
        publishedYear,
        description,
        ageLimit,
        authorId
      );

      if (result && result.code === HandleCode.NOT_FOUND) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });
      }

      await MangaService.updateMangaGenres(parseInt(mangaId), genreIds);

      return res.status(StatusCodes.OK).json({ message: 'Update manga successfully.' });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async deleteManga(req, res) {
    const { mangaId } = req.params;

    try {
      const result = await MangaService.deleteManga(mangaId);

      if (result && result.code === HandleCode.NOT_FOUND) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });
      }

      return res.status(StatusCodes.OK).json({ message: 'Delete manga successfully.' });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async updateMangaHideStatus(req, res) {
    const { mangaId } = req.params;
    const { isHide } = req.body;

    if (
      isHide !== HandleCode.MANGA_HIDE_STATUS &&
      isHide !== HandleCode.MANGA_SHOW_STATUS
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
    }

    try {
      const result = await MangaService.updateMangaHideStatus(parseInt(mangaId), isHide);

      if (result && result.code === HandleCode.NOT_FOUND) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Update manga hide status successfully.' });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
}

module.exports = new MangaController();
