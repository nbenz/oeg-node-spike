//change team constructor

var initialMap;
var elevationError[][][];


/*
  pathToJSONFile will look somewhat like '../sims/myFirstMap.json'
  Basically, make sure that it is a String, and that it is also a valid path to a JSON simulation file.
*/
function loadInitialSimulation(pathToJSONFile){
  //load inital map (from saved JSON? we hope...)
  //randomly generate some fudge values & store it
  //for each user: change the value of their mask to be an empty 2d of the correct size
  initialMap = require(pathToJSONFile);
  initializeElevationErrors();
}
/*Recall from XML documentation:
  <fudge>10</fudge>                  <!--  Fudge percentage is the maximum percentage by which the layer elevation will be skewed. -->
  <removepercent>10</removepercent>   <!--  Remove percentage is the probability by which the bottom layer elevation will be removed
  
  
*/
function initializeElevationErrors(){
  for (var i = 0; i < initialMap.grid.length; i++){
    for (var j = 0; j < initialMap.grid[i].length; j++){
      elevationError[i][j][0] = 0;//Hopefully we can tell what type of rock we are standing on. And how high we are. 
	  for (var k = 1; k < initialMap.grid[i][j].layer.length; k++){
	    elevationError[i][j][k] = (2*Math.random()-1) * (initialMap.fudge/100) * initialMap.grid[i][j].layer[k].elevation;
	  }
    }
  }
}

/*This purposefully eliminates any oil/gas information found in the 

*/
function getOnlyElevation(p){
  var outElevs = [];
  for (var i = 0; i < initialMap.grid[p.x][p.y].layer.length; i++){
    outElevs.push(initialMap.grid[p.x][p.y].layer[i].elevation);
  }
  return outElevs;
}

function getAllCellInfo(p){
  return initialMap.grid[p.x][p.y].layer;
}
