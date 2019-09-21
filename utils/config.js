require('dotenv').config();

let MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_URI_TEST;
} else {
  MONGODB_URI = process.env.MONGODB_URI;
}

module.exports = {
  MONGODB_URI,
  PORT: process.env.PORT,
};
