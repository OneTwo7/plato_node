angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: '/partials/base',
    controller: 'baseController'
  });
});

angular.module('app').controller('baseController', function ($scope) {
  $scope.myVar = 'Hello Angular';
});
