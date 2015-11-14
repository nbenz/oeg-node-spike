/* eslint max-nested-callbacks: 0 */

var root = '../..',
  assert = require('assert'),
  io = require('socket.io-client'),
  config = require(root + '/config/config')(),
  socket = require(root + '/libs/socket');

var socketURL = config.url + ':' + config.port;
var request = require('supertest')(socketURL);

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Socket events', function() {
  var team;
  var director;

  before(function(done) {
    request.post('/new-director')
    .type('json')
    .send({ name: 'Foo', password: 'Bar' })
    .expect(201)
    .end(function(err, res) {
      if(err) { return done(err); }
      options.query = 'token=' + res.body.token;
      director = io.connect(socketURL, options);
    });

    request.post('/new-team')
    .type('json')
    .send({ name: 'Foo', password: 'Bar' })
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

  after(function() {
    socket.purgeData();
  });
});
