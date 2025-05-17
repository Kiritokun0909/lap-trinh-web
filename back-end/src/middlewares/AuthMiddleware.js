const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {
  getHeaderToken,
  getUserRoleFromToken,
  decodeToken,
  isTokenExpired,
} = require('../utils/TokenUtil');
const Messages = require('../utils/Messages');
const { ROLE_ADMIN, ROLE_USER, GUEST } = require('../utils/HandleCode');
function AuthMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const token = getHeaderToken(req);

    if (!token && !allowedRoles.includes(GUEST)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(Messages.ERROR.ACCESS_DENIED_NO_TOKEN);
    }
    // console.log(token);
    // if (token && isTokenExpired(token)) {
    //   return res.status(StatusCodes.UNAUTHORIZED).send(Messages.ERROR.TOKEN_EXPIRED);
    // }
    try {
      let userRoleId = getUserRoleFromToken(token);
      if (userRoleId === null) {
        userRoleId = GUEST;
      }

      if (allowedRoles.length && !allowedRoles.includes(userRoleId)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(Messages.ERROR.ACCESS_DENIED_NO_PERMISSION);
      }

      const decoded = decodeToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: Messages.ERROR.TOKEN_EXPIRED });
      } else if (error.name === 'JsonWebTokenError') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: Messages.ERROR.TOKEN_INVALID });
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message });
    }
  };
}

module.exports = AuthMiddleware;
