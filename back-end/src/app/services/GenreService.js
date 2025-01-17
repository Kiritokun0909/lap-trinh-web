const { genres } = require('../../models/init-models')(require('../../configs/DbConfig'));

class GenreService {
  async getAllGenres() {
    try {
      const genresList = await genres.findAll({
        order: [['GenreName', 'ASC']],
      });
      return genresList;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new GenreService();
