/*eslint max-nested-callbacks: 0*/

var root = '../..',
  assert = require('assert'),
  io = require('socket.io-client'),
  config = require(root + '/config/config')(),
  server = require(root + '/libs/server'),
  socket = require(root + '/libs/socket');

var socketURL = 'http://' + config.url + ':' + config.port;
var request = require('supertest')(socketURL);

var options = {
  transports: ['websocket'],
  'force new connection': true
};

before(function() {
  server.listen(config.port, function() {
    console.log('Starting server in ' + config.env + ' on ' + config.url + ':' + config.port);
  });
  socket.listen(server);
});

describe('Express endpoints', function() {
  describe('Team endpoints', function() {
    var team = {
      name: 'Foo Team',
      password: 'BarPass'
    };

    describe('/new-team', function() {
      it('should create a new team and return a token', function(done) {
        request.post('/new-team')
        .type('json')
        .send(team)
        .expect(201)
        .end(function(err, res) {
          if(err) { return done(err); }
          assert.ok(res.body.token);
          done();
        });
      });

      it('can\'t create a team without a username', function(done) {
        var badTeam = {
          password: 'FooPass'
        }
        request.post('/new-team')
        .type('json')
        .send(badTeam)
        .expect(400, done);
      });

      it('can\'t create a team without a password', function(done) {
        var badTeam = {
          name: 'FooName'
        }
        request.post('/new-team')
        .type('json')
        .send(badTeam)
        .expect(400, done);
      });
    });

    describe('/team-login', function() {
      it('should return a token after a successful login', function(done) {
        request.post('/team-login')
        .type('json')
        .send(team)
        .expect(200)
        .end(function(err, res) {
          if(err) { return done(err); }
          assert.ok(res.body.token);
          done();
        });
      });

      it('can\'t log on with an invalid name', function(done) {
        var badTeam = {
          name: 'Invalid Name',
          password: 'BarPass'
        };
        request.post('/team-login')
        .type('json')
        .send(badTeam)
        .expect(401, done)
      });

      it('can\'t log on with an invalid password', function(done) {
        var badTeam = {
          name: 'Foo Team',
          password: 'bar'
        };
        request.post('/team-login')
        .type('json')
        .send(badTeam)
        .expect(401, done)
      });

      it('can connect to the socket after logging in', function(done) {
        request.post('/team-login')
        .type('json')
        .send(team)
        .expect(200)
        .end(function(err, res) {
          if(err) { return done(err); }
          options.query = 'token=' + res.body.token;

          var goodTeam = io.connect(socketURL, options);
          goodTeam.on('connect', function(data) {
            done();
          });
        });
      });
    });
  });

  describe('Director endpoints', function() {
    var director = {
      name: 'FooDirector',
      password: 'BarPassword'
    };

    describe('/new-director', function() {
      it('should create a new director on the server', function(done) {
        request.post('/new-director')
        .type('json')
        .send(director)
        .expect(201, done)
      });

      it('can\'t create a director without a username', function(done) {
        var badDir = {
          password: 'FooPass'
        };
        request.post('/new-team')
        .type('json')
        .send(badDir)
        .expect(400, done);
      });

      it('can\'t create a director without a password', function(done) {
        var badDir = {
          name: 'FooName'
        };
        request.post('/new-team')
        .type('json')
        .send(badDir)
        .expect(400, done);
      });
    });

    describe('/director-login', function() {
      it('can log on after a director is created', function(done) {
        request.post('/director-login')
        .type('json')
        .send(director)
        .expect(200)
        .end(function(err, res) {
          if(err) { return done(err); }
          assert.ok(res.body.token);
          done();
        });
      });

      it('can\'t log on with an invalid name', function(done) {
        var dir = {
          name: 'foo',
          password: 'BarPassword'
        };
        request.post('/director-login')
        .type('json')
        .send(dir)
        .expect(401, done)
      });

      it('can\'t log on with an invalid password', function(done) {
        var dir = {
          name: 'FooDirector',
          password: 'bar'
        };
        request.post('/director-login')
        .type('json')
        .send(dir)
        .expect(401, done)
      });

      it('can connect to the socket after logging in', function(done) {
        request.post('/director-login')
        .type('json')
        .send(director)
        .expect(200)
        .end(function(err, res) {
          if(err) { return done(err); }
          options.query = 'token=' + res.body.token;

          var dir = io.connect(socketURL, options);
          dir.on('connect', function(data) {
            done();
          });
        });
      });
    });
  });

  after(function() {
    socket.purgeData();
  });
});

after(function() {
  console.log('Stopping server on ' + config.env + ' on ' + config.url + ':' + config.port);
  socket.exit();
  server.close();
});
