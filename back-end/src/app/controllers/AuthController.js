const AuthServices = require('../services/AuthService');
const { StatusCodes } = require('http-status-codes');
const Messages = require('../../utils/Messages');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, roleId } = await AuthServices.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({ accessToken, roleId });
    } catch (error) {
      console.error(error);
      const errorCode = JSON.parse(error.message);
      return res.status(StatusCodes.UNAUTHORIZED).json({ code: errorCode.code, message: errorCode.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        const errorCode = Messages.ERROR.REFRESH_TOKEN_REQUIRED;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: errorCode.code, message: errorCode.message });
      }

      const accessToken = await AuthServices.refreshToken(refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({ accessToken });
    } catch (error) {
      const errorCode = JSON.parse(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: errorCode.code, message: errorCode.message });
    }
  }

  async resetAllPasswords(req, res) {
    try {
      const { newPassword } = req.body;
      await AuthServices.resetAllPasswords(newPassword);

      return res.status(StatusCodes.OK).json({
        message: Messages.SUCCESS.RESET_ALL_PASSWORDS_SUCCESS.message,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, password, username } = req.body;
      const isDuplicateEmail = await AuthServices.checkDuplicateEmail(email);
      if (isDuplicateEmail) {
        const errorCode = Messages.ERROR.EMAIL_ALREADY_IN_USE;
        return res.status(StatusCodes.CONFLICT).json({ code: errorCode.code, message: errorCode.message });
      }
      const user = await AuthServices.register(email, password, username);
      return res.status(StatusCodes.CREATED).json({ message: Messages.SUCCESS.REGISTER_SUCCESS.message, user });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async sendOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        const errorCode = Messages.ERROR.EMAIL_REQUIRED;
        return res.status(StatusCodes.BAD_REQUEST).json({ code: errorCode.code, message: errorCode.message });
      }
      const isFoundEmail = await AuthServices.checkDuplicateEmail(email);
      if (!isFoundEmail) {
        const errorCode = Messages.ERROR.EMAIL_NOT_FOUND;
        return res.status(StatusCodes.NOT_FOUND).json({ code: errorCode.code, message: errorCode.message });
      }

      const isSent = await AuthServices.sendOtp(email);
      if (isSent) {
        return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async resetPasswordWithOtp(req, res) {
    try {
      const { email, otp } = req.body;
      console.log('otp:', otp);
      if (!email) {
        const errorCode = Messages.ERROR.EMAIL_REQUIRED;
        return res.status(StatusCodes.BAD_REQUEST).json({ code: errorCode.code, message: errorCode.message });
      }
      const isFoundEmail = await AuthServices.checkDuplicateEmail(email);
      if (!isFoundEmail) {
        const errorCode = Messages.ERROR.EMAIL_NOT_FOUND;
        console.log('error code', errorCode);
        return res.status(StatusCodes.NOT_FOUND).json({ code: errorCode.code, message: errorCode.message });
      }
      const isReset = await AuthServices.resetPasswordWithOtp(email, otp);
      if (isReset) {
        return res.status(StatusCodes.OK).json({ message: 'Password reset successfully' });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to reset password' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
