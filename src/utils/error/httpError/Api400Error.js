const { httpStatusCodes, BaseError, config } = require('./config');

class Api400Error extends BaseError {
  constructor(
    message = config.default.message[400],
    statusCode = httpStatusCodes.BAD_REQUEST,
    isOperational = true,
    name = 'BadRequest',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api400Error;
