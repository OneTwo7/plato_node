angular.module('app').directive('mvPasswordConfirmation', [function () {
  return {
    require: 'ngModel',
    scope: {
      passwordValue: '=mvPasswordConfirmation'
    },
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.mvPasswordConfirmation = function (modelValue) {
          return scope.passwordValue && scope.passwordValue.length === 0 || modelValue === scope.passwordValue;
      };

      scope.$watch('passwordValue', function () {
          ngModel.$validate();
      });

    }
  };
}]);
