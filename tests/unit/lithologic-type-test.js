var root = '../..';
var assert = require('assert');
var LithologicType = require(root + '/models/lithologic-type');

describe('lithologic-type', function() {
  it('should create an object with all the properties', function() {
    var lithType = new LithologicType(601);
    assert.equal(lithType.rockCode, 601, 'Expected rockCode equal to 601'); 
    assert.equal(lithType.fullName, 'Gravel or conglomerate (1st option)', 'Expected fullName equal to "Gravel or conglomerate (1st option)"');
    assert.equal(lithType.shortName, 'Grv or Cgl (1)', 'Expected shortName equal to "Grv or Cgl (1)"');
  });

  it('should instantiate independent objects', function() {
    var rock1 = new LithologicType(601);
    
    var rock2 = new LithologicType(602);

    assert.equal(rock1.rockCode, 601, 'Expected a rockCode of 601');
    assert.equal(rock2.rockCode, 602, 'Expected a rockCode of 602');
  });
});
