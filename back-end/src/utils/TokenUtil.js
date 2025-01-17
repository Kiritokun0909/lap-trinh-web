const jwt = require('jsonwebtoken');

class TokenUtil {
  getHeaderToken(req) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return null;
    }
    return authHeader.split(' ')[1]; // Bearer token
  }
  getUserIdFromToken(token) {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.UserId;
  }
  getUserRoleFromToken(token) {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.RoleId;
  }
  getUserFromToken(token) {
    if (!token) {
      return null;
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new TokenUtil();
