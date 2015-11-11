var root = '..';
var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  bodyParser = require('body-parser'),
  config = require(root + '/config/config')(),
  jwt = require('jsonwebtoken'),
  UserManager = require('./user-manager');

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/director', function(req, res) {
  res.sendFile(__dirname + '/director.html');
});

app.post('/new-director', function(req, res) {
  var status = 201;

  if(UserManager.getDirector()) {
    status = 409;
  } else if(!req.body.name || !req.body.password) {
    status = 400;
  } else {
    UserManager.createDirector(req.body.name, req.body.password);
  }

  var token;
  if(status < 400) {
    token = jwt.sign(UserManager.getDirector(), config.jwtSecret);
  }
  res.status(status).send({ token: token });
});

app.post('/director-login', function(req, res) {
  var director = UserManager.getDirector();
  var status = 200;

  if(!director || !UserManager.directorAuthenticated(req.body.name, req.body.password)) {
    status = 401;
  }

  var token;
  if(status < 400) {
    token = jwt.sign(director, config.jwtSecret);
  }

  res.status(status).send({ token: token });
});

app.post('/new-team', function(req, res) {
  var status = 201;

  if(UserManager.getTeam(req.body.name)) { 
    status = 409; 
  } else if(!req.body.name || !req.body.password) {
    status = 400;
  } else {
    UserManager.addTeam(req.body.name, req.body.password);
  }

  var token;
  if(status < 400) {
    token = jwt.sign(UserManager.getTeam(req.body.name), config.jwtSecret);
  }

  res.status(status).send({ token: token });
});

app.post('/team-login', function(req, res) {
  var team = UserManager.getTeam(req.body.name);
  var status = 200;
  if(!team || team.password !== req.body.password) { 
    status = 401; 
  } 

  var token;
  if(status < 400) {
    token = jwt.sign(team, config.jwtSecret);
  }

  res.status(status).send({ token: token });
});

module.exports = server;
