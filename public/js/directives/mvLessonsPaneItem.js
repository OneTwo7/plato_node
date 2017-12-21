angular.module('app').directive('mvLessonsPaneItem', [function() {

  function establishLinks (scope, $el, first, last, href) {
    var $prev = $el.find('.previous-lesson-btn');
    var $next = $el.find('.next-lesson-btn');
    var prevTab;
    var nextTab;

    $prev.off();
    $next.off();

    if (first) {
      $prev.addClass('disabled').prop('disabled', true).attr('tabindex', '-1');
      nextTab = scope.lessonLinks[href];
    } else {
      nextTab = scope.lessonLinks[href][1];
    }

    if (last) {
      $next.addClass('disabled').prop('disabled', true).attr('tabindex', '-1');
      prevTab = scope.lessonLinks[href];
    } else {
      prevTab = scope.lessonLinks[href][0];
    }

    if (!first) {
      $prev.click(function () {
        var $tab = $('a[href="' + prevTab + '"]');
        scope.mvLessonContent.showLesson(scope.lessons, prevTab, $tab);
      });
    }

    if (!last) {
      if ($next.hasClass('disabled')) {
        $next.removeClass('disabled').prop('disabled', false)
        .removeAttr('tabindex');
      }
      $next.click(function () {
        var $tab = $('a[href="' + nextTab + '"]');
        scope.mvLessonContent.showLesson(scope.lessons, nextTab, $tab);
      });
    }
  }

  return function(scope, element, attrs) {
    if (!scope.directiveMethods.establishLinks) {
      scope.directiveMethods.establishLinks = establishLinks;
    }
    establishLinks(scope, $(element), scope.$first, scope.$last, '#' + attrs.id);
  };

}]);
