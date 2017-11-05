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
    }
  };
});
