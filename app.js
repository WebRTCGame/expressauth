'use strict';

/**
 * Module dependencies.
 */
console.log("loading vars");
var express = require('express');
var routes = require('./routes');
var admin = require('./routes/admin');
var auth = require('./auth/routes');
var users = require('./users/routes');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var config = require('./config');
var expressValidator = require('express-validator');

var ensureAdmin = require('./auth/middlewares').ensureAuthenticated;

var app = exports.app = express();


app.configure(function() {
    console.log("app.configure");
    console.log("///////////////" + app.settings.env);
    app.set('port', process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    // set the 'dbUrl' to the mongodb url that corresponds to the
    // environment we are in
    app.set('dbUrl', config.db[app.settings.env]);
    // connect mongoose to the mongo dbUrl
    mongoose.connect(app.get('dbUrl'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    // add the express-validator middleware. 
    // Important: This must come before the app.router middleware
    app.use(expressValidator);
    // Add passwport support
    // Important: This must come before the app.router middleware
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.resolve(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

console.log("get post routes");
app.get('/', routes.index);
app.post('/signup', users.signup);
app.post('/auth/local', auth.local);
app.get('/admin', ensureAdmin, admin.index);
app.post('/password_rest', users.paswordRest);
app.get('/password_rest/:token', users.paswordTokenCheck);

app.get('/add/:first/:second', function(req, res) {
    // convert the two values to floats and add them together
    var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
    res.send(200, String(sum));
});
console.log("creating server");
var server = http.createServer(app);
console.log("server listen");
server.listen(app.get('port'), process.env.IP, function() {
    console.log(app.settings.env + " Express server listening on " + process.env.IP + " : " + app.get('port'));
});
/*
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
*/