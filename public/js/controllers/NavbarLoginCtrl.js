angular.module('app').controller('NavbarLoginCtrl', [
  '$scope',
  '$location',
  '$timeout',
  'mvIdentity',
  'mvNotifier',
  'mvAuth',
  function ($scope, $location, $timeout, mvIdentity, mvNotifier, mvAuth) {

    $scope.mvIdentity = mvIdentity;
    $scope.signin = function (email, password) {
      mvAuth.authenticateUser(email, password).then(function (success) {
        if (success) {
          mvNotifier.notify('You have logged in successfully!');
        } else {
          mvNotifier.notify('email/password combination is wrong!');
        }
      });
    };
    $scope.signout = function () {
      mvAuth.logoutUser().then(function () {
        $scope.email = "";
        $scope.password = "";
        mvNotifier.notify('You\'ve logged out successfully!');
        $location.path('/');
      })
    }

    /*$('.navbar-nav>li>a').on('click', function(){
      $('.navbar-collapse').collapse('hide');
    });*/

    $timeout(function () {
      var $navbarBrand = $('.navbar-brand');
      var $navbarLinks = $('.navbar-nav .navbar-item a');
      var $dropdownLinks = $('.navbar-nav .dropdown-menu a');
      var $els = $.merge($navbarBrand, $navbarLinks);
      $els = $.merge($els, $dropdownLinks);
      $els.on('click', function () {
        $('.navbar-collapse').collapse('hide');
      })
    });
  }
]);
