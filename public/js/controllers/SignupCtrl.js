angular.module('app').controller('SignupCtrl', function ($scope, $location, mvAuth, mvNotifier) {

  $scope.signup = function () {
    var newUserData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      email: $scope.email,
      password: $scope.password,
    };

    mvAuth.createUser(newUserData).then(function () {
      mvNotifier.notify('User account created!');
      $location.path('/');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

});
