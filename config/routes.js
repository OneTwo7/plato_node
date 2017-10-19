var auth = require('./auth');
var users = require('./users');

module.exports = function (app) {

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);

  app.post('/api/users', users.createUser);

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
    res.render('main', {
      bootstrappedUser: getUserObject(req)
    });
  });

};

function getUserObject (req) {
  if (req.user) {
    var user = req.user;
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      isAdmin: user.isAdmin
    };
  } else {
    return undefined;
  }
}
