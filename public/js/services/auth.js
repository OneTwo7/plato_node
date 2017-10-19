angular.module('app').factory('mvAuth', function ($http, $q, $location, mvIdentity, mvUser) {
  return {
    authenticateUser: function (email, password) {
      var dfd = $q.defer();
      $http.post('/login', { email: email, password: password }).then(function (res) {
        if (res.data.success) {
          var user = new mvUser();
          angular.extend(user, res.data.user);
          mvIdentity.currentUser = user;
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
        mvIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function (role) {
      if (mvIdentity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized').catch(function () {
          $location.path('/');
        });
      }
    },
    authorizeAuthenticatedUserForRoute: function () {
      if (mvIdentity.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized').catch(function () {
          $location.path('/');
        });
      }
    },
    createUser: function (newUserData) {
      var newUser = new mvUser(newUserData);
      var dfd = $q.defer();
      newUser.$save().then(function () {
        mvIdentity.currentUser = newUser;
        dfd.resolve();
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    },
    updateCurrentUser: function (newUserData) {
      var dfd = $q.defer();
      var clone = angular.copy(mvIdentity.currentUser);
      angular.extend(clone, newUserData);
      clone.$update().then(function () {
        mvIdentity.currentUser = clone;
        dfd.resolve();
      }, function (res) {
        dfd.reject(res.data.reason);
      });
      return dfd.promise;
    }
  };
});