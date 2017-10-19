angular.module('app').controller('navbarLoginCtrl', function ($scope, $location, identity, notifier, auth) {
  $scope.identity = identity;
  $scope.signin = function (email, password) {
    auth.authenticateUser(email, password).then(function (success) {
      if (success) {
        notifier.notify('You have logged in successfully!');
      } else {
        notifier.notify('email/password combination is wrong!');
      }
    });
  };
  $scope.signout = function () {
    auth.logoutUser().then(function () {
      $scope.email = "";
      $scope.password = "";
      notifier.notify('You\'ve logged out successfully!');
      $location.path('/');
    })
  }
});
