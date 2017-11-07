var passport = require('passport');

exports.authenticate = function (req, res, next) {
  req.body.email = req.body.email.toLowerCase();
  var auth = passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({ success: false });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.send({ success: true, user: user });
    })
  })
  auth(req, res, next);
};

exports.requiresApiLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403);
    res.send({ reason: 'You are not logged in!' });
  } else {
    next();
  }
};

exports.requiresRole = function (role) {
  return function (req, res, next) {
    var authenticated = req.isAuthenticated();
    if (!authenticated || !~req.user.roles.indexOf(role)) {
      res.status(403);
      if (!authenticated) {
        res.send({ reason: 'You are not logged in!' });
      } else {
        res.send({ reason: 'You don\'t have high enough clearance!' });
      }
    } else {
      next();
    }
  };
};
