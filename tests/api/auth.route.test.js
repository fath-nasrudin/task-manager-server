const request = require('supertest');
const mongoose = require('mongoose');
const config = require('../../src/config');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('/auth tests', () => {
  let server;
  const apiPath = config.api.path;
  beforeAll(async () => {
    // run server
    await mongoose.connect(config.db.test.uri);
    await User.deleteMany();
    server = app.listen(3010);
  });
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    server.close();
  });

  const validBasicUser = {
    name: 'test',
    email: 'test@gm.com',
    password: 'secret',
  };

  const postData = async (path, data, dataServer = server) => request(dataServer)
    .post(`${apiPath}${path}`)
    .send(data)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  describe('POST /auth/signup', () => {
    it('should success signup a user', async () => {
      const userData = validBasicUser;
      const response = await postData('/auth/signup', userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Success create user',
        }),
      );
    });
    it('should send status code 400 if the email already registered', async () => {
      const userData = validBasicUser;

      await request(server)
        .post(`${apiPath}/auth/signup`)
        .send(userData);

      const response = await request(server)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'user with given email already registered',
        }),
      );
    });
    it('should send status code 400 if email or password missing', async () => {
      const data = [{}, { email: 'email@em.c' }, { password: 'secret' }];

      data.forEach(async (userData) => {
        const response = await request(server)
          .post(`${apiPath}/auth/signup`)
          .send(userData)
          .expect(400);

        expect(response.body).toEqual(
          expect.objectContaining({
            message: 'required properties are missing',
          }),
        );
      });
    });
  });

  // sign in
  describe('POST /auth/signin', () => {
    // success signin
    it('should success signin', async () => {
      const userData = validBasicUser;
      await postData('/auth/signup', userData);
      const response = await postData('/auth/signin', userData);

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          __v: expect.anything(),
          _id: expect.any(String),
          token: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
          role: expect.any(String),
        }),
      );
    });

    it('get error 400 if email not registed: wrong email or password', async () => {
      const userData = validBasicUser;
      const response = await postData('/auth/signin', userData);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'wrong email or password',
        }),
      );
    });

    it('get error 400 if password not matched: wrong email or password', async () => {
      const userData = validBasicUser;
      const invalidPassword = { ...validBasicUser, password: 'notsecret' };
      await postData('/auth/signup', userData);

      const response = await postData('/auth/signin', invalidPassword);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'wrong email or password',
        }),
      );
    });
  });

  // sign out
});
