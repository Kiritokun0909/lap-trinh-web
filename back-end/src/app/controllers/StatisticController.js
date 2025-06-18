const StatisticService = require('../services/StatisticService');
const { StatusCodes } = require('http-status-codes');

class StatisticController {
  async getTopMangas(req, res) {
    const { page, limit, filter } = req.query;
    try {
      const topMangas = await StatisticService.getTopMangas(page, limit, filter);
      return res.status(StatusCodes.OK).json(topMangas);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async getTotalUserNumber(req, res) {
    try {
      const totalUserNumber = await StatisticService.getTotalUserNumber();
      return res.status(StatusCodes.OK).json(totalUserNumber);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async getTotalMangaNumber(req, res) {
    try {
      const totalMangaNumber = await StatisticService.getTotalMangaNumber();
      return res.status(StatusCodes.OK).json(totalMangaNumber);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

module.exports = new StatisticController();
