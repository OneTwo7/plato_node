angular.module('app').factory('mvIdentity', function ($window, $sessionStorage, mvUser) {
  
  var currentUser;

  if (!!$sessionStorage.currentUser) {
    currentUser = new mvUser();
    angular.extend(currentUser, $sessionStorage.currentUser);
  }

  return {
    currentUser: currentUser,
    setUser: function (user) {
      delete user.password;
      $sessionStorage.currentUser = user;
      this.currentUser = user;
    },
    removeUser: function () {
      delete $sessionStorage.currentUser;
      this.currentUser = undefined;
    },
    isAuthenticated: function () {
      return !!this.currentUser;
    },
    isAuthorized: function (role) {
      return !!this.currentUser && !!~this.currentUser.roles.indexOf(role);
    }
  };

});
