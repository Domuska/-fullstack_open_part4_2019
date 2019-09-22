const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const copy = { ...returnedObject };
    copy.id = returnedObject._id.toString(); // eslint-disable-line
    delete copy._id; // eslint-disable-line
    delete copy.__v; // eslint-disable-line
    delete copy.password;
    return copy;
  },
});

module.exports = mongoose.model('User', userSchema);
