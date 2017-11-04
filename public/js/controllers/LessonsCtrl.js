angular.module('app').controller('LessonsCtrl', function ($scope, $routeParams, mvLesson, mvCachedCourses) {
  mvCachedCourses.query().$promise.then(function (collection) {
    collection.forEach(function (course) {
      if (course._id === $routeParams.id) {
        $scope.course = course;
      }
    });
  });

  $scope.lessons = mvLesson.get({ _id: $routeParams.id });
});
