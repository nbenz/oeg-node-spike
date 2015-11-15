var root = '..';
// var UserManager = require('./user-manager');
var map = require('./map-manager').initialMap;

function processDrillRequests(teams) {
  for(var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var drillQueue = team.drillRequests;

    if(drillRequests.length > 0) {
      for(var j = 0; j < drillRequests.length; j++) {
        var drill = drillRequests[j];
        if(canDrill(team, drill)) {
          team.bankAccount.addBalance(0 - map.drillCost);
          //Add to history
          map.grid[drill.landPoint.x][drill.landPoint.y].isDrilled = true;
          team.bankAccount.addIncome(incomeRate(drill.landPoint, gas));
          team.bankAccount.addIncome(incomeRate(drill.landPoint, oil));
        }
      }
    }
  }
}

function processBids(teams) {
  var winningBids = auction(teams);
  //handle winningBids
}

function getDrillCost(drill) {
  // return grid[drill.landPoint.x, drill.landPoint.y].drillCost;
}

function canDrill(team, drill) {
  return team.bankAccount.balance >= map.drillCost &&
          map.grid[drill.landPoint.x, drill.landPoint.y].isDrilled === false &&
          map.grid[drill.landPoint.x, drill.landPoint.y].owner === team.name;
}

function incomeRate(point, type) {
  var layers = map.grid[point.x][point.y].layer;
  var rate = 0;
  for(var i = 0; i < layers.length; i++) {
    rate += layers[i][type];
  }
  return rate;
}
