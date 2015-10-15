var assert = require('assert');

describe('equality', function() {
  it('should return 1 when the values are equal', function() {
    assert.equal(1, 4 === 4);
  });
  it('should return 0 when the values are not equal', function() {
    assert.equal(0, 3 === 4);
  });
});
