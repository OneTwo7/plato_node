angular.module('app').controller('navbarLoginCtrl', function ($scope, $location, mvIdentity, mvNotifier, mvAuth) {
  $scope.mvIdentity = mvIdentity;
  $scope.signin = function (email, password) {
    mvAuth.authenticateUser(email, password).then(function (success) {
      if (success) {
        mvNotifier.notify('You have logged in successfully!');
      } else {
        mvNotifier.notify('email/password combination is wrong!');
      }
    });
  };
  $scope.signout = function () {
    mvAuth.logoutUser().then(function () {
      $scope.email = "";
      $scope.password = "";
      mvNotifier.notify('You\'ve logged out successfully!');
      $location.path('/');
    })
  }
});
