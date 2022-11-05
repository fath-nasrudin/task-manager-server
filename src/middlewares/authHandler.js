const {
  generateHTTPError,
  verifyJWTToken,
} = require('../utils');

const { userService } = require('../services');

// handling verification jwt
const authenticate = async (req, res, next) => {
  try {
  // take the token from authorization
    const { authorization } = req.headers;

    if (!authorization) generateHTTPError(401, 'authorization not found in header');

    if (!authorization.startsWith('Bearer ')) generateHTTPError(401, 'authorization need in bearer format');

    const [, token] = authorization.split(' ');

    // verify the token
    const decoded = await verifyJWTToken(token);
    if (!decoded) generateHTTPError(401, 'please provide correct JWT token');

    // if verified, looked for the user
    const user = await userService.getUserById(decoded._id);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

// handling isAdmin check
const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') generateHTTPError(403);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  isAdmin,
};
