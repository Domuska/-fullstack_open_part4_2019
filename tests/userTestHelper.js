const User = require('../models/user');

const initialUsers = [
  {
    _id: '5d878b02dc541e34f38886bc',
    username: 'kay.brem',
    name: 'Kay Brem',
    password: '$2a$10$WOBWqnxu6vN5ClNYJDtW/e18l26dfC3FD4q7Rsa1OIXI170jR08ty',
    __v: 0,
  },
  {
    _id: '6d878b02dc541e34f38886bd',
    username: 'nicole.ansperger',
    name: 'Nicole Ansperger',
    password: '$2a$10$WOBWqnxu6vN5ClNYJDtW/e18l26dfC3FD4q7Rsa1OIXI170jR08ty',
    __v: 0,
  },
];

const dummyUser = {
  username: 'alain.ackermann',
  // NOTE, THIS PASSWORD DOES NOT ACTULLY HASH INTO THE PASSWORD FIELD'S VALUE
  unHashedPassword: 'metal123',
  password: '$2a$10$ptkUMUfiTs/J8NYSQmo.I.QAYDOZuiFKZqsWOa2FMbryyh1XszLPO',
  __v: 0,
  name: 'Alain Ackermann',
  _id: '7d878b02dc541e34f38886bf',
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  dummyUser,
  usersInDb,
};
