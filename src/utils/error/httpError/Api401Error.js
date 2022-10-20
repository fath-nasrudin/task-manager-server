const { httpStatusCodes, BaseError, config } = require('./config');

class Api401Error extends BaseError {
  constructor(
    message = config.default.message[401],
    statusCode = httpStatusCodes.NOT_AUTHORIZED,
    isOperational = true,
    name = 'NotAuthorized',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api401Error;
