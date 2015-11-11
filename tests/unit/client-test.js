/* This file is the spec for the client side of the application.
 * If I want to build the client counterpart, I should be able
 * to look at this file as documentation for every client-server
 * interaction that I need to implement.
 */

/*eslint max-nested-callbacks: 0*/

var root = '../..',
  assert = require('assert'),
  io = require('socket.io-client'),
  config = require(root + '/config/config')(),
  server = require(root + '/libs/server'),
  socket = require(root + '/libs/socket').listen(server),
  BankAccount = require(root + '/models/bank-account.js');

var socketURL = config.url + ':' + config.port;
var request = require('supertest')(socketURL);

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var bankAccount = new BankAccount();
var teamData = { 
  'name': 'Foo Team',
  'bankAccount': bankAccount,
  'bids': [],
  'seismicRequests': [],
  'drillRequests': []
};

before(function() {
  server.listen(config.port, function() {
    console.log('Starting server in ' + config.env + ' on ' + config.url + ':' + config.port);
  });
});

var team = {
  name: 'Foo Team',
  password: 'BarPass'
};

describe('Team endpoints', function() {
  describe('/new-team', function() {
    it('should create a new team on the server', function(done) {
      request.post('/new-team')
      .type('json')
      .send(team)
      .expect(201, done);
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
    it('should log in the team that has been created', function(done) {
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

var director = {
  name: 'FooDirector',
  password: 'BarPassword'
};

describe('Director endpoints', function() {
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
  console.log('Stopping server on ' + config.env + ' on ' + config.url + ':' + config.port);
  server.close();
});
