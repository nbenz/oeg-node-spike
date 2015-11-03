var root = '../..';
var assert = require('assert');
var Director = require(root + '/models/director');

describe('Director', function() {
  it('should create a director with all the properties', function() {
    var director = new Director('Foo Director', 'Bar Password');
    assert.equal(director.name, 'Foo Director'); 
    assert.equal(director.password, 'Bar Password');
    assert.equal(director.role, 'director');
  });
});
