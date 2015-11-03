var root = '..';
var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(http),
  config = require(root + '/config/config').config(),
  jwt = require('jsonwebtoken'),
  socketioJwt = require('socketio-jwt'),
  Team = require(root + '/models/team'),
  Director = require(root + '/models/director');

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/director', function(req, res) {
  res.sendFile(__dirname + '/director.html');
});

var jwtSecret = 'OEG-game-so-fun';
var director;
var teams = [];

app.post('/new-director', function(req, res) {
  var status = 201;
  var director = getDirector();
  if(director) {
    status = 409;
  } else if(!req.body.name || !req.body.password) {
    status = 400;
  } else {
    setDirector(new Director(req.body.name, req.body.password));
  }

  var token;
  if(status < 400) {
    token = jwt.sign(getDirector(), jwtSecret);
  }
  res.status(status).send({ token: token });
});

app.post('/director-login', function(req, res) {
  var director = getDirector();
  var status = 200;

  if(!director || !directorAuthenticated(req.body.name, req.body.password)) {
    status = 401;
  }

  var token;
  if(status < 400) {
    token = jwt.sign(director, jwtSecret);
  }

  res.status(status).send({ token: token });
});

app.post('/new-team', function(req, res) {
  var team = getTeam(req.body.name);
  var status = 201;

  if(team) { status = 409; }
  else if(!req.body.name || !req.body.password) {
    status = 400;
  } else {
    team = new Team(req.body.name, req.body.password);
    teams.push(team);
  }

  var token;
  if(status < 400) {
    token = jwt.sign(team, jwtSecret);
  }

  res.status(status).send({ token: token });
});

app.post('/team-login', function(req, res) {
  var team = getTeam(req.body.name);
  var status = 200;
  if(!team || team.password !== req.body.password) { 
    status = 401; 
  } 

  var token;
  if(status < 400) {
    token = jwt.sign(team, jwtSecret);
  }

  res.status(status).send({ token: token });
});

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

io.on('connection', function(socket) {
  if(socket.decoded_token.role === 'team') {
    getTeam(socket.decoded_token.name).id = socket.id;
  }

  if(socket.decoded_token.role === 'director') {
    getDirector().id = socket.id;
  }
});

function setDirector(dir) {
  director = dir;
}

function getDirector() { 
  return director; 
}

function directorAuthenticated(name, password) {
  var director = getDirector();
  return director.name === name &&
    director.password === password;
};


function getTeam(teamName) {
  for(var i=0; i<teams.length; i++) {
    if(teams[i].name === teamName) {
      return teams[i];
    }
  }
};

module.exports.listen = function(port) {
  http.listen(config.port, function() {
    console.log('Starting server in ' + config.env + ' on ' + config.url + ':' + config.port);
  });
};

module.exports.shutdown = function() {
  console.log('Stopping server in ' + config.env + ' on ' + config.url + ':' + config.port);
  http.close();
};
