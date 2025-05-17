const { StatusCodes } = require('http-status-codes');
const UserService = require('../services/UserService');
const HandleCode = require('../../utils/HandleCode');

class UserController {
  async getUsers(req, res) {
    try {
      const { page, limit, keyword, filterCode } = req.query;
      const users = await UserService.getUsers(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        keyword || '',
        filterCode || ''
      );
      return res.status(StatusCodes.OK).json(users);
    } catch (error) {
      console.error('Failed to get users:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to get users' });
    }
  }

  async blockUser(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'User ID is required' });
      }

      const isToggleBlockUser = await UserService.toggleBlockUser(parseInt(userId));
      if (isToggleBlockUser && isToggleBlockUser.code === HandleCode.NOT_FOUND) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
      if (isToggleBlockUser && isToggleBlockUser.code === HandleCode.SUCCESS) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'User status updated successfully' });
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update user status' });
    } catch (error) {
      console.error('Failed to block/unblock user:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to block/unblock user' });
    }
  }
}

module.exports = new UserController();
