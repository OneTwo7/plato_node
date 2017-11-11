angular.module('app').factory('mvCachedLessons', function (mvLesson) {
  var lessonList;

  return {
    query: function (id) {
      if (!lessonList) {
        lessonList = mvLesson.get({ _id: id });
      }
      return lessonList;
    }
  };
});
