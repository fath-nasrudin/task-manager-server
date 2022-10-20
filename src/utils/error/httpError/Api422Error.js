const { httpStatusCodes, BaseError, config } = require('./config');

class Api422Error extends BaseError {
  constructor(
    message = config.default.message[422],
    statusCode = httpStatusCodes.VALIDATION_ERROR,
    isOperational = true,
    name = 'ValidationError',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api422Error;
