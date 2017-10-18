var express = require('express');
var stylus = require('stylus');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

var app = express();

app.locals.basedir = __dirname + '/public';

function compile (str, path) {
  return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}));
app.use('/styles', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/plato', { useMongoClient: true });
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error...'));
connection.once('open', function () {
  console.log('connected to plato db');
});

mongoose.Promise = global.Promise;
var messageSchema = mongoose.Schema({ message: String });
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function (err, messageDoc) {
  mongoMessage = messageDoc.message;
});

app.get('/partials/:partialPath', function (req, res) {
  res.render('partials/' + req.params.partialPath);
});

app.get('*', function (req, res) {
  res.render('main', {
    mongoMessage: mongoMessage
  });
});

var port = 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');
