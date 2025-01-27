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
    console.log('token', token);
    if (!token) {
      return null;
    }
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }

  getUserIdFromToken = (token) => {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.userId : null;
  };

  getUserRoleFromToken = (token) => {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.roleId : null;
  };
  
  getUserFromToken = (token) => {
    return this.decodeToken(token);
  };
}

module.exports = new TokenUtil();
