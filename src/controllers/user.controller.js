const { userService } = require('../services');

class UserController {
  // authentication
  static async signup(req, res, next) {
    try {
      const { body } = req;
      await userService.signup(body);
      res.status(201).json({ message: 'Success create user' });
    } catch (error) {
      next(error);
    }
  }

  static async signin(req, res, next) {
    try {
      const { body } = req;
      const data = await userService.signin(body);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async signout(req, res, next) {
    try {
      res.json({ message: 'this feature not yet impelemented' });
    } catch (error) {
      next(error);
    }
  }

  // admin
  static async getUsers(req, res, next) {
    try {
      // res.json({ message: 'this feature not yet impelemented' });
      const users = await userService.getUsers();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      // res.json({ message: 'this feature not yet impelemented' });
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      // res.json({ message: 'this feature not yet impelemented' });
      const { body } = req;
      await userService.createUser(body);
      res.status(201).json({ message: 'Success created' });
    } catch (error) {
      next(error);
    }
  }

  static async editUser(req, res, next) {
    try {
      // res.json({ message: 'this feature not yet impelemented' });
      const { id } = req.params;
      const { body } = req;
      await userService.editUser(id, body);
      res.json({ message: 'Success updated' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      // res.json({ message: 'this feature not yet impelemented' });
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: 'Success deleted' });
    } catch (error) {
      next(error);
    }
  }

  // individual
  static async getMe(req, res, next) {
    try {
      const { id } = req.user;
      const user = await userService.getUserById(id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async editMe(req, res, next) {
    try {
      const { id } = req.user;
      const { body } = req;
      const user = await userService.editUser(id, body);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMe(req, res, next) {
    try {
      const { id } = req.user;

      const deletedUser = await userService.deleteUser(id);
      res.json({
        message: 'Success deleted',
        data: { _id: deletedUser._id },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
