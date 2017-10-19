angular.module('app').controller('userListCtrl', function ($scope, userResource) {
  $scope.users = userResource.query();
});