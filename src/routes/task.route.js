const router = require('express').Router();
const TaskController = require('../controllers/task.controller');
const { authenticate } = require('../middlewares/authHandler');

router.use(authenticate);

router.route('/')
  .get(TaskController.getTasks)
  .post(TaskController.createTask);
router.route('/:id')
  .get(TaskController.getTask)
  .put(TaskController.editTask)
  .delete(TaskController.deleteTask);

module.exports = router;
