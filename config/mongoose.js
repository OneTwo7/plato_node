var mongoose = require('mongoose');
var UserModel = require('../app/models/User');

module.exports = function (config) {

  mongoose.Promise = global.Promise;

  mongoose.connect(config.db, { useMongoClient: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function () {
    console.log('connected to db');
  });

  UserModel.createDefaultUsers();

};
