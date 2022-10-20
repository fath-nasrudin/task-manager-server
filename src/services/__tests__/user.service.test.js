const UserService = require('../user.service');

const UserMock = jest.createMockFromModule('../../models/user.model');
// skipped until know how to mocking mongoose select.
describe('User Service unit test', () => {
  it('should has a module', () => {
    expect(UserService).toBeDefined();
  });

  it('User model should be mocked', () => {
    expect(jest.isMockFunction(UserMock.find)).toBe(true);
  });

  const mockUsers = [
    {
      _id: 'a1a1a1a1a1a1a1a1a1a1a1a1',
      name: 'test',
      email: 'test@test.test',
      password: 'secret',
      role: 'basic',
    },
    {
      _id: '123123123123123123123123',
      name: 'test2',
      email: 'test2@test2.test2',
      password: 'secret2',
      role: 'admin',
    },
  ];
  const mockUsersWithoutPassword = mockUsers.map((user) => {
    const { password, ...result } = user;
    return result;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Get all users', () => {
    it('should list all users', async () => {
      const data = mockUsersWithoutPassword;

      const MockModel = {
        find: jest.fn()
          .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(data) })),
      };

      const userService = UserService(MockModel);
      const users = await userService.getUsers();

      expect(users).toEqual(data);
    });
  });

  describe('get a user by Id', () => {
    it('should get a user if the argument is an object that have property id and user found', async () => {
      try {
        const userData = mockUsersWithoutPassword[0];
        const MockModel = {
          findById: jest.fn()
            .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(userData) })),
        };

        const userService = UserService(MockModel);
        const user = await userService.getUserById({ id: userData._id });

        expect(user).toEqual(userData);
      } catch (error) {
        expect(error).not.toBeDefined();
      }
    });

    it('should get a user if the argument is a string id and user found', async () => {
      try {
        const userData = mockUsersWithoutPassword[0];
        const MockModel = {
          findById: jest.fn()
            .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(userData) })),
        };
        const userService = UserService(MockModel);
        const user = await userService.getUserById(userData._id);

        expect(user).toEqual(userData);
      } catch (error) {
        expect(error).not.toBeDefined();
      }
    });

    it('should return error if the id is missing', async () => {
      try {
        const MockModel = {
          findById: jest.fn().mockResolvedValue(mockUsers[0]),
        };

        const userService = UserService(MockModel);
        await userService.getUserById();
      } catch (error) {
        expect(error.message).toEqual('id is missing');
      }
    });

    it('should throw 404 error if a user with given id not found', async () => {
      try {
        const MockModel = {
          findById: jest.fn()
            .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) })),
        };

        const userService = UserService(MockModel);
        await userService.getUserById('a1a1a1a1a1a1a1a1a1a1a1a1');
      } catch (error) {
        expect(error.message).toEqual('User not found');
        expect(error.statusCode).toBe(404);
      }
    });
    it('should get invalid id if the string id not in objectId format', async () => {
      try {
        const MockModel = {
        };

        const userService = UserService(MockModel);
        await userService.getUserById('notfoundidvlajdafasd');
      } catch (error) {
        expect(error.message).toEqual('invalid id');
        expect(error.statusCode).toBe(400);
      }
    });
  });

  //
  describe('create user', () => {
    it('should throw 400 error if required properties (tested for email missing) is missing', async () => {
      try {
        const { _id, email, ...missedEmail } = mockUsers[0];
        const MockModel = {};

        const userService = UserService(MockModel);
        const createdUser = await userService.createUser(missedEmail);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual('required properties are missing');
      }
    });
    //
    it('failed if user with given email already registerd', async () => {
      try {
        const userData = mockUsers[0];
        const MockModel = {
          findOne: jest.fn().mockResolvedValue(userData),
        };

        const userService = UserService(MockModel);
        const createdUser = await userService.createUser(userData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual('user with given email already registered');
      }
    });

    //
    it('should success if required properties provided and email is unique', async () => {
      const { _id, role, ...userData } = mockUsers[0];

      UserMock.findOne = jest.fn().mockResolvedValue(null);
      UserMock.create = jest.fn().mockResolvedValue(mockUsers[0]);

      const userService = UserService(UserMock);
      const createdUser = await userService.createUser(userData);

      // checking the email
      expect(UserMock.findOne).toBeCalledTimes(1);
      // create user
      expect(UserMock.create).toBeCalledTimes(1);

      expect(createdUser).toEqual(mockUsersWithoutPassword[0]);
    });
  // success create admin
  });

  // edit user
  describe('editUser test', () => {
    it('should failed if the user with given id not found', async () => {
      try {
        const MockModel = {
          findOneAndUpdate: jest.fn()
            .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) })),
        };

        const userService = UserService(MockModel);
        const user = await userService.editUser({ id: 'a1a1a1a1a1a1a1a1a1a1a1a1' });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
        expect(error.message).toEqual('User not found');
      }
    });

    it('should success if found user', async () => {
      const userData = mockUsersWithoutPassword[0];
      const id = userData._id;

      const MockModel = {
        findOneAndUpdate: jest.fn()
          .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(userData) })),
      };

      const userService = UserService(MockModel);
      const user = await userService.editUser(id, userData);

      expect(MockModel.findOneAndUpdate).toBeCalledTimes(1);
      expect(user._id).toEqual(userData._id);
    });
  });

  // delete user
  describe('deleteUser tests', () => {
    it('should failed if the user with given id not found', async () => {
      try {
        const MockModel = {
          findOneAndDelete: jest.fn()
            .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) })),
        };

        const userService = UserService(MockModel);
        await userService.deleteUser({ id: mockUsers[0]._id });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
        expect(error.message).toEqual('User not found');
      }
    });

    it('should success if the user found', async () => {
      const userData = mockUsersWithoutPassword[0];
      const MockModel = {
        findOneAndDelete: jest.fn()
          .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(userData) })),
      };

      const userService = UserService(MockModel);
      const user = await userService.deleteUser({ id: mockUsers[0]._id });

      expect(MockModel.findOneAndDelete).toBeCalledTimes(1);
      expect(user).toEqual(userData);
    });
  });

  // authentication access
  // signup
  describe('signup tests', () => {
    // it('should success signup if all required data is provided and email uniq', async () => {
    // });
    it('should failed if some required data missing', async () => {
      try {
        const { _id, email, ...missedEmail } = mockUsers[0];

        const userService = UserService(UserMock);
        const createdUser = await userService.signup(missedEmail);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual('required properties are missing');
      }
    });
    it('failed if user with given email already registerd', async () => {
      try {
        const userData = mockUsers[0];
        const MockModel = {
          findOne: jest.fn().mockResolvedValue(userData),
        };

        const userService = UserService(MockModel);
        const createdUser = await userService.signup(userData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual('user with given email already registered');
      }
    });
    // it('role still basic if user fill role as admin or anything', async () => {

    // });
    // [next feature] check if email confirmation sent.
  });

  // signin
  describe('signin tests', () => {
    // success if required data provided
    it('should failed if some required data missing', async () => {
      try {
        const { _id, email, ...missedEmail } = mockUsers[0];

        const userService = UserService(UserMock);
        const signedUser = await userService.signin(missedEmail);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual('required properties are missing');
      }
    });
  });

  // signout
  // not yet implemented
});
