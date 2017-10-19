angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {
      auth: function (auth) {
        return auth.authorizeCurrentUserForRoute('admin');
      }
    }
  };

  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: '/partials/courses/courses',
    controller: 'mainCtrl'
  })
  .when('/admin/users', {
    templateUrl: '/partials/admin/user-list',
    controller: 'userListCtrl',
    resolve: routeRoleChecks.admin
  });
});
