describe('equality', function() {
  it('should return 1 when the values are equal', function() {
    chai.assert.equal(1, 4 === 4);
  });
  it('should return 0 when the values are not equal', function() {
    chai.assert.equal(0, 3 === 4);
  });
});
