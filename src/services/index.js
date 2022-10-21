const UserModel = require('../models/user.model');
const UserService = require('./user.service');

const userService = UserService(UserModel);

const TaskModel = require('../models/task.model');
const TaskService = require('./task.service');

const taskService = TaskService(TaskModel);

module.exports = {
  userService,
  taskService,
};
