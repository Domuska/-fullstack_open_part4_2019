const router = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');

const populatedUserFields = {
  username: 1,
  id: 1,
  name: 1,
};

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', populatedUserFields);
  const responseBlogs = blogs.map((blogObject) => blogObject.toJSON());
  logger.info('returning blogs:', responseBlogs);
  response.json(responseBlogs);
});


router.post('/', async (request, response, next) => {
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


  try {
    const user = await User.findById(request.decodedToken.id);

    if (!user) {
      return response.status(500).send({ error: 'user was not found' });
    }

    const blog = new Blog({
      likes,
      title,
      author,
      url,
      user: user._id,
    });

    const savedBlog = await blog.save();
    logger.info('user:', user);
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    return response.status(201).json(savedBlog.toJSON());
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

router.delete('/:blogId', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.blogId);

    if (blog.user.toString() === request.decodedToken.id.toString()) {
      await Blog.findByIdAndRemove(request.params.blogId);
      return response.status(204).end();
    }
    return response.status(401).json({ error: 'user does not own the blog' });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

router.put('/:blogId', async (request, response, next) => {
  // note, route only updates the blog's likes
  // updating the whole blog seems unreasonable at this point
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
