require('dotenv').config();
const bcrypt = require('bcrypt');

class BcryptUtil {
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
}

module.exports = new BcryptUtil();
