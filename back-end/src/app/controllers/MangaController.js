const MangaService = require('../services/MangaService');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { getHeaderToken, getUserFromToken } = require('../../utils/TokenUtil');
class MangaController {
  async getAllMangas(req, res) {
    try {
      const { search_query, page, limit } = req.query;
      const user = getUserFromToken(getHeaderToken(req));
      const mangaList = await MangaService.getAllMangas(search_query, page, limit, user);
      
      return res.status(StatusCodes.OK).json(mangaList);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new MangaController();
