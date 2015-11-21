/*
Mask file
responsible for creating and handling everything according to a mask
Part of a Team...the team constructs one of me, and updates it later as it sees fit.

*/
var mask;

function applySeismic(x, y){
	//updates mask for a seismic request
	if (!mask[x][y].drilled){	//If not drilled
		mask[x][y].layerError = elevationError[x][y];
	}
}

function initializeMask(size){
	var outMask = [];
	for (var i = 0; i < size; i++){
		var row = [];
		for (var j = 0; j < size; j++){
			row.push({drilled: false});
		}
		outMask.push(row);
	}
	return outMask;
}

function applyDrill(x, y){
	//zero out fudge for specific x,y point. 
	//(get rid of the 1d array there)
	mask[x][y].drilled = true;
	mask[x][y].layerError.length = 0;//empty out any data stored there. 
}

function getCellInfo(x, y){
	if (mask[x][y].drilled){
		//return absolute truth 
	}else if (mask.[x][y].elevationError){
		//return skewed elevations
	} else {
		//return basic surface level info
	}
	
	
	
	//for a given point:
	//if mask is null there,
		//return basic info 
	//if there is an array there:
		//look into map and grab values
		//apply the appropriate offset for each
		//return information (additional stuff is a 1d array of elevations and rocktypes)
	//if there is a zero there
		//return appropriate mask values without masking them
		//again, this includes a 1d array of elevations and values.
	
}