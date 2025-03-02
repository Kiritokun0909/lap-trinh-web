const { genres } = require('../../models/init-models')(require('../../configs/DbConfig'));
const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
class GenreService {
  async getAllGenres() {
    try {
      const genresList = await genres.findAll({
        order: [['GenreName', 'ASC']],
      });
      const plainGenresList = genresList.map((genre) => genre.toJSON());
      return convertKeysToCamelCase(plainGenresList);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async isGenreExist(genreName) {
    try {
      const genre = await genres.findOne({ where: { GenreName: genreName } });
      return genre ? true : false;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addGenre(genreData) {
    try {
      const genre = await genres.create(genreData);
      return convertKeysToCamelCase(genre.toJSON());
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
      return convertKeysToCamelCase(genre.toJSON());
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
