angular.module('app').controller('LessonsCtrl', function ($scope, $routeParams, $q, $timeout, $http, mvLesson, mvCachedCourses, mvLessonFactory, mvNotifier, mvIdentity, mvLessonContent) {
  
  mvCachedCourses.query().$promise.then(function (collection) {
    collection.forEach(function (course) {
      if (course._id === $routeParams.id) {
        $scope.course = course;
      }
    });
  });

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

  $scope.lessons = mvLesson.get({ _id: $routeParams.id });

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
    mvLessonContent.recVenomize($contentField);
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
        mvLessonContent.venomize($lesson, content);
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
      $scope.lessons.forEach(function (item, index) {
        if (item._id === id) {
          $scope.lessons.splice(index, 1);
        }
      });
      $timeout(function () {
        showPane();
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
      var $courseControlsLinks = $('#course-controls a');
      var $contentField = $('#content-field');

      showPane();

      $('#list-new-lesson-list').click(function () {
        $scope.$apply(function () {
          $scope.type = 'new';
          $scope.formData = {};
          $('form[name="newLessonForm"]')[0].reset();
          $contentField.html('<div></div>');
        });
      });

      $courseControlsLinks.click(function (e) {
        if ($(this).attr('href') === '/courses') {
          return;
        }
        $('#lessons-tab-list a').removeClass('active');
        e.preventDefault();
        $(this).tab('show');
      });

      /*
       * Override default keyboard buttons behaviour
       */

      $('#content-field').on('paste', function (e) {
        e.preventDefault();
        var data = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, data);
        var $el = $(document.getSelection().anchorNode).parent();
        if ($el.is('pre')) {
          $el.html('<div>' + $el.html() + '</div>');
        }
      });

      $(document).on('keydown', function (e) {
        if (e.keyCode === 13 && $('#link-modal').hasClass('show')) {
          $('.modal').modal('hide');
          makeLink();
        }
      });

      $contentField.on('keyup', function (e) {
        if (e.keyCode === 8 || e.keyCode === 13 || e.keyCode === 46) {
          var $this = $(this);
          if ($this.find('br').length) {
            $this.children('br').replaceWith('<div></div>');
            if (e.keyCode === 13 || e.keyCode === 46) {
              $('.code-field').children('br').replaceWith('<div></div>');
              $('.bash-field').children('br').replaceWith('<div></div>');
            }
          }
          if (e.keyCode === 8 && $this.text().length === 0) {
            $this.html('<div></div>');
          }
        }
      });

      $contentField.on('keydown', function (e) {
        if (e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13) {
          var sel = window.getSelection();
          if (sel.toString().length === 0) {
            var $div = $(sel.anchorNode);
            while (!$div.is('div')) {
              $div = $div.parent();
            }
            var $field = $div.parent();
            if ($field.hasClass('code-field') || $field.hasClass('bash-field')) {
              if (e.keyCode === 8 && sel.anchorOffset === 0) {
                if ($div.text().length !== 0 && $div.is('div:first-child')) {
                  e.preventDefault();
                }
              }
              if (e.keyCode === 9) {
                document.execCommand('insertHTML', false, '\t');
                e.preventDefault();
              }
              if (e.keyCode === 13 && $field.hasClass('code-field')) {
                var text = $div.text();
                if (text.length >= 1 && text.slice(0, 1) === '\t') {
                  var $newDiv = $('<div></div>');
                  var tabs = 1;
                  while (text.slice(tabs, tabs + 1) === '\t') {
                    tabs++;
                  }
                  $newDiv.text(new Array(tabs + 1).join('\t'));
                  $div.after($newDiv);
                  var range = document.createRange();
                  range.setStart($newDiv.get(0).childNodes[0], tabs);
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  e.preventDefault();
                }
              }
            }
          }
        }
      });

      /*
       * Event listeners for content field buttons
       */

      $('#title-btn').click(function () {
        addElement('h3');
      });

      $('#ol-btn').click(function () {
        addElement('ol');
      });

      $('#ul-btn').click(function () {
        addElement('ul');
      });

      $('#bold-btn').click(function () {
        addElement('strong');
      });

      $('#cursive-btn').click(function () {
        addElement('em');
      });

      $('#link-btn').click(function () {
        var sel = getSelectedText();
        if (sel) {
          insertElement('<span id="link-target">' + sel + '</span>');
          $('#link-modal').modal();
        }
        if (sel === '') {
          emptySelectionError();
        }
      });

      $('#create-link-btn').click(function () {
        makeLink();
      });

      $('#link-modal').on('hidden.bs.modal', function () {
        var $target = $('#link-target');
        if ($target.length) {
          $target.replaceWith($target.text());
        }
      });

      $('#link-modal').on('shown.bs.modal', function () {
        $('#link-name').focus();
      });

      $('#text-btn').click(function () {
        $contentField.append('<div></div>');
      });

      $('#code-btn').click(function () {
        $contentField.append('<pre class="code-field prettyprint" autocorrect="off" autocapitalize="off" spellcheck="false"><div></div></pre>');
      });

      $('#bash-btn').click(function () {
        $contentField.append('<pre class="bash-field" autocorrect="off" autocapitalize="off" spellcheck="false"><div></div></pre>');
      });

      $('#clear-btn').click(function () {
        $contentField.html('<div></div>');
      });
    });
  });

  function showPane () {
    if ($scope.lessons.length) {
      var $lesson = $('.lesson:first');
      var content = $scope.lessons[0].content;
      mvLessonContent.venomize($lesson, content);
      $('#lessons-tab-list a:first').tab('show');
    } else {
      if (mvIdentity.isAuthenticated() && mvIdentity.currentUser.isAdmin()) {
        $('#list-new-lesson-list').tab('show');
      } else {
        $('#list-course-details-list').tab('show');
      }
    }
  }

  /*
   * Helpers for lesson content input
   */

  function addElement (el) {
    var element = '';
    var sel = getSelectedText();
    if (el === 'ol' || el === 'ul') {
      if (sel !== null) {
        element = '<' + el + '><li></li></' + el + '>';
      }
    } else {
      if (sel) {
        element = '<' + el + '>' + sel + '</' + el + '>';
      } else {
        emptySelectionError();
      }
    }
    if (element) {
      insertElement(element);
    }
  }

  function makeLink () {
    var $name = $('#link-name');
    var $target = $('#link-target');
    var name = $name.val();
    $name.val('');
    if (name.length < 3) {
      mvNotifier.error('Invalid URL!');
      return;
    }
    var link = $('#link-protocol').val() + name;
    var element = '<a href="' + link + '">' + $target.text() + '</a>';
    $target.replaceWith(element);
  }

  function getSelectedText () {
    var selection = window.getSelection();
    var anchor = selection.anchorNode;
    if (anchor) {
      var $wrapper = anchor.nodeType === 3 ? $(anchor).parent() : $(anchor);
      if (isTextField($wrapper)) {
        return selection.toString();
      }
    }
    mvNotifier.error('Wrong selection!');
    return null;
  }

  function isTextField ($wrapper) {
    while ($wrapper.is('div')) {
      if ($wrapper.attr('id') === 'content-field') {
        return true;
      }
      $wrapper = $wrapper.parent();
    }
    return false;
  }

  function emptySelectionError () {
    mvNotifier.error('Select text to modify!');
  }

  function insertElement (element) {
    document.execCommand('insertHTML', false, element);
  }

  /*
   * Prepare content before saving it to db
   */

  function prepareLessonData () {
    if ($('#content-field').text().length === 0) {
      mvNotifier.error('Content shouldn\'t be empty!');
      return;
    }

    var $contentField = $('#content-field');
    mvLessonContent.recSanitize($contentField);

    var lessonData = {
      course:  $scope.course._id,
      title:   $scope.formData.title,
      content: $contentField.html()
    };

    $contentField.html('<div></div>');

    return lessonData;
  }

});
