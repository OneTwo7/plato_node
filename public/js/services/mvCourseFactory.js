angular.module('app').factory('mvCourseFactory', [
  '$q',
  '$routeParams',
  '$timeout',
  'mvCourse',
  'mvCachedCourses',
  function ($q, $routeParams, $timeout, mvCourse, mvCachedCourses) {
  
    function getCourse (course_id) {
      var result;
      var courses = mvCachedCourses.query()
      var length = courses.length;
      for (var i = 0; i < length; i++) {
        if (courses[i]._id === course_id) {
          result = courses[i];
          break;
        }
      }
      return result;
    }

    return {
      create: function (courseData) {
        var newCourse = new mvCourse(courseData);
        var dfd = $q.defer();
        newCourse.$save().then(function (course) {
          dfd.resolve(course);
        }, function (res) {
          dfd.reject(res.data.reason);
        });
        return dfd.promise;
      },
      update: function (courseData) {
        var course_id = courseData.course_id;
        delete courseData.course_id;
        var course = getCourse(course_id);
        var dfd = $q.defer();
        var clone = angular.copy(course);
        angular.extend(clone, courseData);
        clone.$update({ _id: course_id }).then(function (course) {
          dfd.resolve(course);
        }, function (res) {
          dfd.reject(res.data.reason);
        });
        return dfd.promise;
      },
      delete: function (course_id) {
        var course = getCourse(course_id);
        var dfd = $q.defer();
        course.$delete({ _id: course_id }).then(function () {
          dfd.resolve();
        }, function (res) {
          dfd.reject(res.data.reason);
        });
        return dfd.promise;
      }
    };
    
  }
]);
