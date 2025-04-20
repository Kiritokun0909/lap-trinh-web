require('dotenv').config();
const { users } = require('../../models/init-models')(require('../../configs/DbConfig'));
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../../utils/PasswordUtil');
const { ROLE_USER, ACCOUNT_STATUS_BLOCKED } = require('../../utils/HandleCode');
const Messages = require('../../utils/Messages');
const OtpUtil = require('../../utils/OtpUtil');
const { sendMail } = require('../../utils/EmailUtil');
const PasswordUtil = require('../../utils/PasswordUtil');

class AuthService {
  async login(email, password) {
    try {
      const user = await users.findOne({
        where: { Email: email },
        attributes: ['UserId', 'Password', 'Status', 'RoleId'],
      });

      if (!user) {
        throw new Error(JSON.stringify(Messages.ERROR.EMAIL_NOT_FOUND));
      }

      if (user.Status === ACCOUNT_STATUS_BLOCKED) {
        throw new Error(JSON.stringify(Messages.ERROR.ACCOUNT_BLOCKED));
      }

      const isValidPassword = await comparePassword(password, user.Password);

      if (!isValidPassword) {
        throw new Error(JSON.stringify(Messages.ERROR.INVALID_PASSWORD));
      }

      const accessToken = jwt.sign(
        { userId: user.UserId, roleId: user.RoleId },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: '15m',
        }
      );

      const refreshToken = jwt.sign(
        { userId: user.UserId, roleId: user.RoleId },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: '7d',
        }
      );

      const roleId = user.RoleId;

      return { accessToken, refreshToken, roleId };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = jwt.sign(
        { userId: decoded.userId, roleId: decoded.roleId },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: '15m',
        }
      );

      return accessToken;
    } catch (error) {
      throw new Error(JSON.stringify(Messages.ERROR.INVALID_TOKEN));
    }
  }

  async resetAllPasswords(newPassword) {
    try {
      const hashedPassword = await hashPassword(newPassword);

      await users.update({ Password: hashedPassword }, { where: {} });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkDuplicateEmail(email) {
    const existingUser = await users.findOne({ where: { Email: email } });
    return !!existingUser;
  }

  async register(email, password, username) {
    try {
      const hashedPassword = await hashPassword(password);

      const newUser = await users.create({
        Email: email,
        Password: hashedPassword,
        Username: username,
        RoleId: ROLE_USER,
      });

      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendOtp(email) {
    try {
      const otp = await OtpUtil.generateOtp();
      await sendMail(email, 'Reset password OTP', `Your OTP is ${otp}`);
      await OtpUtil.saveOtp(email, otp);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async resetPasswordWithOtp(email, otp) {
    try {
      const savedOtp = await OtpUtil.getOtp(email);

      if (!savedOtp) {
        throw new Error(Messages.ERROR.OTP_NOT_FOUND.message);
      }
      if (savedOtp.otp !== otp) {
        throw new Error(Messages.ERROR.OTP_NOT_MATCHED.message);
      }
      if (Date.now() > savedOtp.expriesAt) {
        throw new Error(Messages.ERROR.OTP_EXPIRED.message);
      }
      const newPassword = await PasswordUtil.generateRandomPassword();
      const hashedPassword = await PasswordUtil.hashPassword(newPassword);
      await users.update({ Password: hashedPassword }, { where: { Email: email } });
      console.log('New password', newPassword);
      await sendMail(email, 'Reset Password', `Your new password is ${newPassword}`);
      await OtpUtil.deleteOtp(email);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthService();

