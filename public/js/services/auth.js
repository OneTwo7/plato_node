angular.module('app').factory('auth', function ($http, $q, $location, identity, userResource) {
  return {
    authenticateUser: function (email, password) {
      var dfd = $q.defer();
      $http.post('/login', { email: email, password: password }).then(function (res) {
        if (res.data.success) {
          var user = new userResource();
          angular.extend(user, res.data.user);
          identity.currentUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            isAdmin: user.isAdmin
          };
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    logoutUser: function () {
      var dfd = $q.defer();
      $http.post('/logout', { logout: true }).then(function () {
        identity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function (role) {
      if (identity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized').catch(function () {
          $location.path('/');
        });
      }
    },
    createUser: function (newUserData) {
      var newUser = new userResource(newUserData);
      var dfd = $q.defer();
      newUser.$save().then(function () {
        identity.currentUser = newUser;
        dfd.resolve();
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    }
  };
});