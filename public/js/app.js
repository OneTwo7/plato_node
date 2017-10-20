angular.module('app', ['ngResource', 'ngRoute', 'ngStorage']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {
      auth: function (mvAuth) {
        return mvAuth.authorizeCurrentUserForRoute('admin');
      }
    },
    user: {
      auth: function (mvAuth) {
        return mvAuth.authorizeAuthenticatedUserForRoute();
      }
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
    templateUrl: '/partials/account/signup',
    controller: 'SignupCtrl'
  })
  .when('/profile', {
    templateUrl: '/partials/account/profile',
    controller: 'ProfileCtrl',
    resolve: routeRoleChecks.user
  })
  .when('/courses', {
    templateUrl: '/partials/courses/course-list',
    controller: 'CourseListCtrl'
  })
  .when('/courses/:id', {
    templateUrl: '/partials/courses/course-details',
    controller: 'CourseDetailsCtrl'
  });
});
