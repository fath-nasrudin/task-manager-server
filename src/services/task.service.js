const { generateHTTPError } = require('../utils');

const getTasks = (Task) => async (userId, options = {}) => {
  if (!userId) return -1;

  const filter = { userId };
  const tasks = await Task.find(filter);
  return tasks;
};

const getTask = (Task) => async (userId, taskId, options = {}) => {
  if (!userId || !taskId) return -1;

  const filter = { userId };
  filter._id = taskId;
  const task = await Task.findOne(filter);
  if (!task) generateHTTPError(404, 'Task not found');
  return task;
};

const createTask = (Task) => async (userId, taskData, options = {}) => {
  if (!userId || !taskData) return -1;
  const { name } = taskData;
  if (!name) generateHTTPError(400, 'required properties are missing');

  const data = taskData;
  data.userId = userId;
  const createdTask = await Task.create(data);
  return createdTask;
};

const editTask = (Task) => async (userId, taskId, taskData, options = {}) => {
  if (!userId || !taskId || !taskData) return -1;

  const data = taskData;
  data.userId = userId;

  const filter = { userId, _id: taskId };

  const task = await Task.findOneAndUpdate(filter, data, { new: true });
  if (!task) generateHTTPError(404, 'Task not found');
  return task;
};

const deleteTask = (Task) => async (userId, taskId, options = {}) => {
  const filter = { userId, _id: taskId };

  const task = Task.findOneAndDelete(filter);
  if (!task) generateHTTPError(404, 'Task not found');
  return task;
};

module.exports = (Task) => ({
  getTasks: getTasks(Task),
  getTask: getTask(Task),
  createTask: createTask(Task),
  editTask: editTask(Task),
  deleteTask: deleteTask(Task),
});
