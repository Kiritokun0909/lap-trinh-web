const GenreService = require('../services/GenreService');
const { StatusCodes } = require('http-status-codes');
const { getHeaderToken, getUserFromToken } = require('../../utils/TokenUtil');
class GenreController {
  async getAllGenres(req, res) {
    try {
      const genresList = await GenreService.getAllGenres();
      return res.status(StatusCodes.OK).json(genresList);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async addGenre(req, res) {
    try {
      const { genreName } = req.body;
      const isGenreExist = await GenreService.isGenreExist(genreName);
      if (isGenreExist) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Genre already exists' });
      }
      const genreData = { GenreName: genreName };
      const genre = await GenreService.addGenre(genreData);
      return res.status(StatusCodes.CREATED).json({ message: 'Genre added successfully', genre });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async updateGenre(req, res) {
    try {
      const { genreId } = req.params;
      const { genreName } = req.body;
      const isGenreExist = await GenreService.isGenreExist(genreName);
      if (isGenreExist) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Genre already exists' });
      }
      const genreData = { GenreName: genreName };
      const genre = await GenreService.updateGenre(genreId, genreData);
      if (!genre) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Genre not found' });
      }
      return res.status(StatusCodes.OK).json({ message: 'Genre updated successfully', genre });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async deleteGenre(req, res) {
    try {
      const { genreId } = req.params;
      const genre = await GenreService.deleteGenre(genreId);
      if (!genre) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Genre not found' });
      }
      return res.status(StatusCodes.OK).json({ message: 'Genre deleted successfully' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new GenreController();
