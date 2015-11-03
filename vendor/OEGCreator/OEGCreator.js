/*
 * OEGcreator.java
 *
 * Created on Dec 24, 2011, 3:31:48 PM
 * Modified to JavaScript on Dec 1, 2013.
 */

/* 
 * Portions copyright 2011 by Kevin Brewer (brewek)
 * Copyright 2013 by Kevin Brewer (brewek)
 */
function myRandom(range){
	// return a random integer from 0 to < range
	return Math.floor(Math.random()*range);
}

// The following creates all the arrays based on the user inputs that are passed
// to this function.

//Simulation is a four layer model as follows:

// Layer 1 [0]: Sandstone, non-oil bearing, thickens to the east
// Layer 2 [1]: Thin siltstone layer, non-oil bearing, intersected by topography
// Layer 3 [2]: Shale, across entire domain, partly also at surface, somewhat uniform thickness
// Layer 4 [3]: Sandstone, oil/gas bearing, across entire domain
// Layer 5 [4]: Shale, across entire domain

// Fault goes across entire domain and traps some oil/gas 
// Slight anticline across entire domain
// Multiple "bumps and humps" that trap some oil/gas. 

//domainSize is the x and y array dimension (square) of the domain
//myNumFields is the number of humps and bumps to create
//mySlope is the general west to east elevation rise
//myAntiElevation is the anticline height delta
//myFaultDelta is the fault offset

function createSim(domainSize, myNumFields, mySlope, myAntiElevation, myFaultDelta) {
//	alert("Starting createSim...");
// various variables
    myRowLocation = 0;
    myColLocation = 0;
    numLayers = 5;
	minimumResourceLayerElev = 1000; // elevations are ft AMSL
	thicknessResourceLayer = 100;
	faultOffset = myFaultDelta;
	    
// Set the minimum bottom elevation.
    myMinElev = 0.0 ;








// Set array sizes from user inputs.
    myNumRows = domainSize;
    myNumCols = domainSize;
// elevs are the 3D elevation array for the domain [rows][cols][layers]
// topo is the 2D topo array [rows][cols]
    var elevs = new Array(myNumRows);
    var topo = new Array(myNumRows);
    for(i=0;i<myNumRows;i++){
    	elevs[i]=new Array(myNumCols);
    	topo[i]=new Array(myNumCols);
    	for(j=0;j<myNumCols;j++) {
    		elevs[i][j] = new Array(numLayers);
    	}
    }
// gas is the 1D gas array for the resource Layer [rows][cols]
    var gas = new Array(myNumRows);
    for(i=0;i<myNumRows;i++){
    	gas[i]=new Array(myNumCols);
    }
// oil is the 1D oil array for the resource Layer [rows][cols]
    var oil = new Array(myNumRows);
    for(i=0;i<myNumRows;i++){
    	oil[i]=new Array(myNumCols);
    }
	
// migrateoil is the 1D oil array for the resource Layer [rows][cols]
    var migrateoil = new Array(myNumRows);
    for(i=0;i<myNumRows;i++){
    	migrateoil[i]=new Array(myNumCols);
    }
	
    var oilMax = new Array(myNumRows);
    for(i=0;i<myNumRows;i++){
    	oilMax[i]=new Array(myNumCols);
    }
 
	for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
              oil[i][j] = 0;
              migrateoil[i][j] = 0;
			  oilMax[i][j] = 25; // minimum capacity per cell to store oil
         }
    }

	
	
    
    
    
    
    
// Elevation of layers are constructed as follows:
// Create the elevation of the top of the resource layer
// -- Min + anticline + slope
// -- Make humps and bumps
// -- Add fault
// Add Bottom Elevation to resource layer (variable thickness) (actually top of lower layer)
// Add Elevation of Confining Layer (variable thickness, at least as thick as fault displacement)
// Add thin chert layer
// Add thicker top layer (about 1/4 of fault displacement)
// Create topography and adjust layer values (including nulls).

// Set up parameters for the anticline option.
// set the sin degree multiplier to correct value for domain size => one arch across the entire domain, in both axes.
        myMultiI = 3.14159 / myNumRows;
        myMultiJ = 3.14159 / myNumCols;
        
//alert("Creating Elevations");

// Create 2D array of resource layer elevations
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
            // array elevations are based on:
            // result = minimum + anticline + slope (small random component has been removed to facilitate correct oil migration).
              basicValue = minimumResourceLayerElev + 
              				myAntiElevation * Math.sin(j * myMultiJ) * Math.sin(i * myMultiI) + 
              				(j * mySlope * Math.sin(j * myMultiJ/2));
              elevs[i][j][3] = Math.round(basicValue);
         }
    }
    

// Create "oil fields" that are small arches at numFields random locations
//first, get a random direction 
trendDirection = myRandom(90);
     for (ii = 0; ii < myNumFields; ii++) {
        //get random location for one end of trend, rows and columns
        x0 = myRandom(myNumRows-10)+5;
        y0 = myRandom(myNumCols-10)+5;
		//get random length of trend
		myFieldLength = myRandom(Math.round(myNumRows/5))+1;
		//get the final pixel location
		x1 = Math.round(Math.cos(3.14159/180*trendDirection) * myFieldLength + x0);
		y1 = Math.round(Math.sin(3.14159/180*trendDirection) * myFieldLength + y0);
        //get random field strength 
		myFieldElev = myRandom(1500) + 50;
		oilFieldValue = Math.round(myFieldElev/20);
		
		//for each cell along field trend, set the elevation
		
// following code snippet from
// http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
//
   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(true){
	if (x0 > -1 && x0 < myNumRows && y0 > -1 && y0 < myNumCols) {
		elevs[x0][y0][3] += myFieldElev;
		oil[x0][y0] = oilFieldValue;
	}
     if ((x0==x1) && (y0==y1)) break;
     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }
}
		
/*		
        for(i = (myRowLocation - myFieldSize); i < (myRowLocation + myFieldSize); i++) {
          for(j = (myColLocation - myFieldSize); j < (myColLocation + myFieldSize); j++) {
            // make current i,j is still in array
              if (i >= 0 && i < myNumRows && j >=0 && j< myNumCols) {
                  elevs[i][j][3] = Math.round(elevs[i][j][3] +  myFieldElev * Math.sin(3.14159 * (j - (myColLocation - myFieldSize)) / 
                  (2 * myFieldSize)) * Math.sin(3.14159 * (i - (myRowLocation - myFieldSize)) / (2 * myFieldSize)));
              }
          }
        }
 */       

// now smooth the bumps and humps into fields
maxSmoothing = 13;
var tempElev = new Array(myNumRows);
for(i=0;i<myNumRows;i++){
	tempElev[i]=new Array(myNumCols);
}

for(k=0;k<maxSmoothing;k++) {
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
			tempElev[i][j] = elevs[i][j][3];
		}
	}
    for( i = 1; i < (myNumRows-1); i++) {
        for( j = 1; j < (myNumCols-1); j++) {
			tempElev[i][j] = Math.round((elevs[i-1][j-1][3] + elevs[i-1][j][3] + elevs[i-1][j+1][3] 
										+ elevs[i][j-1][3] + elevs[i][j][3] + elevs[i][j+1][3] 
										+ elevs[i+1][j-1][3] + elevs[i+1][j][3] + elevs[i+1][j+1][3])/9);
         }
    }
	for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
			elevs[i][j][3] = tempElev[i][j];
		}
	}

}
	
	
  
// Add a fault
// Fault strike equation is: Row = m * Col + b
// first pick two random points along the edge
// First point:
	p1 = myRandom(4);
	do {
		p2 = myRandom(4);
	} while (p1 == p2); 
	switch (p1) {
			case 0:
				x1 = 0;
				y1 = Math.random();
				break;
			case 1:
				x1 = Math.random();
				y1 = 1;
				break;
			case 2:
				x1 = 1;
				y1 = Math.random();
				break;
			case 3:
				x1 = Math.random();
				y1 = 0;
				break;
		}
	switch (p2) {
			case 0:
				x2 = 0;
				y2 = Math.random();
				break;
			case 1:
				x2 = Math.random();
				y2 = 1;
				break;
			case 2:
				x2 = 1;
				y2 = Math.random();
				break;
			case 3:
				x2 = Math.random();
				y2 = 0;
				break;
		}



	m = (y2-y1)/(x2-x1);
	b = y2 - m*x2;
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	targetRow = Math.round((m*j/myNumCols + b) * myNumRows);
        	if (i >= targetRow){
              elevs[i][j][3] = elevs[i][j][3] + faultOffset;
			  migrateoil[i][j] = 1;
            } 
		}
    }

// Create array of bottom elevations    
// Make the resource layer a relatively constant thickness with a random component.
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	elevs[i][j][4] = elevs[i][j][3] - thicknessResourceLayer + myRandom(10);
         }
    }
// Create array of confining elevations   
// A thick confining shale that is at least as thick as 1.25x the fault offset. 
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	elevs[i][j][2] = elevs[i][j][3] + Math.round(faultOffset*1.25) + myRandom(Math.round(faultOffset*0.4));
         }
    }
// Create array of thin layer elevations   
// A thin uniform chert. 
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	elevs[i][j][1] = elevs[i][j][2] + 5;
         }
    }
// Create array of uppermost layer elevations   
// Make it abnormally thick - will be cut off by topography. 
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	elevs[i][j][0] = elevs[i][j][1] + 5000;
         }
    }
   // for the surface
   // make a random surface with trend higher to east, but some broad hills that is at least above resource layer.
   
   // first find top of resource layer
   maxResourceLayer = -9999;
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	if(elevs[i][j][3] > maxResourceLayer) maxResourceLayer = elevs[i][j][3];
         }
    }
    
   // now create flat topo that is above resource max
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	topo[i][j] = maxResourceLayer + 5;
         }
    }
    
   // add one broad hills for surface location
    for (ii = 0; ii < 3; ii++) {
        //get random location rows and columns
        myRowLocation = myRandom(myNumRows);
        myColLocation = myRandom(myNumCols);
        //make hills random size up to domain size
        myFieldSize = myRandom(myNumRows);
        //make hills random height from 10 to 50 high.
        myFieldElev = myRandom(40) + 10;
        for(i = (myRowLocation - myFieldSize); i < (myRowLocation + myFieldSize); i++) {
          for(j = (myColLocation - myFieldSize); j < (myColLocation + myFieldSize); j++) {
            // make current i,j is still in array
              if (i >= 0 && i < myNumRows && j >=0 && j< myNumCols) {
                  topo[i][j] = Math.round(topo[i][j] +  myFieldElev * Math.sin(3.14159 * (j - (myColLocation - myFieldSize)) / (2 * myFieldSize)) * Math.sin(3.14159 * (i - (myRowLocation - myFieldSize)) / (2 * myFieldSize)));
              }
          }
        }
        
    }
    
// now use the topo to "cut off" the model layers. if layer is missing, insert null.
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	if(elevs[i][j][1] < topo[i][j]) {
        	// topo only cuts top layer
        		elevs[i][j][0] = topo[i][j];
        	} else if(elevs[i][j][2] < topo[i][j]) {
        	// topo cuts off top layer and into second layer
        		elevs[i][j][0] = null;
        		elevs[i][j][1] = topo[i][j];
        	} else {
        	// topo cuts off top and second layer, and into third layer
        		elevs[i][j][0] = null;
        		elevs[i][j][1] = null;
        		elevs[i][j][2] = topo[i][j];
        	}
         }
    }


 // determine oil and gas
// now smooth the oil fields
maxSmoothing = 5;
for(k=0;k<maxSmoothing;k++) {
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
			tempElev[i][j] = oil[i][j];
		}
	}
    for( i = 1; i < (myNumRows-1); i++) {
        for( j = 1; j < (myNumCols-1); j++) {
			tempElev[i][j] = Math.round((oil[i-1][j-1] + oil[i-1][j] + oil[i-1][j+1] 
										+ oil[i][j-1] + oil[i][j] + oil[i][j+1] 
										+ oil[i+1][j-1] + oil[i+1][j] + oil[i+1][j+1])/9);
         }
    }
	for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
			oil[i][j] = tempElev[i][j];
		}
	}

}
	
/*	
  // adjust maximum oil per cell 
	for( i = 0; i < myNumRows; i++) {
		for( j = 0; j < myNumCols; j++) {
            cellDelta = 0;
             currElev = elevs[i][j][3];
            // loop through all adjacent cell indexes
            for( ii = i-1; ii < i+2; ii++) {
              for( jj = j-1; jj < j+2; jj++) {
                // don't bother if i or j is "out of array bounds" 
                if (ii > -1 && ii < myNumRows && jj > -1 && jj < myNumCols) {
                      // do the maximum check.    
                      if ((currElev-elevs[ii][jj][3]) > cellDelta) {
                          cellDelta = (currElev-elevs[ii][jj][3]);
                      }
                }
              }    
            }
			oilMax[i][j] += Math.round(cellDelta*1);
		}
	}
*/	
  // To migrate, for each cell:
 // (1) determine the highest surrounding cell (look in all 8 adjacent cells)
 // (2a) add current cell values to highest surrounding cell (if higher than current cell)
 // (2b) don't migrate if "going to" cell already has at least 10.
 // (3) continue looping through all cells till no further migrations, or max of 5000 loops.

 // initialize each oil cell with "1".
 /*    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
              oil[i][j] += 1;
         }
     }

*/     
     // start the migration loop
     oilMoves = true;
	 
     kk = 0;
     while (oilMoves) {
       // deal with the loop control variables
       kk++;       
       oilMoves = false;  
       // for each cell in the array
       for( i = 0; i < myNumRows; i++) {
         for( j = 0; j < myNumCols; j++) {
         // don't bother with migration if no value in current cell. (nothing to migrate)
           if(migrateoil[i][j] > 0) {
             
            // find maximum elevation of adjacent cells
             x = i;
             y = j;
            // set maximum to current cell elevation. 
            // will check later to see if current cell is highest (therefore, no migration).
             maxElev = elevs[i][j][3];
            // loop through all adjacent cell indexes
			
 			if(Math.random() < 0.5 ) {
			
 //          for( ii = i-1; ii < i+2; ii++) {
 //             for( jj = j-1; jj < j+2; jj++) {
           for( ii = i-2; ii < i+3; ii++) {
              for( jj = j-2; jj < j+3; jj++) {
                // don't bother if i or j is "out of array bounds" 
                if (ii > -1 && ii < myNumRows && jj > -1 && jj < myNumCols) {
                      // do the maximum elevation check.    
                      if (elevs[ii][jj][3] > maxElev) {
                          maxElev = elevs[ii][jj][3];
                          x = ii;
                          y = jj;
                      }
                }
              }    
            }
			} else {
              for( jj = j-1; jj < j+2; jj++) {
           for( ii = i-1; ii < i+2; ii++) {
                // don't bother if i or j is "out of array bounds" 
                if (ii > -1 && ii < myNumRows && jj > -1 && jj < myNumCols) {
                      // do the maximum elevation check.    
                      if (elevs[ii][jj][3] > maxElev) {
                          maxElev = elevs[ii][jj][3];
                          x = ii;
                          y = jj;
                      }
                }
              }    
            }
			}
           // max is at x, y.
           // check to see if max is at current cell. if not, migrate to it.
           if (i != x || j != y) {
              // move oil to x, y if room
              if(migrateoil[x][y] < oilMax[x][y]) {
              	moveRoom = oilMax[x][y] - oil[x][y];
              	if(moveRoom < oil[i][j]) {
                	migrateoil[x][y] = migrateoil[x][y] + moveRoom ;
                	migrateoil[i][j] = migrateoil[i][j] - moveRoom ;
                	oilMoves = true;
                } else {
                	migrateoil[x][y] = migrateoil[x][y] + migrateoil[i][j] ;
                	migrateoil[i][j] = 0 ;
                	oilMoves = true;
                }
       		 }
           } else { // max is at current cell
                    // so, randomly move oil to similar height cell, if possible
				if(Math.random()<0.25) {
                    for(myTries=0;myTries<5;myTries++) {
                    	ii = i+myRandom(3)-1;
                    	jj = j+myRandom(3)-1;
           				if (i != ii || j != jj) {
                    	if(ii > -1 && ii < myNumRows && jj > -1 && jj < myNumCols) {
                    		if(elevs[ii][jj][3] == elevs[i][j][3] && migrateoil[ii][jj] < oilMax[ii][jj]) {
                    			myTries = 10;
                    			oilMoves = true;
								moveRoom = oilMax[ii][jj] - migrateoil[ii][jj];
								if(moveRoom < migrateoil[i][j]) {
									migrateoil[ii][jj] = migrateoil[ii][jj] + moveRoom ;
									migrateoil[i][j] = migrateoil[i][j] - moveRoom ;
								} else {
									migrateoil[ii][jj] = migrateoil[ii][jj] + migrateoil[i][j] ;
									migrateoil[i][j] = 0 ;
								}
                    		}
                    	}
                    	}
                    }
				}

           }         
          }
         }
       }
       document.getElementById("theMigrationCounter").innerHTML = kk;
       if (kk > domainSize*domainSize) { oilMoves = false; } // stop at 10000 loops if still migrating
     } 
    
     
	// add migrated oil to oil array.
    for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
              oil[i][j] += Math.round(migrateoil[i][j] / 2 ) ;
         }
     }
	
 
 
     
// Calculate gas for cells with oil above 10 and at least four adjacent oil locations above 10.
// When found, gas = oil value and new oil value is half of original oil value.
     
     // Loop through all cells
     for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
            // Set default gas value of zero.
            gas[i][j] = 0;
            // Check for current cell oil over ten. If so, do gas check.
            if (oil[i][j] > 10) {
               x = i;
               y = j;
              // bigOil is counter for adjacent oil cells above 10.
               bigOil = 0;
              // loop through adjacent indices.
              for( ii = i-1; ii < i+2; ii++) {
                for( jj = j-1; jj < j+2; jj++) {
                  // make sure adjacent cell with within bounds of domain array.
                  if (ii > -1 && ii < myNumRows) {
                    if (jj > -1 && jj < myNumCols) {
                     // check if cell has oil above 10. If so, increment bigOil counter.
                     if (oil[ii][jj] > 10) {
                          bigOil++;
                      }
                    }
                  }
                }    
              }
              // Check if at least four adjacent oil locations were above 10. If so, do the gas and oil adjustments.
              if (bigOil > 3) {
                 gas[i][j] = oil[i][j];
              //   oil[i][j] = oil[i][j]/ 2;
              }
              }
         }
     }
     
     
     
     
//alert("Output to webpage...");
     
     
    
 // All done calculating arrays. Time to write them into the textarea.
    
for (k=0;k<numLayers;k++) {
		switch (k) {
			case 0:
				theStrElement = document.getElementById("my0Values");
				document.getElementById("my0Title").innerHTML = "Layer 1 Elevations";
				str = "";
				break;
			case 1:
				theStrElement = document.getElementById("my1Values");
				document.getElementById("my1Title").innerHTML = "Layer 2 Elevations";
				str = "";
				break;
			case 2:
				theStrElement = document.getElementById("my2Values");
				document.getElementById("my2Title").innerHTML = "Layer 3 Elevations";
				str = "";
				break;
			case 3:
				theStrElement = document.getElementById("my3Values");
				document.getElementById("my3Title").innerHTML = "Layer 4 Elevations";
				str = "";
				break;
			case 4:
				theStrElement = document.getElementById("my4Values");
				document.getElementById("my4Title").innerHTML = "Layer 5 Elevations";
				str = "";
				break;
		}
       for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	if(elevs[i][j][k] == null) { 
				if(j!=0) str += ", ";
            } else { 
				if(j!=0) {
					str += ", " + elevs[i][j][k] ; 
				} else {
					str += elevs[i][j][k] ;
				}	
			}
        }
        str += "<br>";
       }
	   theStrElement.innerHTML = str;
}
	totalOil = 0;
	str = "Oil Results: <br>";
       for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	if(oil[i][j] == null) { 
				if(j!=0) str += ", ";
            } else { 
				totalOil += oil[i][j];
				if(j!=0) {
					str += ", " + oil[i][j] ; 
				} else {
					str +=  oil[i][j] ;
				}	
			}
        }
        str += "<br>";
       }
	str += "Gas Results: <br>";
       for( i = 0; i < myNumRows; i++) {
        for( j = 0; j < myNumCols; j++) {
        	if(gas[i][j] == null) { 
				if(j!=0) str += ", ";
            } else { 
				totalOil += gas[i][j];
				if(j!=0) {
					str += ", " + gas[i][j] ; 
				} else {
					str += gas[i][j] ;
				}	
			}
        }
        str += "<br>";
       }
       document.getElementById('totalOil').innerHTML = totalOil;
       document.getElementById('theOilGasResults').innerHTML = str;
       
       
// Output the layer elevations as a visual
everestElevation = -99999;
deathValleyElevation = 9999999;
for (i=0;i<numLayers;i++) {
		switch (i) {
			case 0:
				theCanvas = document.getElementById("my0Canvas");
				theMaxMin = document.getElementById("my0MaxMin");
				break;
			case 1:
				theCanvas = document.getElementById("my1Canvas");
				theMaxMin = document.getElementById("my1MaxMin");
				break;
			case 2:
				theCanvas = document.getElementById("my2Canvas");
				theMaxMin = document.getElementById("my2MaxMin");
				break;
			case 3:
				theCanvas = document.getElementById("my3Canvas");
				theMaxMin = document.getElementById("my3MaxMin");
				break;
			case 4:
				theCanvas = document.getElementById("my4Canvas");
				theMaxMin = document.getElementById("my4MaxMin");
				break;
		}
		theContext = theCanvas.getContext("2d");
		canvasWIDTH = theCanvas.width;
		canvasHEIGHT = theCanvas.height;

	var minVal = 1000000;
	var maxVal = -1000000;
	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = elevs[x][y][i];
	    if(cellVal != null) {
	    	cellVal = cellVal*1;
			if(cellVal < minVal) {minVal = cellVal}
			if(cellVal > maxVal) {maxVal = cellVal}
		}
	}
	}
	if(maxVal > everestElevation) everestElevation = maxVal;
	if(i<=2 && minVal < deathValleyElevation) deathValleyElevation = minVal;

	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = elevs[x][y][i];
//		scale the value between min and max to 0-256
	    if(cellVal == null) {
	    	r = 255;
	    	g = 0;
	    	b = 0;
	    } else {
			cellVal = (cellVal - minVal) / (maxVal - minVal) * 256;
        	 r =  Math.floor(cellVal);
        	 g =  Math.floor(cellVal);
        	 b =  Math.floor(cellVal);
		}
        var color = "rgba("+r+","+g+","+b+",1)";

        drawCircleAt(x * 6, y * 6, color, theContext);
	}
	}
	theMaxMin.innerHTML = "Max: " + maxVal + " Min: " + minVal;
}
// Output the visible surface layers as a visual
	theCanvas = document.getElementById("mysurfGeoCanvas");
		theContext = theCanvas.getContext("2d");
		canvasWIDTH = theCanvas.width;
		canvasHEIGHT = theCanvas.height;

	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		cellElevation = -999
	    cellVal0 = elevs[x][y][0];
	    cellVal1 = elevs[x][y][1];
	    cellVal2 = elevs[x][y][2];
		
		cellElevation = cellVal0;
	    r = 250;
	    g = 230;
	    b = 200;
	    if(cellVal0 == null) {
			cellElevation = cellVal1;
	    	r = 250;
	    	g = 80;
	    	b = 80;
	    } 
	    if(cellVal1 == null) {
			cellElevation = cellVal2;
	    	r = 190;
	    	g = 190;
	    	b = 190;
	    }
			cellVal = (cellElevation - deathValleyElevation) / (everestElevation - deathValleyElevation);
        	 r =  Math.floor(cellVal*r);
        	 g =  Math.floor(cellVal*g);
        	 b =  Math.floor(cellVal*b);

        var color = "rgba("+r+","+g+","+b+",1)";

        drawCircleAt(x * 6, y * 6, color, theContext);
	}
	}


// Output the oil as a visual
  
		theCanvas = document.getElementById("myOilCanvas");
		theContext = theCanvas.getContext("2d");
		canvasWIDTH = theCanvas.width;
		canvasHEIGHT = theCanvas.height;

	var minVal = 1000000;
	var maxVal = -1000000;
	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = oil[x][y] * 1;
		if(cellVal < minVal) {minVal = cellVal}
		if(cellVal > maxVal) {maxVal = cellVal}
	}
	}

	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = oil[x][y] * 1;
//		scale the value between min and max to 0-256
	
		cellVal = (cellVal - minVal)/(maxVal - minVal)  * 256;
        var r =  255-Math.floor(cellVal);
        var g =  255-Math.floor(cellVal);
        var b =  255-Math.floor(cellVal);

        var color = "rgba("+r+","+g+","+b+",1)";

        drawCircleAt(x * 6, y * 6, color, theContext);
	}
	}
       
		theCanvas = document.getElementById("myGasCanvas");
		theContext = theCanvas.getContext("2d");
		canvasWIDTH = theCanvas.width;
		canvasHEIGHT = theCanvas.height;

	var minVal = 1000000;
	var maxVal = -1000000;
	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = gas[x][y] * 1;
		if(cellVal < minVal) {minVal = cellVal}
		if(cellVal > maxVal) {maxVal = cellVal}
	}
	}

	for( x=0; x <domainSize; ++x) {
	for( y=0; y <domainSize; ++y) {
		 
	    cellVal = gas[x][y] * 1;
//		scale the value between min and max to 0-256
	
		cellVal = (cellVal - minVal)/(maxVal - minVal)  * 256;
        var r =  255-Math.floor(cellVal);
        var g =  255-Math.floor(cellVal);
        var b =  255-Math.floor(cellVal);

        var color = "rgba("+r+","+g+","+b+",1)";

        drawCircleAt(x * 6, y * 6, color, theContext);
	}
	}
       
       
    //return true;
	return {elevs, oil, gas};
}

    //Draws circles with a 5 pixel diameter at the position specified.
    function drawCircleAt(x, y, color, aContext) {

        aContext.fillStyle = color;
        aContext.beginPath();
        aContext.arc(y, x, 4, 0, 6.283, false);
        aContext.fill();
        aContext.closePath();

    }
	
function line(x0, y0, x1, y1){
   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(true){
     setPixel(x0,y0);  // Do what you need to for this

     if ((x0==x1) && (y0==y1)) break;
     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }
}
	
	
function calcStraightLine (xStart, yStart, angle, l) {
//  function calcStraightLine (startCoordinates, endCoordinates) {
    var coordinatesArray = new Array();
    // Translate coordinates
    var x1 = xStart;
    var y1 = yStart;
    var x2 = endCoordinates.left;
    var y2 = endCoordinates.top;
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push(new Coordinates(y1, x1));
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      coordinatesArray.push(new Coordinates(y1, x1));
    }
    // Return the result
    return coordinatesArray;
  }

