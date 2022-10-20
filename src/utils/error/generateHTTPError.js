const {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api422Error,
  Api500Error,
} = require('./httpError');

/**
 * @description throwing an error based on its status code
 * @param {Number} statusCode the HTTP status code
 * @param {Sting | Array} message the message
 */

const generateHTTPError = (statusCode, message) => {
  // switch which error need to be generated.
  switch (statusCode) {
    case 400:
      throw new Api400Error(message);
    case 401:
      throw new Api401Error(message);
    case 403:
      throw new Api403Error(message);
    case 404:
      // if (!message) throw new Api404Error();
      throw new Api404Error(message);
    case 422:
      throw new Api422Error(message);
    default:
      throw new Api500Error(message);
  }
};

module.exports = generateHTTPError;
