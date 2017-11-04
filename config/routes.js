var auth = require('./auth');
var users = require('../app/controllers/users');
var courses = require('../app/controllers/courses');

module.exports = function (app) {

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);

  app.post('/api/users', users.createUser);

  app.put('/api/users', users.updateUser);

  app.get('/api/courses', courses.getCourses);

  app.get('/api/courses/:id', courses.getCourseById);

  app.get('/api/courses/:id/lessons', courses.getLessonsByCourseId);

  app.all('/api/*', function (req, res) {
    res.sendStatus(404);
  });

  app.get('/partials/*', function (req, res) {
    res.render('partials/' + req.params[0]);
  });

  app.post('/login', function (req, res, next) {
    auth.authenticate(req, res, next);
  });

  app.post('/logout', function (req, res) {
    req.logout();
    res.end();
  });

  app.get('*', function (req, res) {
    res.render('main');
  });

};
