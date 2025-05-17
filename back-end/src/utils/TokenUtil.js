const jwt = require('jsonwebtoken');

class TokenUtil {
  getHeaderToken(req) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return null;
    }
    return authHeader.split(' ')[1]; // Bearer token
  }

  decodeToken(token) {
    try {
      if (!token) {
        return null;
      }

      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      console.error('Token decoding error:', error);
      throw new Error(error.message);
    }
  }

  getUserIdFromToken = (token) => {
    try {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.userId : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error(error.message);
    }
  };

  getUserRoleFromToken = (token) => {
    try {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.roleId : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error(error.message);
    }
  };

  getUserFromToken = (token) => {
    try {
      return this.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error(error.message);
    }
  };
}

module.exports = new TokenUtil();
