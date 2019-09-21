const router = require('express').Router();

const Blog = require('../models/blog');
const logger = require('../utils/logger');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  const responseBlogs = blogs.map((blogObject) => blogObject.toJSON());
  logger.info('returning blogs:', responseBlogs);
  response.json(responseBlogs);
});

router.post('/', async (request, response) => {
  const {
    title, author, url,
  } = request.body;

  if (!title || !url) {
    return response.status(400).send({ error: 'fields \'title\' and \'url\' are required' });
  }

  let { likes } = request.body;
  if (!likes) {
    likes = 0;
  }

  const blog = new Blog({
    likes, title, author, url,
  });

  const result = await blog.save();
  return response.status(201).json(result.toJSON());
});

module.exports = router;
