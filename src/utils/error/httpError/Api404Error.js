const { httpStatusCodes, BaseError, config } = require('./config');

class Api404Error extends BaseError {
  constructor(
    message = config.default.message[404],
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true,
    name = 'NotFound',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api404Error;
