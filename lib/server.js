var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('../config/config').config();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var teams = [];

io.on('connection', function(socket) {
  socket.on('new team', function(team) {
    team.id = socket.id;
    teams.push(team);

    io.emit('team joined', team.name);
  });
});

module.exports.listen = function() {
  http.listen(config.port, function() {
    console.log('Server listening in ' + config.env + ' on ' + config.url + ':' + config.port);
  });
};
