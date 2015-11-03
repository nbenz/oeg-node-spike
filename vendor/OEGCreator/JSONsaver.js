function saveJSON(elevs, oil, gas, rocktypePerLayer){
  var output;
  output = "{\n\"map\":{\n";
  //Put drillcost, etc here.
  //should be adaptable, not hardcoded. 
  //Will fill in later. 
  output += "\"cell\":[";
  var numRows = elevs.length;
  var numCols = elevs[0].length;
  var numLayers = elevs[0][0].length;
  for(var r = 0; r < numRows; r++){
	if (r!= 0){
	  output += ",";	
	}
	output += "[";
    for (var c = 0; c < numCols; c++){
	  if (c != 0){
        output += ",\n";
	  }
	  output += "{\n";
	  output += "\"isDrilled\":false,\n";
	  output += "\"owner\":\"\",\n";
	  output += "\"gas\":" + gas[r][c] + ",\n";
	  output += "\"oil\":" + oil[r][c] + ",\n";
	  output += "\"layer\":[\n";
	  
	  for (var layer = 0; layer < numLayers; layer++){
        if (layer != 0){
		  output += ",\n";
		}
	    output += "{\n";
		output += "\"elevation\":" + elevs[r][c][layer] + ",\n";
		output += "\"rocktype\":" + rocktypePerLayer[layer] + "\n"; //might need to inclose rocktypePerLayer in quotes if not numeric value
		output += "}";
	  }
	  output += "]}\n";
	}
	output += "]\n";
  }
  output += "]}\n}";
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