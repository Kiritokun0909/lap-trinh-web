const { StatusCodes } = require('http-status-codes');
const HandleCode = require('../../utils/HandleCode');
const AuthorService = require('../services/AuthorService');

class AuthorController {
  async getAuthors(req, res) {
    try {
      const { keyword, page, limit } = req.query;

      const authors = await AuthorService.getAuthors(
        keyword,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(StatusCodes.OK).json(authors);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  //#region add-author
  async addAuthor(req, res) {
    const { avatar, authorName, biography } = req.body;
    console.log('>>> req.body: ', req.body);
    console.log('>>> ', avatar, authorName, biography);

    try {
      await AuthorService.addAuthor(avatar, authorName, biography);
      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'Add new author successfully.' });
    } catch (err) {
      console.log('Failed to add new author:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to add new author. Please try again later.' });
    }
  }
  //#endregion

  //#region update-author
  async updateAuthor(req, res) {
    const { authorId } = req.params;
    const { avatar, authorName, biography } = req.body;
    try {
      const result = await AuthorService.updateAuthor(
        authorId,
        avatar,
        authorName,
        biography
      );

      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found.' });
      }

      return res.status(StatusCodes.OK).json({ message: 'Update author successfully.' });
    } catch (err) {
      console.log('Failed to update author:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update author. Please try again later.' });
    }
  }
  //#endregion

  //#region delete-author
  async removeAuthor(req, res) {
    const { authorId } = req.params;
    try {
      const result = await AuthorService.removeAuthor(authorId);

      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found.' });
      }

      return res.status(StatusCodes.OK).json({ message: 'Remove author successfully.' });
    } catch (err) {
      console.log('Failed to remove author:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to remove author. Please try again later.' });
    }
  }
  //#endregion
}

module.exports = new AuthorController();
