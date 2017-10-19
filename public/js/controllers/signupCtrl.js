angular.module('app').controller('signupCtrl', function ($scope, $location, auth, notifier) {

  $scope.signup = function () {
    var newUserData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      email: $scope.email,
      password: $scope.password,
    };

    auth.createUser(newUserData).then(function () {
      notifier.notify('User account created!');
      $location.path('/');
    }, function (reason) {
      notifier.error(reason);
    });
  };

});
