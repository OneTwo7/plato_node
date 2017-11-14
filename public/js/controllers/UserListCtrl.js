angular.module('app').controller('UserListCtrl', [
  '$scope',
  'mvUser',
  function ($scope, mvUser) {
    $scope.users = mvUser.query();
  }
]);
