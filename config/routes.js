var auth         = require('./auth');
var userRoutes   = require('./routes/users');
var courseRoutes = require('./routes/courses');
var lessonRoutes = require('./routes/lessons');

module.exports = function (app) {

  app.use('/api/users', userRoutes);

  app.use('/api/courses', courseRoutes);

  app.use('/api/courses/:id/lessons', lessonRoutes);

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
