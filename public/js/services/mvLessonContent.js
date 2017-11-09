angular.module('app').factory('mvLessonContent', function () {
  function sanitizeInput (str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function venomizeInput (str) {
    return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }

  function recSanitize ($obj) {
    $obj.get(0).childNodes.forEach(function (item) {
      if (item.nodeType === 3 && item.nodeValue.trim().length !== 0) {
        item.nodeValue = sanitizeInput(item.nodeValue);
      } else {
        recSanitize($(item));
      }
    });
  }

  function recVenomize ($obj) {
    $obj.get(0).childNodes.forEach(function (item) {
      if (item.nodeType === 3 && item.nodeValue.trim().length !== 0) {
        item.nodeValue = venomizeInput(item.nodeValue);
      } else {
        recVenomize($(item));
      }
    });
  }

  return {
    venomize: function ($lesson, html) {
      var $content = $lesson.find('.lesson-content').eq(0);
      $content.html(html);
      recVenomize($content);
      $lesson.addClass('prepared');
      PR.prettyPrint();
    },
    recSanitize: function ($obj) {
      recSanitize($obj);
    },
    recVenomize: function ($obj) {
      recVenomize($obj);
    }
  };
});
