const morgan = require('morgan');

const stringifyBody = (req, res) => JSON.stringify(req.body); // eslint-disable-line
morgan.token('stringBody', (req, res) => stringifyBody(req, res));
const morganFormat = ':method :url :status :res[content-length] - :response-time ms - :stringBody';

module.exports = morgan(morganFormat);
