angular.module('app').controller('LessonsCtrl', function ($scope, $routeParams, $q, $timeout, $http, mvLesson, mvCachedCourses, mvLessonFactory, mvNotifier, mvIdentity, mvLessonContent, mvCachedLessons) {
  
  mvCachedCourses.query().$promise.then(function (collection) {
    collection.forEach(function (course) {
      if (course._id === $routeParams.id) {
        $scope.course = course;
      }
    });
  });

  $scope.lessons = mvCachedLessons.query($routeParams.id);

  $scope.mvIdentity = mvIdentity;

  $scope.mvLessonContent = mvLessonContent;

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

  $scope.modalText = 'Are you sure you want to delete this lesson?';

  $scope.create = function () {
    var newLessonData = prepareLessonData();

    if (!newLessonData) {
      return;
    }

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
    var $contentField = $('#content-field');
    $scope.lessons.forEach(function (lesson) {
      if (lesson._id === id) {
        target = lesson;
      }
    });
    $scope.type = 'edit';
    $scope.formData.lesson_id = id;
    $scope.formData.title = target.title;
    $contentField.html(target.content);
    $('#list-edit-lesson-list').tab('show');
  };

  $scope.update = function () {
    var lessonData = prepareLessonData();

    if (!lessonData) {
      return;
    }

    lessonData.lesson_id = $scope.formData.lesson_id;

    mvLessonFactory.update(lessonData).then(function (lesson) {
      mvNotifier.notify('Lesson updated!');
      var lesson_id = lesson._id;
      $scope.lessons.forEach(function (item, index) {
        if (item._id === lesson_id) {
          $scope.lessons[index] = lesson;
        }
      });
      $timeout(function () {
        var $lesson = $('#list-' + lesson_id);
        var content = lesson.content;
        mvLessonContent.insertContent($lesson, content);
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
      var length = $scope.lessons.length;
      for (var i = 0; i < length; i++) {
        if (!$scope.lessons[i]._id) {
          $scope.lessons.splice(i, 1);
        }
      }
      $timeout(function () {
        mvLessonContent.showPane($scope.lessons);
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

  $scope.getPartial = function () {
    $http.get('/partials/scripts').then(function (data) {
      console.log(data.data);
    });
  };

  /*
   * Load Lessons
   */

  $q.race([
    $scope.lessons.$promise
  ]).then(function() { 
    $scope.$broadcast('dataloaded');
  });

  /*
   * prepare View
   */

  $scope.$on('dataloaded', function () {
    $timeout(function () {
      mvLessonContent.prepareView($scope);
    });
  });

  /*
   * Prepare content before saving it to db
   */

  function prepareLessonData () {
    if ($('#content-field').text().length === 0) {
      mvNotifier.error('Content shouldn\'t be empty!');
      return;
    }

    var $contentField = $('#content-field');

    var lessonData = {
      course:  $scope.course._id,
      title:   $scope.formData.title,
      content: $contentField.html()
    };

    $contentField.html('<div></div>');

    return lessonData;
  }

});
