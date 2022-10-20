const mongoose = require('mongoose');
const config = require('../../src/config');

const app = require('../../src/app');
const User = require('../../src/models/user.model');
const UserService = require('../../src/services/user.service');

const userService = UserService(User);

const {
  postData, getData,
} = require('../helper');

describe('authentication test', () => {
  let server;
  let basicToken;
  let adminToken;
  const validBasicUser = {
    name: 'test',
    email: 'test@gm.com',
    password: 'secret',
  };
  const validAdminUser = {
    name: 'admin',
    email: 'admin@gm.com',
    password: 'secret',
    role: 'admin',
  };

  beforeAll(async () => {
    await mongoose.connect(config.db.test.uri);
    await User.deleteMany();
    // server = app.listen(3001);
    server = app;

    // try to get the token
    // create basic user
    await postData('/auth/signup', validBasicUser, server);
    const response = await postData('/auth/signin', validBasicUser, server);
    basicToken = response.body.data.token;

    // crate admin user
    await userService.createUser(validAdminUser);
    const response2 = await postData('/auth/signin', validAdminUser, server);
    adminToken = response2.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    // server.close();
  });

  /// / TEST
  describe('authenticate middleware', () => {
    it('should get 401 if token not provided', async () => {
      const response = await getData('/users', null, server);
      expect(response.status).toBe(401);
    });
    it('should get 401 error if bearer keyword is wrong', async () => {
      const authorization = `Bearerrrr ${basicToken}`;
      const response = await getData('/users', null, server, { authorization });

      expect(response.status).toBe(401);
    });
    it('should get 401 if the token not in the valid format', async () => {
      const authorization = `Bearerrrr ${basicToken}sfsd`;
      const response = await getData('/users', null, server, { authorization });

      expect(response.status).toBe(401);
    });
    it('should get 401 if the token failed to validate', async () => {
      const authorization = 'Bearerrrr asdfasdfasdfdasfsdfsdf';
      const response = await getData('/users', null, server, { authorization });

      expect(response.status).toBe(401);
    });
    it('should got 403 if the user role is not admin', async () => {
      const authorization = `Bearer ${basicToken}`;
      const response = await getData('/users', null, server, { authorization });

      expect(response.status).toBe(403);
    });
    it('should success if user is admin and have valid token', async () => {
      const authorization = `Bearer ${adminToken}`;
      const response = await getData('/users', null, server, { authorization });

      expect(response.status).toBe(200);
    });
  });
});
