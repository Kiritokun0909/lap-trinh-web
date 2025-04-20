const UserService = require('../services/UserService');
const { StatusCodes } = require('http-status-codes');
const Messages = require('../../utils/Messages');
const { getUserFromToken, getHeaderToken } = require('../../utils/TokenUtil');
const HandleCode = require('../../utils/HandleCode');

class UserController {
  //#region get-info
  async getUserInfo(req, res) {
    const userId = req?.user.userId;
    try {
      const result = await UserService.getUserInfoById(userId);
      if (result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
      }

      return res.status(StatusCodes.OK).json(result.userInfo);
    } catch (err) {
      console.log('Failed to get user info:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to get user info. Please try again later.' });
    }
  }
  //#endregion

  //#region update-info
  async updateUserInfo(req, res) {
    const { username, avatar } = req.body;
    const userId = req?.user.userId;
    try {
      const result = await UserService.updateUserInfo(userId, username, avatar);
      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
      }

      return res.status(200).json({ message: 'Update info successfully.' });
    } catch (err) {
      console.log('Failed to update user info:', err);
      return res.status(500).json({ message: 'Failed to update info. Please try again later.' });
    }
  }
  //#endregion

  //#region change-mail
  async changeUserEmail(req, res) {
    const { email } = req.body;
    const userId = req?.user.userId;
    try {
      const result = await UserService.updateUserEmail(userId, email);

      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
      }

      if (result && result.code == HandleCode.EMAIL_EXIST) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: 'Email is already existed. Try another email.' });
      }

      return res.status(StatusCodes.OK).json({ message: 'Change email successfully.' });
    } catch (err) {
      console.log('Failed to change user email:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to change email. Please try again later.' });
    }
  }
  //#endregion

  //#region change-pwd
  async changeUserPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req?.user.userId;
    try {
      const result = await UserService.updateUserPassword(userId, oldPassword, newPassword);

      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
      }

      if (result && result.code == HandleCode.PASSWORD_NOT_MATCH) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Old password is not correct.' });
      }

      return res.status(StatusCodes.OK).json({ message: 'Change password successfully.' });
    } catch (err) {
      console.log('Failed to change user password:', err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to change password. Please try again later.',
      });
    }
  }
  //#endregion

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

const checkUserLikeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await UserService.isLikeFollowManga(parseInt(mangaId), parseInt(userId), type);

    if (result && result.code === HandleCode.NOT_FOUND) {
      return res.status(StatusCodes.OK).json({ isLikeFollow: false });
    }

    return res.status(StatusCodes.OK).json({ isLikeFollow: true });
  } catch (err) {
    console.error('Failed to check user like/follow manga:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to check user like/follow manga. Please try again later.',
    });
  }
};

const likeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;

  const userId = req.user?.userId;

  try {
    const result = await UserService.likeFollowManga(parseInt(mangaId), parseInt(userId), type);
    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Manga not found.' });
      return;
    }
    if (result && result.code == HandleCode.USER_ALREADY_LIKE) {
      res.status(StatusCodes.CONFLICT).json({ message: 'User already like this manga.' });
      return;
    }
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    console.log('Failed to like manga:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to like manga. Please try again later.' });
  }
};

const unLikeFollowManga = async (req, res, type = 'like') => {
  const { mangaId } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await UserService.unLikeFollowManga(parseInt(mangaId), parseInt(userId), type);
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

<<<<<<< HEAD
=======
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
  async getUsers(req, res) {
    try {
      const { page, limit, search_query, is_blocked } = req.query;
      const users = await UserService.getUsers(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        search_query || '',
        is_blocked || ''
      );
      return res.status(StatusCodes.OK).json(users);
    } catch (error) {
      console.error('Failed to get users:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get users' });
    }
  }
  async toggleBlockUser(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ID is required' });
      }
      const isToggleBlockUser = await UserService.toggleBlockUser(parseInt(userId));
      if (isToggleBlockUser && isToggleBlockUser.code === HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
      if (isToggleBlockUser && isToggleBlockUser.code === HandleCode.SUCCESS) {
        return res.status(StatusCodes.OK).json({ message: 'User status updated successfully' });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user status' });
    } catch (error) {
      console.error('Failed to block/unblock user:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to block/unblock user' });
    }
  }
}

>>>>>>> origin/back-end
module.exports = new UserController();
