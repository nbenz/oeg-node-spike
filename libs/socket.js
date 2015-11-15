var root = '..';
var socketio = require('socket.io'),
  socketioJwt = require('socketio-jwt'),
  UserManager = require('./user-manager'),
  GameManager = require('./game-manager'),
  config = require(root + '/config/config')();

var io;

module.exports.listen = function(app) {
  io = socketio.listen(app);

  io.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true
  }));

  io.on('connection', function(socket) {
    if(socket.decoded_token.role === 'team') {
      var team = UserManager.getTeam(socket.decoded_token.name);
      team.id = socket.id;

      socket.on('new bid', function(bid, fn) {
        bid.teamName = team.name;
        team.bids.push(bid);
        fn(200);
      });

      socket.on('new drill request', function(drill, fn) {
        drill.teamName = team.name;
        team.drillRequests.push(drill);
        fn(200);
      });

      socket.on('new seismic request', function(seismicRequest, fn) {
        seismicRequest.teamName = team.name;
        team.seismicRequests.push(seismicRequest);
        fn(200);
      });
    }

    if(socket.decoded_token.role === 'director') {
      UserManager.getDirector().id = socket.id;

      socket.on('send event', function(payload) {
        socket.broadcast.emit(payload.event, payload.data);
      });

      socket.on('end round', function() {
        GameManager.processBids(UserManager.getTeams());
        GameManager.processDrillRequests(UserManager.getTeams());
      });
    }
  });
}

module.exports.purgeData = function() {
  io.sockets.sockets.forEach(function(s) {
    s.disconnect(true);
  });

  UserManager.removeDirector();
  UserManager.removeTeams();
}

module.exports.exit = function() {
  io.close();
}
