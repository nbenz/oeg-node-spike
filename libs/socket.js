var root = '..';
var socketio = require('socket.io'),
  socketioJwt = require('socketio-jwt'),
  UserManager = require('./user-manager'),
  config = require(root + '/config/config')();

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

      socket.on('new bid', function(bid) {
        bid.teamName = team.name;
        team.bids.push(bid);
      });

      socket.on('drill request', function(drill) {
        drill.teamName = team.name;
        team.drillRequests.push(drill);
      });

      socket.on('seismic request', function(seismicRequest) {
        seismicRequest.teamName = team.name;
        team.bids.push(seismicRequest);
      });
    }

    if(socket.decoded_token.role === 'director') {
      UserManager.getDirector().id = socket.id;
    }
  });
}
