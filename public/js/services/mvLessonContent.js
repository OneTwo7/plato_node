angular.module('app').factory('mvLessonContent', [
  'mvIdentity',
  'mvNotifier',
  function (mvIdentity, mvNotifier) {

    function insertContent ($lesson, html) {
      var $content = $lesson.find('.lesson-content').eq(0);
      html = html.replace(/<\/div><div>/g, '\n');
      $content.html(html);
      $lesson.addClass('prepared');
      PR.prettyPrint();
    }

    function showPane (lessons) {
      if (lessons.length) {
        var $lesson = $('.lesson:first');
        var content = lessons[0].content;
        insertContent($lesson, content);
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
      if (sel === null) {
        return;
      }
      if (el === 'ol' || el === 'ul') {
        element = '<' + el + '><li>' + sel + '</li></' + el + '>';
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
      insertContent: function ($lesson, html) {
        insertContent($lesson, html);
      },
      showPane: function (lessons) {
        showPane(lessons);
      },
      showLesson: function (lessons, href, $tab) {
        var $lesson = $(href);
        if (!$lesson.hasClass('prepared')) {
          var length = lessons.length;
          var content;
          for (var i = 0; i < length; i++) {
            if (lessons[i]._id === href.slice(6)) {
              content = lessons[i].content;
              break;
            }
          }
          insertContent($lesson, content);
        }
        $('#course-controls a').removeClass('active');
        if ($(window).width() >= 768) {
          $('html').animate({ scrollTop: 0 }, 'slow');
        }
        $tab.tab('show');
      },
      prepareView: function ($scope) {
        var $courseControlsLinks = $('#course-controls a');
        var $contentField = $('#content-field');
        var $lessonTabLists = $('#lesson-tab-lists');

        showPane($scope.lessons);

        $('#list-new-lesson-list').click(function () {
          $scope.$apply(function () {
            $scope.type = 'new';
            $scope.formData = {};
            $scope.lessonForm.$setPristine();
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
              $('.code-field').children('br').replaceWith('<div></div>');
              $('.bash-field').children('br').replaceWith('<div></div>');
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
          // handle backspace
          if (e.keyCode === 8) {
            if (sel.anchorOffset === 0) {
              if ($div.text().length !== 0 && $div.is('div:first-child')) {
                e.preventDefault();
              }
            }
            return;
          }
          // handle tab
          if (e.keyCode === 9) {
            document.execCommand('insertHTML', false, '\t');
            e.preventDefault();
            return;
          }
          // handle enter
          var text = $div.text();
          var offset = sel.anchorOffset;
          var newLineText;
          var newLineOffset;
          if ($field.hasClass('code-field')) {
            if (text.length >= 1 && text.slice(0, 1) === '\t') {
              var tabs = 1;
              while (text.slice(tabs, tabs + 1) === '\t') {
                tabs++;
              }
              var $newDiv = $('<div></div>');
              if (offset < tabs) {
                tabs = offset;
              }
              newLineText = new Array(tabs + 1).join('\t');
              if (text.length !== offset) {
                $div.text($div.text().slice(0, offset));
                newLineText += text.slice(offset);
              }
              newLineOffset = tabs;
            } else {
              return;
            }
          } else {
            var idx = text.indexOf('$ ');
            if (~idx && text.length === offset) {
              newLineText = text.slice(0, idx + 2);
              newLineOffset = newLineText.length;
            } else {
              return;
            }
          }
          // new line
          var $newDiv = $('<div></div>');
          $newDiv.text(newLineText);
          $div.after($newDiv);
          var range = document.createRange();
          range.setStart($newDiv.get(0).childNodes[0], newLineOffset);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          e.preventDefault();
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

  }
]);
