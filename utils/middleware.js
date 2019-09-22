const jwt = require('jsonwebtoken');

const logger = require('./logger');
const config = require('./config');

/**
 * middleware for adding decoded token
 * from requests into req.decodedToken,
 * token should have fields username & id,
 * as defined in login
 */
const tokenExtractor = async (req, res, next) => {
  const header = req.get('authorization');
  if (header && header.toLowerCase().startsWith('bearer ')) {
    req.token = header.substring(7);
    req.decodedToken = await jwt.verify(req.token, config.JWT_TOKEN_SECRET);
    if (!req.token || !req.decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }
  }
  return next();
};

const unknownEndpoint = (request, response) => {
  // todo should be updated to just show the requested route and ip, if even that
  logger.error(`Request to unknown endpoint: ${request}`);
  response.status(404).send({ error: 'unknown endpoint' });
};

const mongoErrorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    logger.error(error.message);
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    logger.error(error.message);
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

const webTokenErrorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    logger.info('invalid token');
    return response.status(401).json({ error: 'invalid token' });
  }
  return next(error);
};

module.exports = {
  tokenExtractor,
  unknownEndpoint,
  mongoErrorHandler,
  webTokenErrorHandler,
};
