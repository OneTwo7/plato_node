var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Course   = mongoose.model('Course');

var lessonSchema = Schema({
  course:  { type: Schema.Types.ObjectId, ref: 'Course' },
  title:   { type: String, require: '{PATH} is required' },
  content: { type: String, require: '{PATH} is required' }
});

var Lesson = mongoose.model('Lesson', lessonSchema);

var sampleLessons = {
  'Ruby on Rails Tutorial': [
    {
      title:   'Creating an application',
      content: 'Open a terminal window and execute a command:\n$ rails new <app name>'
    },
    {
      title:   'Creating a scaffold',
      content: 'Execute a bash command:\n$ rails g scaffold Post title:string content:text'
    },
    {
      title:   'Testing model validations',
      content: 'Modify the test/models/post_test.rb file:\nassert_not @post.valid?'
    },
    {
      title:   'Model validations',
      content: 'Modify the app/models/post.rb file in the following manner:\nvalidates :title, presence: true, length: { in: 3..54 }'
    },
    {
      title:   'Defining root of the application',
      content: 'Open config/routes.rb and enter the line:\nroot \'posts#index\''
    }
  ],
  'Node.js': [
    {
      title:   'First lesson',
      content: 'Something important.'
    },
    {
      title:   'Second lesson',
      content: 'Something interesting, witty and endearing.'
    }
  ],
  'MongoDB': [
    {
      title:   'How to Mongo shell 101',
      content: 'In order to get contents of a record and not just a cursor object, use .toArray() function or .findOne().'
    },
    {
      title:   'Mongoose population',
      content: 'As a general rule, you\'ll be much better off not using mongoose'
    }
  ]
};

exports.createDefaultLessons = function () {
  Lesson.find({}).exec(function (err, collection) {
    if (collection.length === 0) {

      for (var key in sampleLessons) {
        (function (key) {
          Course.findOne({ title: key }).exec(function (err, course) {
            sampleLessons[key].forEach(function (lesson) {
              Lesson.create({
                course:  course._id,
                title:   lesson.title,
                content: lesson.content
              });
            });
          });
        }(key));
      }

    }
  });
};
