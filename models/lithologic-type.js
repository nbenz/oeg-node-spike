var rockTypes = require('../data/rock-types.json'); 

var LithologicType = function(rockCode) {  
  this.rockCode = rockCode;
  this.fullName = rockTypes[rockCode].fullName;
  this.shortName = rockTypes[rockCode].shortName;
  // maybe put the image path here for client?
};

module.exports = LithologicType;
