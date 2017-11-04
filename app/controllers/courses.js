var mongoose = require('mongoose');
var Course   = mongoose.model('Course');
var Lesson   = mongoose.model('Lesson');

exports.getCourses = function (req, res) {
  Course.find({}).exec(function (err, collection) {
    res.send(collection);
  });
};

exports.getCourseById = function (req, res) {
  Course.findOne({ _id: req.params.id }).exec(function (err, course) {
    res.send(course);
  });
};

exports.getLessonsByCourseId = function (req, res) {
  Lesson.find({ course: mongoose.Types.ObjectId(req.params.id) }).exec(function (err, collection) {
    res.send(collection);
  });
};
