var mongoose = require('mongoose');
var encrypt = require('../utilities/encrypt');

var userSchema = mongoose.Schema({
  firstName: { type: String, required: '{PATH} is required!' },
  lastName: { type: String, required: '{PATH} is required!' },
  email: { type: String, required: '{PATH} is required!', unique: true },
  salt: { type: String, required: '{PATH} is required!' },
  hashed_pwd: { type: String, required: '{PATH} is required!' },
  roles: [String]
});

userSchema.methods = {
  authenticate: function (passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  }
};

var User = mongoose.model('User', userSchema);

var sampleUsers = [
  { firstName: 'Charles', lastName: 'Dickens', email: 'dickens@example.com' },
  { firstName: 'Jane', lastName: 'Austen', email: 'austen@example.com', roles: ['admin'] },
  { firstName: 'Virginia', lastName: 'Woolf', email: 'woolf@example.com' }
];

exports.createDefaultUsers = function () {
  User.find({}).exec(function (err, collection) {
    if (collection.length === 0) {
      sampleUsers.forEach(function (user) {
        user.salt = encrypt.createSalt();
        user.hashed_pwd = encrypt.hashPwd(user.salt, user.firstName);
        User.create(user);
      });
    }
  });
};
