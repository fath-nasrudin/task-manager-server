const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 *
 * @param {String} data
 * @returns {Promise}
 */
const hashData = async (data) => bcrypt.hash(data, 8);

/**
 *
 * @param {*} data
 * @param {*} hashedData
 * @returns {Promise}
 */
const isHashedDataMatch = async (data, hashedData) => bcrypt.compare(data, hashedData);

/**
 *
 * @param {String | Object} data string id or object
 */
// const generateJWTToken = (data) => {
//   let input = data;
//   console.debug(typeof input === 'string');
//   if (typeof input === 'string') input = { id: data };

//   return jwt.sign(
//     input,
//     config.jwt.secret,
//     {
//       expiresIn: config.jwt.exp,
//     },
//   );
// };

const generateJWTToken = (id) => jwt.sign(
  { id },
  config.jwt.secret,
  {
    expiresIn: config.jwt.exp,
  },
);

const verifyJWTToken = (token) => jwt.verify(token, config.jwt.secret, {});

module.exports = {
  hashData,
  isHashedDataMatch,
  generateJWTToken,
  verifyJWTToken,
};
