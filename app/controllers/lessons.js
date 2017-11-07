var mongoose = require('mongoose');
var Lesson   = mongoose.model('Lesson');

exports.getLessonsByCourseId = function (req, res) {
  Lesson.find({ course: req.params.id }).exec(function (err, collection) {
    res.send(collection);
  });
};

exports.getLessonById = function (req, res) {
  Lesson.findOne({ _id: req.params.lesson_id }).exec(function (err, lesson) {
    res.send(lesson);
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

exports.updateLesson = function (req, res) {
  var lessonData = req.body;

  Lesson.findOne({ _id: req.params.lesson_id }).exec(function (err, lesson) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }

    lesson.title = lessonData.title;
    lesson.content = lessonData.content;

    lesson.save(function (err) {
      if (err) {
        res.status(400);
        return res.send({ reason: err.toString() });
      }
      res.send(lesson);
    });
  });
};

exports.deleteLesson = function (req, res) {
  Lesson.remove({ _id: req.params.lesson_id }, function (err) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }
    res.status(200).json(req.params.lesson_id);
  });
};
