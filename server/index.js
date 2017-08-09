var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var db = require('../database');
var apiRouter = require('./api-router.js');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var authRouter = require('./auth-router.js');
var Session = require('express-session');

var app = express();

// Activates Google OAuth passport strategy
require('../passport/google-auth-strategy.js')(passport);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(Session({
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Setup routes
app.use('/api', apiRouter);
app.use('/', authRouter);

// Serve static files
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});

// createPost = (posterData, trailData, title, text, imageUrl)
app.post('/api/photo', (req, res) => {
  var photo = req.body.photo;
  //the first two parameters passed need to have a  
  //corresponding row in the user and trail tables, respectively. 
  db.createPost(1, 1, photo.title, photo.text, photo['image_url']);
  res.send();
});

// Start server
app.listen(3000, function() {
  console.log('listening on port 3000...');
});
