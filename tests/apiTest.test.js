const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const initialBlogs = require('./testData').blogs;

const api = supertest(app);

const blogsRoute = '/api/blogs';

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promises = blogObjects.map((blogObject) => blogObject.save());
  await Promise.all(promises);
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
  test('list of bots has new element after adding', async () => {
    const newBlog = {
      title: 'State of JavaScript 2019',
      author: 'Mr. JavaScript',
      url: 'https://medium.com/blog/21/state_of_js_2019',
      likes: 5,
    };

    await api
      .post(blogsRoute)
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
      .send(newBlog);

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

afterAll(() => {
  mongoose.connection.close();
});
