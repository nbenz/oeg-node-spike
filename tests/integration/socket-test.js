/* eslint max-nested-callbacks: 0 */

var root = '../..',
  assert = require('assert'),
  io = require('socket.io-client'),
  config = require(root + '/config/config')(),
  socket = require(root + '/libs/socket'),
  UserManager = require(root + '/libs/user-manager'),
  Action = require(root + '/models/action'),
  Point = require(root + '/models/point');

var socketURL = 'http://' + config.url + ':' + config.port;
var request = require('supertest')(socketURL);

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Socket events', function() {
  var teamData = {
    name: 'Foo Team',
    password: 'Bar Pass'
  };

  var directorData = {
    name: 'Foo Director',
    password: 'Bar Pass'
  };

  var team;
  var director;

  before(function(done) {
    request.post('/new-director')
    .type('json')
    .send(directorData)
    .expect(201)
    .end(function(err, res) {
      if(err) { return done(err); }
      options.query = 'token=' + res.body.token;
      director = io.connect(socketURL, options);
    });

    request.post('/new-team')
    .type('json')
    .send(teamData)
    .expect(201)
    .end(function(err, res) {
      if(err) { return done(err); }
      options.query = 'token=' + res.body.token;

      team = io.connect(socketURL, options);
      team.on('connect', function(data) {
        done();
      });
    });
  });

  describe('Director', function() {
    it('should broadcast any arbitrary event to the teams', function(done) {
      var payload = {
        event: 'arbitrary event',
        data: {
          foo: 'bar'
        }
      };

      director.emit('send event', payload);

      team.on('arbitrary event', function(data) {
        assert.equal(data.foo, 'bar');
        done();
      });
    });
  });

  describe('Teams', function() {
    var serverTeam;

    it('can submit a bid', function(done) {
      serverTeam = UserManager.getTeam(teamData.name);
      var bidAmount = 1337;
      var landPoint = new Point(1, 22);
      var bid = new Action.Bid(bidAmount, landPoint);

      team.emit('new bid', bid, function(status) {
        assert.ok(serverTeam.bids[0]);
        assert.equal(serverTeam.bids[0].cost, bid.cost);
        done();
      });
    });

    it('can submit a drill request', function(done) {
      var landPoint = new Point(2, 23);
      var drill = new Action.Drill(landPoint);

      team.emit('new drill request', drill, function(status) {
        assert.ok(serverTeam.drillRequests[0]);
        assert.deepEqual(serverTeam.drillRequests[0].landPoint, drill.landPoint);
        done();
      });
    });

    it('can submit a seismic request', function(done) {
      var startPoint = new Point(333, 4444);
      var endPoint = new Point(333, 6666666);
      var seismicRequest = new Action.SeismicRequest(startPoint, endPoint);

      team.emit('new seismic request', seismicRequest, function(status) {
        assert.ok(serverTeam.seismicRequests[0]);
        assert.deepEqual(serverTeam.seismicRequests[0].startPoint, seismicRequest.startPoint);
        done();
      });
    });
  });

  after(function() {
    socket.purgeData();
  });
});
