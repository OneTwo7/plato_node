angular.module('app').directive('mvLessonsTabItem', function() {
  return function(scope, element, attrs) {
    var $courseControlsLinks = $('#course-controls a');

    $(element).click(function (e) {
      e.preventDefault();
      $courseControlsLinks.removeClass('active');
      $(this).tab('show');
    });
  };
});
