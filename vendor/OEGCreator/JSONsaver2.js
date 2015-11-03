function saveJSON(elevs, oil, gas, rocktypePerLayer){
  var map = {};
  
  map.seismicSetup = Number(document.getElementById("seismicSetup").value);
  map.seismicLinear = Number(document.getElementById("seismicLinear").value);
  map.startCash = Number(document.getElementById("startCash").value);
  map.drillCost = Number(document.getElementById("drillCost").value);
  map.minLeaseCost = Number(document.getElementById("minLeaseCost").value);
  map.oilIncome = Number(document.getElementById("oilIncome").value);
  map.gasIncome = Number(document.getElementById("gasIncome").value);
  map.simSteps = Number(document.getElementById("simSteps").value);
  map.numSteps = Number(document.getElementById("numSteps").value);
  map.stepTime = Number(document.getElementById("stepTime").value);
  map.gridSize = Number(document.getElementById("gridSize").value);
  map.fudge = 10;
  map.removePercent = 25;
  
  map.grid = [];

  var numRows = elevs.length;
  var numCols = elevs[0].length;
  var numLayers = elevs[0][0].length;
  
  for(var r = 0; r < numRows; r++){
    var row = [];

    for (var c = 0; c < numCols; c++){
      var cell = {};
	  cell.isDrilled = false;
	  cell.owner = "";
	  cell.gas = gas[r][c];
	  cell.oil = oil[r][c];
	  
	  row.push(cell);
	  cell.layers = [];
	  for (var z = 0; z < numLayers; z++){
		var layerPiece = {};
		layerPiece.elevation = elevs[r][c][z];
		layerPiece.rocktype = rocktypePerLayer[z];
		cell.layers.push(layerPiece);
	  }
	  map.grid.push(row);
	}
  }
  output = JSON.stringify(map);

  // thanks to http://code.runnable.com/U5HC9xtufQpsu5aj/use-javascript-to-save-textarea-as-a-txt-file
  var textFileAsBlob = new Blob([output], {type:'text/plain'});
  var fileNameToSaveAs = "sim.json"; // filename to change as option
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "My Hidden Link";
  window.URL = window.URL || window.webkitURL;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = function() {
	  document.body.removeChild(event.target);
  };
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
}