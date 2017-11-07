angular.module('app').factory('mvLesson', function ($resource) {
  var LessonResource = $resource('/api/courses/:_id/lessons/:_lesson_id', { _id: '@id' }, {
    get: {
      method: 'GET',
      isArray: true
    },
    getOne: {
      method: 'GET'
    },
    update: {
      method: 'PUT'
    },
    delete: {
      method: 'DELETE'
    }
  });

  return LessonResource;
});
