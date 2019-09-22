const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const initialBlogs = require('./blogTestHelper').blogs;
const { dummyUser } = require('./userTestHelper');

const api = supertest(app);

const blogsRoute = '/api/blogs';

let authHeader;

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promises = blogObjects.map((blogObject) => blogObject.save());
  await Promise.all(promises);

  // this should go to be run before the whole suite only once. Oh well.
  await User.deleteMany({});
  const user = new User(dummyUser);
  await user.save();
  const response = await api
    .post('/api/login')
    .send({ username: dummyUser.username, password: dummyUser.unHashedPassword });
  authHeader = `bearer ${response.body.token}`;
});

describe('get blogs', () => {
  test('blogs should return 2 blogs', async () => {
    const response = await api
      .get(blogsRoute)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    expect(response.body.length).toBe(initialBlogs.length);
  });

  test('a specific blog should be included', async () => {
    const response = await api.get(blogsRoute);
    const blogTitles = response.body.map((object) => object.title);
    expect(blogTitles).toContain(initialBlogs[0].title);
  });

  test('blogs should contain field \'id\'', async () => {
    const response = await api.get(blogsRoute);
    expect(response.body[0].id).toBeDefined(); // eslint-disable-line
  });
});

describe('post blogs', () => {
  test('list of blogs has new element after adding', async () => {
    const newBlog = {
      title: 'State of JavaScript 2019',
      author: 'Mr. JavaScript',
      url: 'https://medium.com/blog/21/state_of_js_2019',
      likes: 5,
    };

    await api
      .post(blogsRoute)
      .set('Authorization', authHeader)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const response = await api.get(blogsRoute);
    const blogTitles = response.body.map((blogObject) => blogObject.title);
    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(blogTitles).toContain(newBlog.title);
  });

  test('new blog to be initialized with 0 likes', async () => {
    const newBlog = {
      title: 'Hello world?',
      url: 'www.hello.world',
    };

    await api
      .post(blogsRoute)
      .set('Authorization', authHeader)
      .send(newBlog)
      .expect(201);

    const response = await api.get(blogsRoute);
    const addedBlog = response.body.find((element) => element.title === newBlog.title);
    expect(addedBlog).not.toBe(undefined);
    expect(addedBlog.likes).toBeDefined();
    expect(addedBlog.likes).toBe(0);
  });

  test('not providing title should respond with error', async () => {
    const newBlog = {
      url: 'www.www.www',
    };
    await api
      .post(blogsRoute)
      .send(newBlog)
      .expect(400);
  });

  test('not providing url should respond with error', async () => {
    const newBlog = {
      title: 'Hello world?',
    };
    await api
      .post(blogsRoute)
      .send(newBlog)
      .expect(400);
  });
});

describe('delete blogs', () => {
  // note this test is broken, as the user who added the blog is not the same
  // that SHOULD be passed in with the authorization header. Fix if you wish.

  test('deleting a blog and requesting all blogs, blog should have disappeared', async () => {
    // will not actually work if there are two blogs with the same title
    const blogsResponse = await api.get(blogsRoute);
    const blogToBeDeleted = blogsResponse.body[0];

    await api
      .delete(`${blogsRoute}/${blogToBeDeleted.id}`)
      .expect(204);
    const blogsResponse2 = await api.get(blogsRoute);
    const titles = blogsResponse2.body.map((blogObject) => blogObject.title);
    expect(titles).not.toContain(blogToBeDeleted.title);
    expect(blogsResponse2.body.length).toBe(initialBlogs.length - 1);
  });
});

describe('update blogs', () => {
  test('requesting to update a blog should return the updated object', async () => {
    const blogsResponse = await api.get(blogsRoute);
    const blogToUpdate = { ...blogsResponse.body[0] };
    blogToUpdate.likes = 25;
    blogToUpdate.title = 'shouldnotbeupdated';

    const response = await api
      .put(`${blogsRoute}/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

    expect(response.body.likes).toEqual(blogToUpdate.likes);
    expect(response.body.title).not.toEqual(blogToUpdate.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
