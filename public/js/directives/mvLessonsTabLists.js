angular.module('app').directive('mvLessonsTabLists', [function() {

  return function (scope, element, attrs) {
    var $lessonsTabLists = $(element);
    var $lessonsTabListsToggler = $('#lessons-tab-lists-toggler');

    $lessonsTabListsToggler.click(function (e) {
      if ($lessonsTabLists.css('display') === 'block') {
        $lessonsTabLists.css('display', 'none');
      } else {
        $lessonsTabLists.css('display', 'block');
      }
    });

    $lessonsTabLists.click(function (e) {
      if ($lessonsTabListsToggler.css('display') === 'block') {
        $lessonsTabLists.css('display', 'none');
      }
    });

    $(window).resize(function () {
      if ($(window).width() >= 768) {
        $lessonsTabLists.css('display', 'block');
      } else {
        $lessonsTabLists.css('display', 'none');
      }
    });
  };

}]);
