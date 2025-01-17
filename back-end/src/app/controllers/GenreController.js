const GenreService = require('../services/GenreService');
const { StatusCodes } = require('http-status-codes');

class GenreController {
  async getAllGenres(req, res) {
    try {
      const genresList = await GenreService.getAllGenres();
      return res.status(StatusCodes.OK).json(genresList);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new GenreController();
