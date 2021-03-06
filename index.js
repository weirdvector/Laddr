//index.js

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');

var app = express();
var port = 3000;

//app.set('view engine', 'ejs');
app.set('secret', config.secret);

//body-parser to check for POST parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(cookieParser());

//passport setup
var passport = require('passport');
require('./config/passport')(passport);

//static files
app.use('/js', express.static(__dirname + '/app/public/js'));
app.use('/css', express.static(__dirname + '/app/public/css'));
app.use('/lib', express.static(__dirname + '/app/public/lib'));
app.use('/fonts', express.static(__dirname + '/app/public/fonts'));
app.use('/partials', express.static(__dirname + '/app/public/partials'));
app.use('/img', express.static(__dirname + '/app/public/img'));
app.use('/uploads', express.static(__dirname + 'app/public/img/uploads'));
//bower components
app.use('/components', express.static(__dirname + '/app/public/components'));
//privacy policy
app.use('/policy', express.static(__dirname + '/app/public/policy'));
app.use('/policy/css', express.static(__dirname + '/app/public/policy/css'));
app.use('/policy/js', express.static(__dirname + '/app/public/policy/js'));
//app.use(express.static(__dirname + '/app/public'));

//passport setup
app.use(session(config));
app.use(passport.initialize());
app.use(passport.session());

//routing
require('./app/routes')(app, passport);

//start listening
app.listen(port);
console.log("Listening on port " + port);

module.exports = app;