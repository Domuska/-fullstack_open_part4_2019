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

router.delete('/:blogId', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.blogId);
    response.status(204).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.put('/:blogId', async (request, response, next) => {
  try {
    const { likes } = request.body;
    // todo could check additional things like negative likes or non-number values if needed
    if (!likes) {
      return response.status(400).send({ error: 'Body must include \'likes\' field' });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.blogId,
      { likes },
      { new: true },
    );
    return response.status(200).send(updatedBlog.toJSON());
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

module.exports = router;
