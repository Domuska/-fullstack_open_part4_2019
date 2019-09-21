const log = require('./logger');

const unknownEndpoint = (request, response) => {
  // todo should be updated to just show the requested route and ip, if even that
  log.error(`Request to unknown endpoint: ${request}`);
  response.status(404).send({ error: 'unknown endpoint' });
};

const mongoErrorHandler = (error, request, response, next) => {
  log.error(error.message);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

module.exports = {
  unknownEndpoint,
  mongoErrorHandler,
};
