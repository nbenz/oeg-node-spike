function Bid(bidAmount, point) {
  this.timeStamp = new Date();
  this.landPoint = point;
  this.cost = bidAmount;
}

function Drill(point) {
  this.timeStamp = new Date();
  this.landPoint = point;
}

function SeismicRequest(startPoint, endPoint) {
  this.timeStamp = new Date();
  this.startPoint = startPoint;
  this.endPoint = endPoint;

  this.getNumCells = function() {
    xLen = Math.abs(startPoint.x - endPoint.x);
    yLen = Math.abs(startPoint.y - endPoint.y);
    return (xLen > yLen) ? xLen : yLen;
  };
}

module.exports.Bid = Bid;
module.exports.Drill = Drill;
module.exports.SeismicRequest = SeismicRequest;
