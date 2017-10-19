var express = require('express');

var env = process.env.NODE_ENV || 'development';

var app = express();

app.locals.basedir = __dirname + '/public';

var config = require('./config/config')[env];

require('./config/express')(app, config);

require('./config/mongoose')(config);

require('./config/passport')();

require('./config/routes')(app);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
