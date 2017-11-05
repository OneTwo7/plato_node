angular.module('app').controller('LessonsCtrl', function ($scope, $routeParams, $q, $timeout, mvLesson, mvCachedCourses, mvLessonFactory, mvNotifier) {
  
  mvCachedCourses.query().$promise.then(function (collection) {
    collection.forEach(function (course) {
      if (course._id === $routeParams.id) {
        $scope.course = course;
      }
    });
  });

  $scope.formData = {};

  $scope.lessons = mvLesson.get({ _id: $routeParams.id });

  $scope.create = function () {
    var newLessonData = {
      course:  $scope.course._id,
      title:   $scope.formData.title,
      content: $scope.formData.content
    };

    mvLessonFactory.create(newLessonData).then(function (lesson) {
      $('form[name="newLessonForm"')[0].reset();
      mvNotifier.notify('Lesson created!');
      $scope.lessons.push(lesson);
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $q.race([
    $scope.lessons.$promise
  ]).then(function() { 
    $scope.$broadcast('dataloaded');
  });

  $scope.$on('dataloaded', function () {
    $timeout(function () {
      var $courseControlsLinks = $('#course-controls a');
      var $lessonsTabListLinks = $('#lessons-tab-list a');

      if ($scope.lessons.length) {
        $lessonsTabListLinks.eq(0).addClass('active');
        $('.lesson').eq(0).addClass('active show');
      } else {
        $courseControlsLinks.eq(0).addClass('active');
        $('#new-lesson-tab').addClass('active show');
      }

      $courseControlsLinks.click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      });

      $courseControlsLinks.click(function () {
        $lessonsTabListLinks.removeClass('active');
      });
    });
  });

});
