var mongoose = require('mongoose');
var UserModel = require('../app/models/User');
var CourseModel = require('../app/models/Course');
var LessonModel = require('../app/models/Lesson');

module.exports = function (config) {

  mongoose.Promise = global.Promise;

  mongoose.connect(config.db, { useMongoClient: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function () {
    console.log('connected to db');
  });

  UserModel.createDefaultUsers();

  CourseModel.createDefaultCourses();

  LessonModel.createDefaultLessons();

};
