angular.module('app').factory('mvLessonFactory', [
  '$q',
  '$routeParams',
  'mvLesson',
  'mvCachedLessons',
  function ($q, $routeParams, mvLesson, mvCachedLessons) {
  
    function getLesson (course_id, lesson_id) {
      var result;
      var lessons = mvCachedLessons.query(course_id);
      var length = lessons.length;
      for (var i = 0; i < length; i++) {
        if (lessons[i]._id === lesson_id) {
          result = lessons[i];
          break;
        }
      }
      return result;
    }

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
        var lesson = getLesson($routeParams.id, lesson_id);
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
        var lesson = getLesson($routeParams.id, lesson_id);
        var dfd = $q.defer();
        lesson.$delete({ _id: $routeParams.id, _lesson_id: lesson_id }).then(function () {
          dfd.resolve();
        }, function (res) {
          dfd.reject(res.data.reason);
        });
        return dfd.promise;
      }
    };

  }
]);
