const UserService = require('../services/UserService');
const { StatusCodes } = require('http-status-codes');
const Messages = require('../../utils/Messages');
const { getUserFromToken, getHeaderToken } = require('../../utils/TokenUtil');
const HandleCode = require('../../utils/HandleCode');

const checkUserLikeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await UserService.isLikeFollowManga(
      parseInt(mangaId),
      parseInt(userId),
      type
    );

    if (result && result.code === HandleCode.NOT_FOUND) {
      return res.status(StatusCodes.OK).json({ isLikeFollow: false });
    }

    return res.status(StatusCodes.OK).json({ isLikeFollow: true });
  } catch (err) {
    console.error('Failed to check user like/follow manga:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        'Failed to check user like/follow manga. Please try again later.',
    });
  }
};

const likeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;

  const userId = req.user?.userId;

  try {
    const result = await UserService.likeFollowManga(
      parseInt(mangaId),
      parseInt(userId),
      type
    );
    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Manga not found.' });
      return;
    }
    if (result && result.code == HandleCode.USER_ALREADY_LIKE) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'User already like this manga.' });
      return;
    }
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    console.log('Failed to like manga:', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to like manga. Please try again later.' });
  }
};

const unLikeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await UserService.unLikeFollowManga(
      parseInt(mangaId),
      parseInt(userId),
      type
    );
    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Manga not found or user already unlike/unfollow this manga.',
      });
      return;
    }
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    console.log('Failed to unlike/unfollow manga:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to unlike/unfollow manga. Please try again later.',
    });
  }
};

const getListLikeFollowManga = async (req, res, type) => {
  const { page, limit, keyword, filterCode } = req.query;
  const userId = req.user?.userId;

  try {
    const result = await UserService.getUserLikeFollowList(
      parseInt(page),
      parseInt(limit),
      parseInt(userId),
      type,
      keyword,
      filterCode
    );
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    console.log('Failed to get list like/follow manga:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to get list like/follow manga. Please try again later.',
    });
  }
};

class UserController {
  async checkUserLikeManga(req, res) {
    await checkUserLikeFollowManga(req, res, 'like');
  }

  async checkUserFollowManga(req, res) {
    await checkUserLikeFollowManga(req, res, 'follow');
  }

  async likeManga(req, res) {
    await likeFollowManga(req, res, 'like');
  }

  async followManga(req, res) {
    await likeFollowManga(req, res, 'follow');
  }

  async unlikeManga(req, res) {
    await unLikeFollowManga(req, res, 'like');
  }

  async unfollowManga(req, res) {
    await unLikeFollowManga(req, res, 'follow');
  }

  async getListLikeManga(req, res) {
    await getListLikeFollowManga(req, res, 'like');
  }

  async getListFollowManga(req, res) {
    await getListLikeFollowManga(req, res, 'follow');
  }
}

module.exports = new UserController();
