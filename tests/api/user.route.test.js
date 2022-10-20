const mongoose = require('mongoose');
const config = require('../../src/config');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

const {
  postData, getData, putData, deleteData,
} = require('../helper');
const { userService } = require('../../src/services');

// need admin level access level
describe('/users tests', () => {
  let server;
  let adminToken;
  let authorization;
  const validBasicUser = {
    name: 'test',
    email: 'test@gm.com',
    password: 'secret',
  };
  const validAdminUser = {
    name: 'admin',
    email: 'admin@example.com',
    password: 'secret',
    role: 'admin',
  };

  beforeAll(async () => {
    await mongoose.connect(config.db.test.uri);
    await User.deleteMany();
    server = app;
  });

  beforeEach(async () => {
    // create user for authentication
    await userService.createUser(validAdminUser);
    const response = await postData('/auth/signin', validAdminUser, server);
    adminToken = response.body.data.token;
    // get the token
    authorization = `Bearer ${adminToken}`;
    // use the token in every request
  });
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /users', () => {
    it('should list all users', async () => {
      // save data first
      await postData('/auth/signup', validBasicUser, server);

      const response = await getData('/users', null, server, { authorization });

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            email: expect.any(String),
            role: expect.any(String),
            _id: expect.any(String),
          })]),

      );
    });
  });
  describe('GET /users/:id', () => {
    //
    it('should failed and send 404 if the item with given id not found', async () => {
      const id = 'adadadadadadadadadadadad';
      const response = await getData(`/users/${id}`, null, server, { authorization });
      expect(response.statusCode).toBe(404);
    });
    it('should success get the user', async () => {
      // try to save user
      const userData = validBasicUser;
      const user = new User(userData);
      await user.save();
      const id = user._id.toString();

      const response = await getData(`/users/${id}`, null, server, { authorization });

      expect(response.body.data._id).toContain(id);
    });
  });
  describe('POST /users', () => {
    // [next feature] failed not fulfill the validation requirement
    it('should failed and get 400 if required properties not provided', async () => {
      const { email, ...missedEmailUser } = validBasicUser;
      const response = await postData('/users', missedEmailUser, server, { authorization });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('required properties are missing');
    });
    it('should failed and get 400 if email already registered', async () => {
      const userData = validBasicUser;

      await postData('/users', userData, server, { authorization });
      const response = await postData('/users', userData, server, { authorization });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('user with given email already registered');
    });
    it('should success create user', async () => {
      const userData = validBasicUser;

      const response = await postData('/users', userData, server, { authorization });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toEqual('Success created');
    });
  });

  describe('EDIT /users/:id', () => {
    it('should failed and send 404 if the item with given id not found', async () => {
      const id = 'adadadadadadadadadadadad';
      const response = await getData(`/users/${id}`, null, server, { authorization });

      expect(response.statusCode).toBe(404);
    });
    //
    it('should success edit the user', async () => {
      // try to save user
      const userData = validBasicUser;
      const newUserData = { name: 'newUserData' };
      const user = new User(userData);
      await user.save();
      const id = user._id.toString();

      const response = await putData(`/users/${id}`, newUserData, server, { authorization });

      const updatedUser = await User.findById(id);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Success updated');
      expect(updatedUser.name).toEqual(newUserData.name);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should failed and send 404 if the item with given id not found', async () => {
      const id = 'adadadadadadadadadadadad';
      const response = await getData(`/users/${id}`, null, server, { authorization });
      expect(response.statusCode).toBe(404);
    });

    it('should success delete the user', async () => {
      // try to save user
      const userData = validBasicUser;
      const newUserData = { name: 'newUserData' };
      const user = new User(userData);
      await user.save();
      const id = user._id.toString();

      const response = await deleteData(`/users/${id}`, newUserData, server, { authorization });
      const deletedUser = await User.findById(id);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Success deleted');
      expect(deletedUser).toBeNull();
    });
  });
});
