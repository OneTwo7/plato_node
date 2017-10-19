angular.module('app').factory('userResource', function ($resource) {
  var UserResource = $resource('/api/users:id', { _id: '@id' });

  UserResource.prototype.isAdmin = function () {
    return this.roles && ~this.roles.indexOf('admin');
  };

  return UserResource;
});