angular.module('app').controller('LessonsCtrl', [
  '$scope',
  '$routeParams',
  '$q',
  '$timeout',
  '$http',
  'mvCachedCourses',
  'mvLessonFactory',
  'mvNotifier',
  'mvIdentity',
  'mvLessonContent',
  'mvCachedLessons',
  function (
    $scope, $routeParams, $q, $timeout, $http, mvCachedCourses,
    mvLessonFactory, mvNotifier, mvIdentity, mvLessonContent, mvCachedLessons
  ) {

    mvCachedCourses.query().$promise.then(function (collection) {
      collection.forEach(function (course) {
        if (course._id === $routeParams.id) {
          $scope.course = course;
        }
      });
      if (!$scope.course) {
        $http.get('/api/courses/' + $routeParams.id).then(function (data) {
          $scope.course = data.data;
          console.log($scope.course);
        });
      }
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

    $scope.directiveMethods = {};

    $scope.lessonLinkIds = [];

    $scope.lessonLinks = {};

    $scope.create = function () {
      var newLessonData = prepareLessonData();

      if (!newLessonData) {
        return;
      }

      mvLessonFactory.create(newLessonData).then(function (lesson) {
        mvNotifier.notify('Lesson created!');
        $scope.formData = {};
        $scope.lessonForm.$setPristine();
        $scope.lessons.push(lesson);
        // Add next link to previous lesson pane
        if ($scope.lessons.length > 1) {
          $timeout(function () {
            var idx = $scope.lessonLinkIds.length - 2;
            var href = $scope.lessonLinkIds[idx];
            $scope.directiveMethods.establishLinks(
              $scope, $(href), idx === 0, false, href
            );
          });
        }
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
        var idx;
        for (var i = 0; i < length; i++) {
          if (!$scope.lessons[i]._id) {
            $scope.lessons.splice(i, 1);
            idx = i;
            break;
          }
        }
        $timeout(function () {
          // Handle changes to lesson's previous/next buttons
          length--;
          if (length) {
            var prevHref, nextHref;
            $scope.lessonLinkIds.splice(idx, 1);
            $scope.directiveMethods.composeLinks($scope);
            if (idx === 0) {
              nextHref = $scope.lessonLinkIds[0];
              $scope.directiveMethods.establishLinks(
                $scope, $(nextHref), true, idx + 1 === length, nextHref
              );
            } else if (idx === length) {
              prevHref = $scope.lessonLinkIds[idx - 1];
              $scope.directiveMethods.establishLinks(
                $scope, $(prevHref), false, true, prevHref
              );
            } else {
              prevHref = $scope.lessonLinkIds[idx - 1];
              nextHref = $scope.lessonLinkIds[idx];
              $scope.directiveMethods.establishLinks(
                $scope, $(prevHref), idx - 1 === 0, false, prevHref
              );
              $scope.directiveMethods.establishLinks(
                $scope, $(nextHref), false, idx + 1 === length, nextHref
              );
            }
          }
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

  }
]);
