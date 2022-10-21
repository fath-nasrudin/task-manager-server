const { taskService } = require('../services');

class TaskController {
  static async getTasks(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await taskService.getTasks(userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async getTask(req, res, next) {
    try {
      const userId = req.user._id;
      const taskId = req.params.id;
      const data = await taskService.getTask(userId, taskId);

      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req, res, next) {
    try {
      const { body } = req;
      const userId = req.user._id;
      const data = await taskService.createTask(userId, body);
      res.status(201).json({ message: 'Task created', data });
    } catch (error) {
      next(error);
    }
  }

  static async editTask(req, res, next) {
    try {
      // take the userId, taskId, data
      const userId = req.user._id;
      const taskId = req.params.id;
      const { body } = req;
      const data = await taskService.editTask(userId, taskId, body);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      // take the userId, taskId, data
      const userId = req.user._id;
      const taskId = req.params.id;
      const data = await taskService.deleteTask(userId, taskId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
