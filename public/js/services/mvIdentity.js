angular.module('app').factory('mvIdentity', [
  '$http',
  'mvUser',
  function ($http, mvUser) {

    var currentUser;
    var bootstrappedUser;
    var userDiv = document.getElementById('bootstrapped-user-div');

    if (userDiv) {
      bootstrappedUser = JSON.parse(userDiv.innerHTML);
      currentUser = new mvUser();
      angular.extend(currentUser, bootstrappedUser);
    }

    return {
      currentUser: currentUser,
      setUser: function (user) {
        delete user.password;
        delete user.salt
        this.currentUser = user;
      },
      removeUser: function () {
        this.currentUser = undefined;
      },
      isAuthenticated: function () {
        return !!this.currentUser;
      },
      isAuthorized: function (role) {
        return !!this.currentUser && !!~this.currentUser.roles.indexOf(role);
      }
    };

  }
]);
