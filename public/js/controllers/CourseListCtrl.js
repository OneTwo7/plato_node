angular.module('app').controller('CourseListCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  'mvCachedCourses',
  'mvCourseFactory',
  'mvNotifier',
  'mvIdentity',
  function (
    $scope, $http, $routeParams, mvCachedCourses, mvCourseFactory, mvNotifier,
    mvIdentity
  ) {
  
    $scope.courses = mvCachedCourses.query();

    $scope.sortOptions = [
      { value: 'title', text: 'Sort by Title' },
      { value: 'published', text: 'Sort by Publish Date' }
    ];

    $scope.featuredOptions = [
      { value: '', text: 'All' },
      { value: 'true', text: 'Featured' }
    ];

    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.featuredFilter = $scope.featuredOptions[0].value;

    $scope.mvIdentity = mvIdentity;

    $scope.formData = {};

    $scope.forms = {};

    $scope.buttonText = 'Create';

    $scope.action = create;

    $scope.modalText = 'Are you sure you want to delete this course with all its lessons?';

    $scope.searchText = $routeParams.tag;

    $scope.edit = function (id) {
      var course;
      var length = $scope.courses.length;
      for (var i = 0; i < length; i++) {
        if ($scope.courses[i]._id === id) {
          course = $scope.courses[i];
          break;
        }
      }
      $scope.formData = {
        course_id: id,
        title: course.title,
        tags: course.tags,
        published: !!course.published,
        featured: course.featured
      };
      $scope.buttonText = 'Update';
      $scope.action = update;
      $("html, body").animate({ scrollTop: 0 }, "slow");
    };

    $scope.cancel = function () {
      $scope.formData = {};
      $scope.buttonText = 'Create';
      $scope.action = create;
    }

    $scope.confirm = function (id) {
      $scope.course_id = id;
      $('#delete-modal').modal();
    }

    $scope.delete = function () {
      var id = $scope.course_id;
      mvCourseFactory.delete(id).then(function () {
        mvNotifier.notify('Course removed!');
        var length = $scope.courses.length;
        for (var i = 0; i < length; i++) {
          if (!$scope.courses[i]._id) {
            $scope.courses.splice(i, 1);
            break;
          }
        }
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }

    $scope.hasDuplicates = function (array) {
      return array ? (new Set(array)).size !== array.length : false;
    };

    $scope.all = function () {
      $scope.courses = mvCachedCourses.query();
    };

    $scope.unpublished = function () {
      $http.get('/api/courses/unpublished').then(function (data) {
        $scope.courses = data.data;
      });
    };

    function create () {
      var courseData = {
        title: $scope.formData.title,
        tags:  $scope.formData.tags
      }

      mvCourseFactory.create(courseData).then(function (course) {
        $('form[name="courseForm"')[0].reset();
        mvNotifier.notify('Course created!');
        $scope.courses.push(course);
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }

    function update () {
      var courseData = {
        course_id: $scope.formData.course_id,
        title:     $scope.formData.title,
        tags:      $scope.formData.tags
      }

      if ($scope.formData.featured) {
        courseData.featured = true;
      } else {
        courseData.featured = false;
      }

      if ($scope.formData.published) {
        courseData.published = new Date();
      } else {
        courseData.published = null;
      }

      mvCourseFactory.update(courseData).then(function (course) {
        $scope.cancel();
        var length = $scope.courses.length;
        for (var i = 0; i < length; i++) {
          if ($scope.courses[i]._id === course._id) {
            $scope.courses[i] = course;
            break;
          }
        }
        mvNotifier.notify('Course updated!');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }
    
  }
]);
