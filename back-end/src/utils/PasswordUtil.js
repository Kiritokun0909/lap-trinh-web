require('dotenv').config();
const bcrypt = require('bcrypt');

class PasswordUtil {
  async hashPassword(password) {
    password = String(password);
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePassword(password, hash) {
    password = String(password);
    return bcrypt.compare(password, hash);
  }
  async generateRandomPassword() {
    const randomPassword = Math.random().toString(36).slice(-8);
    return randomPassword;
  }
}

module.exports = new PasswordUtil();
