var root = '../..';
var assert = require('assert');
var Team = require(root + '/models/team');

describe('Team', function() {
  it('should create a team with all the properties', function() {
    var team = new Team('Foo Name', 'Bar Password');
    assert.equal(team.name, 'Foo Name'); 
    assert.equal(team.password, 'Bar Password');
    assert.equal(team.role, 'team');
    assert.deepEqual(team.bids, []);
    assert.deepEqual(team.seismicRequests, []);
    assert.deepEqual(team.drillRequests, []);
  });
});
