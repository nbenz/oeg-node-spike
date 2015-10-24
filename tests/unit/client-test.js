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

var bankAccount = new BankAccount();
var teamData = { 
  'name': 'Foo Team',
  'bankAccount': bankAccount,
  'bids': [],
  'seismicRequests': [],
  'drillRequests': []
};

describe('Client Connection', function() {
  before(function() {
    server.listen();
  });

  it('should receive the \'team joined\' event after sending \'new team\'', function(done) {
    var team1 = io.connect(socketURL);

    team1.on('connect', function(data) {
      team1.emit('new team', teamData);
    });

    team1.on('team joined', function(teamName) {
      assert.equal(teamName, teamData.name);
      done();
    });
  });
});
