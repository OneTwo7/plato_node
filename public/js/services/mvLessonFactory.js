angular.module('app').factory('mvLessonFactory', function ($q, $routeParams, mvLesson) {
  return {
    create: function (newLessonData) {
      var newLesson = new mvLesson(newLessonData);
      var dfd = $q.defer();
      newLesson.$save({ _id: $routeParams.id }).then(function (lesson) {
        dfd.resolve(lesson);
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    },
    update: function (lessonData) {
      var lesson_id = lessonData.lesson_id;
      delete lessonData.lesson_id;
      var lesson = mvLesson.getOne({ _id: $routeParams.id, _lesson_id: lesson_id });
      var dfd = $q.defer();
      var clone = angular.copy(lesson);
      angular.extend(clone, lessonData);
      clone.$update({ _id: $routeParams.id, _lesson_id: lesson_id }).then(function (lesson) {
        dfd.resolve(lesson);
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    },
    delete: function (lesson_id) {
      var lesson = mvLesson.getOne({ _id: $routeParams.id, _lesson_id: lesson_id });
      var dfd = $q.defer();
      lesson.$delete({ _id: $routeParams.id, _lesson_id: lesson_id }).then(function () {
        dfd.resolve();
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    }
  };
});
