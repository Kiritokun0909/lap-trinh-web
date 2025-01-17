const AuthServices = require('../services/AuthService');
const { StatusCodes } = require('http-status-codes');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await AuthServices.login(email, password);

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async resetAllPasswords(req, res) {
    try {
      const { newPassword } = req.body;
      await AuthServices.resetAllPasswords(newPassword);

      return res.status(StatusCodes.OK).json({ message: 'Reset all passwords successfully' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
