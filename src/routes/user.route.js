const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middlewares/authHandler');

router.use(authenticate);
router.use(isAdmin);

router.route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .put(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
