angular.module('app').controller('ProfileCtrl', function ($scope, mvIdentity, mvAuth, mvNotifier) {

  $scope.formName = 'profileForm';
  $scope.header = 'Profile';

  $scope.email = mvIdentity.currentUser.email;
  $scope.firstName = mvIdentity.currentUser.firstName;
  $scope.lastName = mvIdentity.currentUser.lastName;

  $scope.update = function () {
    var newUserData = {
      email: $scope.email,
      firstName: $scope.firstName,
      lastName: $scope.lastName
    };

    if ($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }

    mvAuth.updateCurrentUser(newUserData).then(function () {
      mvNotifier.notify('Your account has been updated!');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

});
