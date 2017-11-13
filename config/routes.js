var router       = require('express').Router();
var auth         = require('./auth');
var userRoutes   = require('./routes/users');
var courseRoutes = require('./routes/courses');
var lessonRoutes = require('./routes/lessons');

router.use('/api/users', userRoutes);

router.use('/api/courses', courseRoutes);

router.use('/api/courses/:id/lessons', lessonRoutes);

router.all('/api/*', function (req, res) {
  res.sendStatus(404);
});

router.get('/partials/*', function (req, res) {
  res.render('partials/' + req.params[0]);
});

router.post('/login', function (req, res, next) {
  auth.authenticate(req, res, next);
});

router.post('/logout', function (req, res) {
  req.logout();
  res.end();
});

router.get('*', function (req, res) {
  res.render('main');
});

module.exports = router;
