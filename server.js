var express = require('express');

var env = process.env.NODE_ENV || 'development';

var app = express();

app.locals.basedir = __dirname + '/public';

var config = require('./config/config')[env];

if (env === 'development') {
  var chokidar = require('chokidar');
  var watcher = chokidar.watch(['./app', './config']);

  watcher.on('ready', function () {
    watcher.on('all', function () {
      console.log('Clearing /dist/ module cache from server');
      Object.keys(require.cache).forEach(function (id) {
        if (/[\/\\]app[\/\\]/.test(id)) {
          delete require.cache[id]
        }
        if (/[\/\\]config[\/\\]/.test(id)) {
          delete require.cache[id]
        }
      });
    });
  });
}

require('./config/mongoose')(config);

require('./config/express')(app, config);

require('./config/passport')();

app.use(function (req, res, next) {
  require('./config/routes')(req, res, next);
});

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
