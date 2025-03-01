const { genres } = require('../../models/init-models')(require('../../configs/DbConfig'));

class GenreService {
  async getAllGenres() {
    try {
      const genresList = await genres.findAll({
        order: [['GenreName', 'ASC']],
      });
      return genresList;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async isGenreExist(genreName) {
    try {
      const genre = await genres.findOne({ where: { GenreName: genreName } });
      return genre;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addGenre(genreData) {
    try {
      const genre = await genres.create(genreData);
      return genre;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateGenre(genreId, genreData) {
    try {
      const genre = await genres.findByPk(genreId);
      if (!genre) {
        return null;
      }
      await genre.update(genreData);
      return genre;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteGenre(genreId) {
    try {
      const genre = await genres.findByPk(genreId);
      if (!genre) {
        return null;
      }
      await genre.destroy();
      return genre;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new GenreService();
