angular.module('app').factory('mvCachedLessons', [
  'mvLesson',
  function (mvLesson) {

    var courseId;
    var lessonList;

    return {
      query: function (id) {
        if (!lessonList || courseId !== id) {
          courseId = id;
          lessonList = mvLesson.get({ _id: id });
        }
        return lessonList;
      }
    };
    
  }
]);
