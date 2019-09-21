const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// transform the object to form suitable for frontend
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const copy = { ...returnedObject };
    copy.id = returnedObject._id.toString(); // eslint-disable-line
    delete copy._id; // eslint-disable-line
    delete copy.__v; // eslint-disable-line
    return copy;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
