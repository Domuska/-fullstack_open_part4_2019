const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const User = require('../models/user');

const config = require('../utils/config');
const logger = require('../utils/logger');

router.post('/', async (req, res, next) => {
  const { password, username } = req.body;
  try {
    const user = await User.findOne({ username });
    const passwordValid = user === null
      ? false
      : await bcrypt.compare(password, user.password);

    if (!(user && passwordValid)) {
      return res.status(400).send({ error: 'invalid username or password' });
    }

    const tokenBody = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(tokenBody, config.JWT_TOKEN_SECRET);

    return res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

module.exports = router;
