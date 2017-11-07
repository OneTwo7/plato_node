angular.module('app').controller('LessonsCtrl', function ($scope, $routeParams, $q, $timeout, mvLesson, mvCachedCourses, mvLessonFactory, mvNotifier, mvIdentity) {
  
  mvCachedCourses.query().$promise.then(function (collection) {
    collection.forEach(function (course) {
      if (course._id === $routeParams.id) {
        $scope.course = course;
      }
    });
  });

  $scope.mvIdentity = mvIdentity;

  $scope.type = 'new';

  $scope.formData = {};

  $scope.formParams = {
    new: {
      header: 'New Lesson',
      button: 'Create',
      action: function () {
        $scope.create();
      }
    },
    edit: {
      header: 'Edit Lesson',
      button: 'Update',
      action: function () {
        $scope.update();
      }
    }
  };

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

  $scope.edit = function (id) {
    var target;
    $scope.lessons.forEach(function (lesson) {
      if (lesson._id === id) {
        target = lesson;
      }
    });
    $scope.type = 'edit';
    $scope.formData.lesson_id = id;
    $scope.formData.title = target.title;
    $scope.formData.content = target.content;
    $('#list-edit-lesson-list').tab('show');
  };

  $scope.update = function () {
    var lessonData = {
      lesson_id: $scope.formData.lesson_id,
      title:     $scope.formData.title,
      content:   $scope.formData.content
    };

    mvLessonFactory.update(lessonData).then(function (lesson) {
      mvNotifier.notify('Lesson updated!');
      var lesson_id = lesson._id;
      $scope.lessons.forEach(function (item, index) {
        if (item._id === lesson_id) {
          $scope.lessons[index] = lesson;
        }
      });
      $timeout(function () {
        $('#list-edit-lesson-list').removeClass('active');
        $('a[href="#list-' + lesson_id + '"]').tab('show');
      });
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $scope.delete = function () {
    var id = $scope.lesson_id;
    mvLessonFactory.delete(id).then(function () {
      mvNotifier.notify('Lesson removed!');
      $scope.lessons.forEach(function (item, index) {
        if (item._id === id) {
          $scope.lessons.splice(index, 1);
        }
      });
      $timeout(function () {
        showPane();
      });
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  $scope.confirm = function (id) {
    $scope.lesson_id = id;
    $('#delete-modal').modal();
  };

  $scope.cancelEdit = function () {
    $('#list-edit-lesson-list').removeClass('active');
    $('#lessons-tab-list .active').removeClass('active').tab('show');
  };

  $q.race([
    $scope.lessons.$promise
  ]).then(function() { 
    $scope.$broadcast('dataloaded');
  });

  $scope.$on('dataloaded', function () {
    $timeout(function () {
      var $courseControlsLinks = $('#course-controls a');

      showPane();

      $('#list-new-lesson-list').click(function () {
        $scope.$apply(function () {
          $scope.type = 'new';
          $scope.formData = {};
          $('form[name="newLessonForm"]')[0].reset();
        });
      });

      $courseControlsLinks.click(function (e) {
        $('#lessons-tab-list a').removeClass('active');
        e.preventDefault();
        $(this).tab('show');
      });
    });
  });

  function showPane () {
    if ($scope.lessons.length) {
      $('#lessons-tab-list a:first').tab('show');
    } else {
      if (mvIdentity.isAuthenticated() && mvIdentity.currentUser.isAdmin()) {
        $('#list-new-lesson-list').tab('show');
      } else {
        $('#list-course-details-list').tab('show');
      }
    }
  }

});
