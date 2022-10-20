const { httpStatusCodes, BaseError, config } = require('./config');

class Api403Error extends BaseError {
  constructor(
    message = config.default.message[403],
    statusCode = httpStatusCodes.FORBIDDEN,
    isOperational = true,
    name = 'Forbidden',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api403Error;
