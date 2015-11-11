var root = '../..';
var assert = require('assert');
var Action = require(root + '/models/action');
var Point = require(root + '/models/point');

describe('Action', function() {
  it('creates Actions with their properties', function() {
    var bidAmount = 1337;
    var landPoint = new Point(1, 22);

    var startPoint = new Point(333, 4444);
    var endPoint = new Point(333, 6666666);

    var bid = new Action.Bid(bidAmount, landPoint);
    var drill = new Action.Drill(landPoint);
    var seismicRequest = new Action.SeismicRequest(startPoint, endPoint);

    assert.equal(bid.landPoint, landPoint);
    assert.equal(drill.landPoint, landPoint);
    assert.equal(seismicRequest.startPoint, startPoint);

    assert.equal(bid.landPoint.x, 1);
    assert.equal(seismicRequest.getNumCells(), (6666666 - 4444));

    assert.ok(bid.timeStamp);
    assert.ok(drill.timeStamp);
    assert.ok(seismicRequest.timeStamp);
  });
});
