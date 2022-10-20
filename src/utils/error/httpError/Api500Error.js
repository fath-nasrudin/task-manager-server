const { httpStatusCodes, BaseError, config } = require('./config');

class Api500Error extends BaseError {
  constructor(
    message = config.default.message[500],
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    name = 'InternalServer',
  ) {
    super(message, statusCode, isOperational, name);
  }
}

module.exports = Api500Error;
