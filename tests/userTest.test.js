const mongoose = require('mongoose');
const supertest = require('supertest');

const { initialUsers, usersInDb } = require('./userTestHelper');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);
const usersRoute = '/api/users';

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = initialUsers.map((blog) => new User(blog));
  const promises = userObjects.map((blogObject) => blogObject.save());
  await Promise.all(promises);
});

afterAll(() => {
  mongoose.connection.close();
});

describe('add users', () => {
  test('username should be over 3 symbols, request should return error', async () => {
    const requestBody = {
      username: 'asd',
      password: 'supersecret',
      name: 'Das Das',
    };

    const response = await api
      .post(usersRoute)
      .send(requestBody)
      .expect(400);

    expect(response.body.error).toContain('over 3 symbols');
  });

  test('password should be over 3 symbols, request should return error', async () => {
    const requestBody = {
      username: 'Dasdas',
      password: '1',
      name: 'Das Das',
    };
    const response = await api
      .post(usersRoute)
      .send(requestBody)
      .expect(400);

    expect(response.body.error).toContain('over 3 symbols');
  });

  test('adding new user with username that already exists should fail', async () => {
    const usersBeforeRequest = await usersInDb();

    const newUser = {
      username: usersBeforeRequest[0].username,
      password: '1234',
      name: 'das dasd asdasd',
    };

    const response = await api
      .post(usersRoute)
      .send(newUser)
      .expect(400);

    expect(response.body.error).toContain('username not unique');

    const usersAfterRequest = await usersInDb();
    expect(usersAfterRequest.length).toBe(usersBeforeRequest.length);
  });
});
