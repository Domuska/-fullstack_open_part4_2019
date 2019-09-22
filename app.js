const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const log = require('./utils/logger');
const morgan = require('./utils/morgan');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    log.info(`Connected to MongoDB at URI ${config.MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


app.use(cors());
app.use(bodyParser.json());
app.use(morgan);

app.use(middleware.tokenExtractor);

app.use('/api/blogs/', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.mongoErrorHandler);
app.use(middleware.webTokenErrorHandler);

module.exports = app;
