angular.module('app').controller('userListCtrl', function ($scope, mvUser) {
  $scope.users = mvUser.query();
});