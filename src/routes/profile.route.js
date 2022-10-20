const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authHandler');

router.use(authenticate);

router.route('/')
  .get(userController.getMe)
  .put(userController.editMe)
  .delete(userController.deleteMe);

module.exports = router;
