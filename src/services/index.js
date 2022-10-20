const UserModel = require('../models/user.model');
const UserService = require('./user.service');

const userService = UserService(UserModel);

module.exports = {
  userService,
};
