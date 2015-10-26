var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('../config/config').config();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/director', function(req, res) {
  res.sendFile(__dirname + '/director.html');
});

var teams = [];
var director;

io.on('connection', function(socket) {
  //Teams - need to manage these roles better
  socket.on('new team', function(team) {
    team.id = socket.id;
    teams.push(team);
    socket.join('teams');

    io.to('teams').emit('team joined', team.name);
  });

  //Director
  socket.on('new director', function(director) {
    this.director = director;
    this.director.id = socket.id;

    socket.join('director');
  });

  socket.on('send game event', function(event) {
    io.to('teams').emit(event);
  });
});


module.exports.listen = function(port) {
  http.listen(config.port, function() {
    console.log('Starting server in ' + config.env + ' on ' + config.url + ':' + config.port);
  });
};

module.exports.shutdown = function() {
  console.log('Stopping server in ' + config.env + ' on ' + config.url + ':' + config.port);
  http.close();
};
