angular.module('app').directive('mvLessonsPaneItem', [function() {

  return function(scope, element, attrs) {
    var $prev = $(element).find('.previous-lesson-btn');
    var $next = $(element).find('.next-lesson-btn');
    var prevTab;
    var nextTab;

    if (scope.$first) {
      $prev.addClass('disabled').prop('disabled', true).attr('tabindex', '-1');
      nextTab = scope.lessonLinks['#' + attrs.id];
    } else {
      nextTab = scope.lessonLinks['#' + attrs.id][1];
    }

    if (scope.$last) {
      $next.addClass('disabled').prop('disabled', true).attr('tabindex', '-1');
      prevTab = scope.lessonLinks['#' + attrs.id];
    } else {
      prevTab = scope.lessonLinks['#' + attrs.id][0];
    }

    if (!scope.$first) {
      $prev.click(function () {
        var $tab = $('a[href="' + prevTab + '"]');
        scope.mvLessonContent.showLesson(scope.lessons, prevTab, $tab);
      });
    }

    if (!scope.$last) {
      $next.click(function () {
        var $tab = $('a[href="' + nextTab + '"]');
        scope.mvLessonContent.showLesson(scope.lessons, nextTab, $tab);
      });
    }
  };

}]);
