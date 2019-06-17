var router       = require('express').Router();
var auth         = require('./auth');
var utility      = require('../app/utilities/miscellaneous');
var userRoutes   = require('./routes/users');
var courseRoutes = require('./routes/courses');
var lessonRoutes = require('./routes/lessons');

router.use('/api/users', userRoutes);

router.use('/api/courses', courseRoutes);

router.use('/api/courses/:id/lessons', lessonRoutes);

router.post('/api/login', function (req, res, next) {
    auth.authenticate(req, res, next);
});

router.post('/api/logout', function (req, res) {
    req.logout();
    res.end();
});

router.all('/api/*', function (req, res) {
    res.sendStatus(404);
});

router.get('/partials/*', function (req, res) {
    res.render('partials/' + req.params[0]);
});

router.get('*', function (req, res) {
    res.render('main', {
        bootstrappedUser: utility.getUserObject(req.user)
    });
});

module.exports = router;
