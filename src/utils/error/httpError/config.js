const BaseError = require('./BaseError');
const httpStatusCodes = require('./httpStatusCodes');

const config = {
  default: {
    message: {
      400: 'Bad request',
      404: 'The item you are looking for is not found',
      401: 'Not authorized',
      403: 'Forbidden',
      422: 'Validation error',
      500: 'Internal server error',
    },
  },
};

module.exports = {
  config,
  BaseError,
  httpStatusCodes,
};
