angular.module('app').factory('mvLesson', function ($resource) {
  var LessonResource = $resource('/api/courses/:_id/lessons', { _id: '@id' }, {
    get: {
      method: 'GET',
      isArray: true
    },
    update: {
      method: 'PUT',
      isArray: true
    }
  });

  return LessonResource;
});
