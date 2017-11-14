angular.module('app').controller('MainCtrl', [
  '$scope',
  'mvCachedCourses',
  function ($scope, mvCachedCourses) {

    $scope.courses = mvCachedCourses.query();
    
  }
]);
