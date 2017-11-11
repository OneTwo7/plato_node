angular.module('app').factory('mvLessonContent', function (mvIdentity) {

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

  function venomize ($lesson, html) {
    var $content = $lesson.find('.lesson-content').eq(0);
    $content.html(html);
    //recVenomize($content);
    $lesson.addClass('prepared');
    PR.prettyPrint();
  }

  function showPane ($scope) {
    if ($scope.lessons.length) {
      var $lesson = $('.lesson:first');
      var content = $scope.lessons[0].content;
      venomize($lesson, content);
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

  return {
    venomize: function ($lesson, html) {
      venomize($lesson, html);
    },
    recSanitize: function ($obj) {
      recSanitize($obj);
    },
    recVenomize: function ($obj) {
      recVenomize($obj);
    },
    prepareView: function ($scope) {
      var $courseControlsLinks = $('#course-controls a');
      var $contentField = $('#content-field');

      showPane($scope);

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
        if (!(e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13)) {
          return;
        }
        var sel = window.getSelection();
        if (sel.toString().length !== 0) {
          return;
        }
        var $div = $(sel.anchorNode);
        while (!$div.is('div')) {
          $div = $div.parent();
        }
        var $field = $div.parent();
        if (!$field.hasClass('code-field') && !$field.hasClass('bash-field')) {
          return;
        }
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
            var offset = sel.anchorOffset;
            var tabs = 1;
            while (text.slice(tabs, tabs + 1) === '\t') {
              tabs++;
            }
            if (text.length !== offset && offset > tabs) {
              return;
            }
            var $newDiv = $('<div></div>');
            if (offset <= tabs) {
              tabs = offset;
            }
            $newDiv.text(new Array(tabs + 1).join('\t'));
            $div.after($newDiv);
            if (text.length !== offset) {
              $div.text($div.text().slice(0, tabs));
              $newDiv.text($newDiv.text() + text.slice(tabs));
            }
            var range = document.createRange();
            range.setStart($newDiv.get(0).childNodes[0], tabs);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            e.preventDefault();
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
    }
  };

});
