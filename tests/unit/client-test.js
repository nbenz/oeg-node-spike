/* This file is the spec for the client side of the application.
 * If I want to build the client counterpart, I should be able
 * to look at this file as documentation for every client-server
 * interaction that I need to implement.
 */

var root = '../..';
var assert = require('assert');
var io = require('socket.io-client');
var config = require(root + '/config/config').config();
var server = require(root + '/lib/server.js');
var BankAccount = require(root + '/lib/bank-account.js');

var socketURL = config.url + ':' + config.port;
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
  server.listen();
});

describe('Client Connection', function() {
  it('should receive the \'team joined\' event after sending \'new team\'', function(done) {
    var team = io.connect(socketURL, options);

    team.on('connect', function(data) {
      team.emit('new team', teamData);
    });

    team.on('team joined', function(teamName) {
      assert.equal(teamName, teamData.name);
      team.disconnect();
      done();
    });
  });
});

describe('Director connection', function() {
  it('should connect a director to the server', function(done) {
    var director = io.connect(socketURL, options);
    director.on('connect', function(data) {
      director.disconnect();
      done();
    });
  });

  it('can relay any arbitrary event to connected teams', function(done) {
    var team = io.connect(socketURL, options);
    var director = io.connect(socketURL, options);

    team.on('connect', function(data) {
      team.emit('new team', teamData);
    });

    team.on('foo event', function() {
      team.disconnect();
      done();
    });

    director.on('connect', function(data) {
      director.emit('send game event', 'foo event');
      director.disconnect();
    });
  });
});

after(function() {
  server.shutdown();
});
