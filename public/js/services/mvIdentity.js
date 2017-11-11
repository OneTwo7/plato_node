angular.module('app').factory('mvIdentity', function ($window, $localStorage, mvUser) {
  
  var currentUser;

  if (!!$localStorage.currentUser) {
    currentUser = new mvUser();
    angular.extend(currentUser, $localStorage.currentUser);
  }

  return {
    currentUser: currentUser,
    setUser: function (user) {
      delete user.password;
      delete user.salt
      $localStorage.currentUser = user;
      this.currentUser = user;
    },
    removeUser: function () {
      delete $localStorage.currentUser;
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
