const { users } = require('../../models/init-models')(require('../../configs/DbConfig'));

const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../../utils/BcryptUtil');
require('dotenv').config();

class AuthService {
  async login(email, password) {
    const user = await users.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await comparePassword(password, user.Password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.UserId, roleId: user.RoleId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return token;
  }

  async resetAllPasswords(newPassword) {
    const hashedPassword = await hashPassword(newPassword);

    await users.update({ Password: hashedPassword }, { where: {} });
  }
}

module.exports = new AuthService();
