const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { getHeaderToken } = require('../utils/TokenUtil');
function AuthMiddleware(req, res, next) {
  const token = getHeaderToken(req);
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Access denied');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Invalid token');
  }
}

module.exports = AuthMiddleware;
