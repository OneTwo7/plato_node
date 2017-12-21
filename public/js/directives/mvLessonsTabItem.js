angular.module('app').directive('mvLessonsTabItem', [function() {

  function composeLinks (scope) {
    var last = scope.lessonLinkIds.length - 1;
    scope.lessonLinkIds.forEach(function (link, idx) {
      if (idx === 0) {
        scope.lessonLinks[link] = scope.lessonLinkIds[1];
      } else if (idx === last) {
        scope.lessonLinks[link] = scope.lessonLinkIds[idx - 1];
      } else {
        scope.lessonLinks[link] = [
          scope.lessonLinkIds[idx - 1], scope.lessonLinkIds[idx + 1]
        ];
      }
    });
  }

  return function (scope, element, attrs) {
    $(element).click(function (e) {
      e.preventDefault();
      scope.mvLessonContent.showLesson(scope.lessons, attrs.href, $(this));
    });

    scope.lessonLinkIds.push(attrs.href);

    if (!scope.directiveMethods.composeLinks) {
      scope.directiveMethods.composeLinks = composeLinks;
    }

    if (scope.$last) {
      composeLinks(scope);
    }
  };

}]);
