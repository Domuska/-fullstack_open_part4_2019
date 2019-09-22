const router = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const logger = require('../utils/logger');

const populatedBlogFields = {
  title: 1,
  url: 1,
  author: 1,
  id: 1,
};

const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

router.get('/', async (req, res, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', populatedBlogFields);
    const responseUsers = users.map((user) => user.toJSON());
    res.status(200).json(responseUsers);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!(username && name && password)) {
      return res.status(400).send({ error: 'fields "username", "name" & "password" required' });
    }

    // gotta validate pw here so just check the username too
    if (username.length < 4 || password.length < 4) {
      return res.status(400).send({ error: 'fields "username" and "password" should be over 3 symbols long' });
    }

    const userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      return res.status(400).send({ error: 'username not unique' });
    }

    const hashedPw = await hashPassword(password);
    const user = new User({
      username,
      name,
      password: hashedPw,
    });

    const savedUser = await user.save();
    return res.status(200).json(savedUser.toJSON());
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});


module.exports = router;
