var mongoose = require('mongoose');
var Course   = mongoose.model('Course');
var Lesson   = mongoose.model('Lesson');

exports.getCourses = function (req, res) {
  Course.find({ published: { $ne: null } }).exec(function (err, collection) {
    res.send(collection);
  });
};

exports.getUnpublishedCourses = function (req, res) {
  Course.find({ published: null }).exec(function (err, collection) {
    res.send(collection);
  });
};

exports.getCourseById = function (req, res) {
  Course.findOne({ _id: req.params.id }).exec(function (err, course) {
    res.send(course);
  });
};

exports.createCourse = function (req, res) {
  var courseData = req.body;

  Course.create(courseData, function (err, course) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }
    res.send(course);
  });
};

exports.updateCourse = function (req, res) {
  var courseData = req.body;

  Course.findOneAndUpdate({ _id: req.params.id }, courseData, {
    new: true
  }).exec(function (err, course) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }

    res.send(course);
  });
};

exports.deleteCourse = function (req, res) {
  Lesson.remove({ course: req.params.id }).exec(function (err) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }
  });

  Course.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.status(400);
      return res.send({ reason: err.toString() });
    }
    res.status(200).json(req.params.id);
  });
};
