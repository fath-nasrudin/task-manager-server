const mongoose = require('mongoose');
const config = require('../../src/config');
const app = require('../../src/app');

const User = require('../../src/models/user.model');
const Task = require('../../src/models/task.model');
const { userService } = require('../../src/services');

const {
  postData, getData, putData, deleteData,
} = require('../helper');

// need admin level access level
describe('/tasks tests', () => {
  let server;
  const token = {};
  let authorization;
  let authorization2;

  const tasks = [
    {
      name: 'this is task 1',
      isDone: false,
    },
    {
      name: 'this is task 2',
      isDone: true,
    },
  ];
  const basicUser = {
    name: 'basic',
    email: 'basic@example.com',
    password: 'secret',
  };
  const basicUser2 = {
    name: 'basic',
    email: 'basic2@example.com',
    password: 'secret',
  };

  beforeAll(async () => {
    await mongoose.connect(config.db.test.uri);
    await Task.deleteMany();
    await User.deleteMany();
    server = app;

    // create user for authentication
    await userService.createUser(basicUser);
    await userService.createUser(basicUser2);

    // signin then get the token
    const response = await postData('/auth/signin', basicUser, server);
    token.basic1 = response.body.data.token;
    authorization = `Bearer ${token.basic1}`;

    const response2 = await postData('/auth/signin', basicUser2, server);
    token.basic2 = response2.body.data.token;
    authorization2 = `Bearer ${token.basic2}`;
  });

  afterEach(async () => {
    await Task.deleteMany();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /tasks', () => {
    it('should list all tasks based on user id', async () => {
      // save data first
      const data = tasks[0];
      await postData('/tasks', data, server, { authorization });

      const response = await getData('/tasks', null, server, { authorization });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
  describe('GET /tasks/:id', () => {
    it('should failed get task with the right task id that doesnt belong to the user id', async () => {
      // try to save user with auth1
      const data = tasks[0];
      const response2 = await postData('/tasks', data, server, { authorization });
      const taskData = response2.body.data;
      const id = taskData._id.toString();

      // try to access task belong to auth1 with auth2
      const response = await getData(`/tasks/${id}`, null, server, { authorization: authorization2 });

      expect(response.statusCode).toBe(404);
    });

    it('failed get task and get 404 status code if the task id couldnt be found.', async () => {
      const id = 'adadadadadadadadadadadad';
      const response = await getData(`/tasks/${id}`, null, server, { authorization });

      expect(response.statusCode).toBe(404);
    });

    it('success get task that belong to the user id', async () => {
      // try to save user
      const data = tasks[0];
      const response2 = await postData('/tasks', data, server, { authorization });
      const taskData = response2.body.data;
      const id = taskData._id.toString();

      const response = await getData(`/tasks/${id}`, null, server, { authorization });

      expect(response.body.data._id).toContain(id);
    });
  });
  describe('POST /tasks', () => {
    it('should failed and get 400 if required properties not provided', async () => {
      const { name, ...missedNameTask } = tasks[0];
      const response = await postData('/tasks', missedNameTask, server, { authorization });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('required properties are missing');
    });
    it('should success create task', async () => {
      const data = tasks[0];
      const response = await postData('/tasks', data, server, { authorization });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.name).toEqual(data.name);
    });
  });

  describe('EDIT /tasks/:id', () => {
    it('failed get task and get 404 status code if the task id couldnt be found.', async () => {
      const id = 'adadadadadadadadadadadad';
      const data = tasks[0];
      const response = await putData(`/tasks/${id}`, data, server, { authorization });

      expect(response.statusCode).toBe(404);
    });
    //
    it('should success edit the user', async () => {
      // try to save data
      const data = tasks[0];
      const newData = { ...tasks[1], isDone: true };
      const postResponse = await postData('/tasks', data, server, { authorization });
      const id = postResponse.body.data._id.toString();

      const response = await putData(`/tasks/${id}`, newData, server, { authorization });
      const updatedData = response.body.data;

      expect(response.status).toBe(200);
      expect(updatedData.isDone).toBe(true);
      expect(updatedData.name).toEqual(newData.name);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('failed get task and get 404 status code if the task id couldnt be found.', async () => {
      const id = 'adadadadadadadadadadadad';
      const data = tasks[0];
      const response = await putData(`/tasks/${id}`, data, server, { authorization });

      expect(response.statusCode).toBe(404);
    });

    it('should success delete the user', async () => {
      // try to save data
      const data = tasks[0];
      const postResponse = await postData('/tasks', data, server, { authorization });
      const id = postResponse.body.data._id.toString();

      const response = await deleteData(`/tasks/${id}`, null, server, { authorization });

      const deletedData = await Task.findById(id);

      expect(response.status).toBe(200);
      expect(deletedData).toBeNull();
    });
  });
});
