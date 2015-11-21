//change team constructor

var initialMap;
var elevationError[][][];


function loadInitialSimulation(){
	//load inital map (from saved JSON? we hope...)
	//randomly generate some fudge values & store it
	//for each user: change the value of their mask to be an empty 2d of the correct size
	initializeFudge();
}

function initializeFudge(){
	
}


//Make a mask object with functions that can update itself with functions
//Then the team has maps...

function updateMask(){//take in a user, cells you want updated...
//given some cells, either:
/*
	1) fetch data from fudgeOffsets and store it in appropriate places
	2) zeroe out part of the mask


*/	
	
}