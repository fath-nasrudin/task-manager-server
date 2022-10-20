const error = require('./error');
const authentication = require('./authentication');
const validation = require('./validation');

module.exports = {
  ...error,
  ...authentication,
  ...validation,
};
