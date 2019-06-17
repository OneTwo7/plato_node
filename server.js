var express = require('express');

var env = process.env.NODE_ENV || 'development';

var app = express();

app.locals.basedir = __dirname + '/public';

var config = require('./config/config')[env];

require('./config/mongoose')(config);

require('./config/express')(app, config);

require('./config/passport')();

app.use(function (req, res, next) {
    require('./config/routes')(req, res, next);
});

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
