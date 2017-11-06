angular.module('app').factory('mvLesson', function ($resource) {
  var LessonResource = $resource('/api/courses/:_id/lessons/:_lesson_id', { _id: '@id' }, {
    get: {
      method: 'GET',
      isArray: true
    },
    getOne: {
      method: 'GET',
      isArray: false,
      params: { _lesson_id: '@lesson_id' }
    },
    update: {
      method: 'PUT',
      isArray: false
    }
  });

  return LessonResource;
});
