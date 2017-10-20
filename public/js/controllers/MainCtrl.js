angular.module('app').controller('MainCtrl', function ($scope, mvCachedCourses) {
  $scope.courses = mvCachedCourses.query();
});
