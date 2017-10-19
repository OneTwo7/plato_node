var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function (config) {

  mongoose.Promise = global.Promise;

  mongoose.connect(config.db, { useMongoClient: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function () {
    console.log('connected to plato db');
  });

  var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    salt: String,
    hashed_pwd: String,
    roles: [String]
  });
  userSchema.methods = {
    authenticate: function (passwordToMatch) {
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
  };
  var User = mongoose.model('User', userSchema);

  var sampleUsers = [
    { firstName: 'Charles', lastName: 'Dickens', email: 'dickens@example.com' },
    { firstName: 'Jane', lastName: 'Austen', email: 'austen@example.com', roles: ['admin'] },
    { firstName: 'Virginia', lastName: 'Woolf', email: 'woolf@example.com' }
  ];

  User.find({}).exec(function (err, collection) {
    if (collection.length === 0) {
      sampleUsers.forEach(function (user) {
        user.salt = createSalt();
        user.hashed_pwd = hashPwd(user.salt, user.firstName);
        User.create(user);
      });
    }
  });

};

function createSalt () {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd (salt, pwd) {
  var hmac = crypto.createHmac('sha256', salt);
  return hmac.update(pwd).digest('hex');
}
