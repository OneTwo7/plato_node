angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {

    var routeRoleChecks = {
      admin: {
        auth: ['mvAuth', function (mvAuth) {
          return mvAuth.authorizeCurrentUserForRoute('admin');
        }]
      },
      user: {
        auth: ['mvAuth', function (mvAuth) {
          return mvAuth.authorizeAuthenticatedUserForRoute();
        }]
      }
    };

    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
      templateUrl: '/partials/home',
      controller: 'MainCtrl'
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/user-list',
      controller: 'UserListCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/signup', {
      templateUrl: '/partials/account/account-form',
      controller: 'SignupCtrl'
    })
    .when('/profile', {
      templateUrl: '/partials/account/account-form',
      controller: 'ProfileCtrl',
      resolve: routeRoleChecks.user
    })
    .when('/courses', {
      templateUrl: '/partials/courses/course-list',
      controller: 'CourseListCtrl'
    })
    .when('/courses/:id', {
      templateUrl: '/partials/lessons/lessons',
      controller: 'LessonsCtrl'
    });

  }
]);
