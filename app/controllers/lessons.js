var mongoose = require('mongoose');
var Lesson   = mongoose.model('Lesson');

exports.getLessonsByCourseId = function (req, res) {
  Lesson.find({ course: req.params.id }).exec(function (err, collection) {
    res.send(collection);
  });
};

exports.createLesson = function (req, res) {
  var lessonData = req.body;

  Lesson.create(lessonData, function (err, lesson) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }
    res.send(lesson);
  });
};
