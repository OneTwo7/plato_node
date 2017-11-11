var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courseSchema = Schema({
  title: { type: String, require: '{PATH} is required' },
  published: { type: Date },
  featured: { type: Boolean, default: false },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  tags: [String]
});

var Course = mongoose.model('Course', courseSchema);

var sampleCourses = [
  { title: 'Ruby on Rails Tutorial', published: new Date(2017, 9, 10), featured: true, tags: ['Ruby on Rails'] },
  { title: 'Rails Caching', published: new Date(2017, 9, 11), featured: true, tags: ['Ruby on Rails'] },
  { title: 'Rails with AngularJS', published: new Date(2017, 9, 11), featured: true, tags: ['Ruby on Rails', 'AngularJS'] },
  { title: 'Node.js', published: new Date(2017, 9, 11), featured: true, tags: ['JavaScript', 'Node.js'] },
  { title: 'MEAN Stack', published: new Date(2017, 9, 12), featured: true, tags: ['JavaScript', 'MongoDB', 'Express.js', 'AngularJS', 'Node.js'] },
  { title: 'AngularJS', published: new Date(2017, 9, 12), featured: true, tags: ['JavaScript', 'AngularJS'] },
  { title: 'MongoDB', published: new Date(2017, 9, 13), featured: true, tags: ['JavaScript', 'MongoDB'] },
  { title: 'React.js', published: new Date(2017, 9, 13), featured: false, tags: ['JavaScript', 'React.js'] },
  { title: 'Vue.js', published: new Date(2017, 9, 13), featured: false, tags: ['JavaScript', 'Vue.js'] },
  { title: 'EcmaScript 6', published: new Date(2017, 9, 13), featured: true, tags: ['JavaScript'] },
  { title: 'SCSS', published: new Date(2017, 9, 15), featured: true, tags: ['scss'] },
  { title: 'Bootstrap', published: new Date(2017, 9, 15), featured: true, tags: ['JavaScript', 'scss', 'Bootstrap'] },
  { title: 'AngularJS Advanced Topics', published: new Date(2017, 9, 15), featured: true, tags: ['AngularJS'] },
  { title: 'CoffeeScript', published: new Date(2017, 9, 16), featured: true, tags: ['CoffeeScript'] },
  { title: 'TypeScript', published: new Date(2017, 9, 16), featured: false, tags: ['TypeScript'] },
  { title: 'AngularJS 2', published: new Date(2017, 9, 17), featured: false, tags: ['JavaScript', 'AngularJS'] },
  { title: 'AngularJS 4', published: new Date(2017, 9, 17), featured: false, tags: ['JavaScript', 'AngularJS'] },
  { title: 'WebPack', published: new Date(2017, 9, 17), featured: true, tags: ['WebPack'] },
  { title: 'Yarn', published: new Date(2017, 9, 17), featured: true, tags: ['Yarn'] },
  { title: 'Go', published: new Date(2017, 9, 17), featured: false, tags: ['Go'] }
];

exports.createDefaultCourses = function () {
  Course.find({}).exec(function (err, collection) {
    if (collection.length === 0) {
      sampleCourses.forEach(function (course) {
        Course.create(course);
      });
    }
  });
};
