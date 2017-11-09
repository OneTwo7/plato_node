angular.module('app').directive('mvLessonsTabItem', function() {
  return function(scope, element, attrs) {
    var $courseControlsLinks = $('#course-controls a');

    $(element).click(function (e) {
      e.preventDefault();
      var $lesson = $(attrs.href);
      if (!$lesson.hasClass('prepared')) {
        var length = scope.lessons.length;
        var content;
        for (var i = 0; i < length; i++) {
          if (scope.lessons[i]._id === attrs.href.slice(6)) {
            content = scope.lessons[i].content;
            break;
          }
        }
        scope.mvLessonContent.venomize($lesson, content);
      }
      $courseControlsLinks.removeClass('active');
      $(this).tab('show');
    });
  };
});
