const jwt = require("jsonwebtoken");
const Boom = require('@hapi/boom');

const authUser = (req, res, next) => {
  try {
    const token = req.headers["access-token"];
  
    if (!token) {
      return next(Boom.badRequest("Access token is required for authentication"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.userId;

  } catch (err) {
    return next(Boom.unauthorized("Invalid Token"));
  }
  
  return next();
};

module.exports = authUser;