var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function (app, config) {
    app.set('views', config.rootPath + '/public/views');
    app.set('view engine', 'pug');
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/vendor', express.static(config.rootPath + '/node_modules'));
    app.use(express.static(config.rootPath + '/public'));
};
