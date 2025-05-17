const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {
  getHeaderToken,
  getUserRoleFromToken,
  decodeToken,
} = require('../utils/TokenUtil');
const Messages = require('../utils/Messages');

function OptionalAuthMiddleware(req, res, next) {
  const token = getHeaderToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = decodeToken(token);
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).send(Messages.ERROR.TOKEN_EXPIRED);
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).send(Messages.ERROR.TOKEN_INVALID);
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

// Export both middlewares
module.exports = OptionalAuthMiddleware;
