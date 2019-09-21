const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// todo set toJSON on schema

module.exports = mongoose.model('Blog', blogSchema);
