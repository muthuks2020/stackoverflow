function sinh(x){
  return (Math.exp(x) - Math.exp(-x))/2;
} 
    
function asinh(x){
  var num = +x;
  return (Math.log(num + Math.sqrt(num*num + 1)));
}

function asinhLegend(startColor, stopColor, asinhStartVal, asinhStopVal){
	var svgWidth = 100,
    	svgHeight = 300,
    	x1 = 5,
    	barWidth = 30,
    	y1 = 20,
    	barHeight = 200,
    	numberTiles = 100,
    	//numberScaleLines = 5,
    	numberTicks = 5,
    	tickLength = 5,
    	tickWidth = 1;
    	//tickFontSize = 12;
    
    var tileHeight = barHeight/numberTiles;
    
    // bigger value alvays at the top of the legend
    if (asinhStartVal > asinhStopVal){
    	var smaller = asinhStopVal;
    	var asinhStopVal = asinhStartVal;
    	var asinhStartVal = smaller;
    };
    
	// append empty svg container
	var container = d3.select("#theBar").append("svg")
		.attr("class", "legend")
		.attr("width", svgWidth)
		.attr("height", svgHeight);
			    
    function maxRound(asinhStartSep,asinhStopSep){
    	var start = sinh(asinhStartSep);
    	var stop = sinh(asinhStopSep);
    	var scale = Math.floor(Math.log10(Math.abs(start - stop)));
    	
    	var uniDiff = (stop - start) / Math.pow(10,scale); // unified distance value in [1, 10)
    	// floor(unidiff) == how many possible ticks between start and stop in current scale
    	// if uniDiff < 2, there is a space for only one tick and it may overlap with previous or next one
    	// so it need to be fixed: scale should be smaller
    	
    	if (uniDiff < 2){
    		scale = scale - 1;
    	};
    	
    	var digits = Math.max(-1*scale,0) // digits after comma;
    	var rounded = Math.floor(stop / Math.pow(10,scale))*Math.pow(10,scale);
    	return d3.format("." + digits +"f")(rounded);
    };
    
    function minRound(asinhStartSep,asinhStopSep){
    	var start = sinh(asinhStartSep);
    	var stop = sinh(asinhStopSep);
    	var scale = Math.floor(Math.log10(Math.abs(start - stop)));
    	
    	var uniDiff = (stop - start) / Math.pow(10,scale); // unified distance value in [1, 10)
    	// floor(unidiff) == how many possible ticks between start and stop in current scale
    	// if uniDiff < 2, there is a space for only one tick and it may overlap with previous or next one
    	// so it need to be fixed: scale should be smaller
    	
    	if (uniDiff < 2){
    		scale = scale - 1;
    	};
    	
    	var digits = Math.max(-1*scale,0) // digits after comma;
    	var rounded = Math.ceil(start / Math.pow(10,scale))*Math.pow(10,scale);
    	return d3.format("." + digits +"f")(rounded);
    };
    
    // check if there is variance in values
    if (asinhStartVal == asinhStopVal){
    	console.log("start == stop!!!");
    	console.log("asinhStartVal = ", asinhStartVal);
    	console.log("asinhStopVal = ", asinhStopVal);
    	
    	// change scale min/max values
    	var val = asinhStartVal;
    	asinhStartVal = val - 1;
    	asinhStopVal = val + 1;
    	
    	// monochromatic legend
    	startColor = stopColor;
    	
    	var tickSeq = [sinh(val)];
    	

    }
    else{
        var sepSeq = []; // sequence of separators (uniformly in asinh scale)
    	for (var i = 0; i < numberTicks; i++){
    		sepSeq.push(asinhStartVal + (asinhStopVal - asinhStartVal)*i/(numberTicks - 1));
   		};
    
    	var tickSeq = [minRound(sepSeq[0], sepSeq[1])];  
     
    	for (var i = 0; i < (numberTicks - 1); i++){
    		tickSeq.push(maxRound(sepSeq[i], sepSeq[i+1]))
		};    
    };
    
    
    // counting back original values
    var startVal = sinh(asinhStartVal);
    var stopVal = sinh(asinhStopVal);
    
    var color = d3.scale.linear()  
      .domain([y1 + barHeight, y1])
      .range([startColor, stopColor]);
      
	var linPosition = d3.scale.linear()  
      .domain([startVal, stopVal])
      .range([y1 + barHeight, y1]);
      
    var linBase = d3.scale.linear()  
      .domain([0, 1])
      .range([startVal, stopVal]);
      
    var asinhlinPosition = d3.scale.linear()  
      .domain([asinhStartVal, asinhStopVal])
      .range([y1 + barHeight, y1]);
    
    var ticks = container.append("g")
   		.attr("class", "axis");
    
	// add scale labels		
	ticks.selectAll("text") 
    		.data(tickSeq)
    		.enter()
    		.append("text")
    		.text(function(d){
    			return(d);
    		})
    		.attr("x", x1 + barWidth + 10)
    		.attr("y", function(d){
    			return asinhlinPosition(asinh(d)) + 5;
    		});

    
    // add scale lines		
    ticks.selectAll("line") 
    		.data(tickSeq)
    		.enter()
    		.append("line")
    		.attr("stroke","rgb(0,0,0)")
    		.attr("stroke-width", tickWidth)
    		.attr("x1", x1 + barWidth)
    		.attr("x2", x1 + barWidth + tickLength)
    		.attr("y1", function(d){
    			return asinhlinPosition(asinh(d));
    		})
    		.attr("y2", function(d){
    			return asinhlinPosition(asinh(d));
    		});
			 

	var y = y1 + barHeight; 
	for (var i=0; i<numberTiles; i++){
		y -= barHeight/numberTiles; 
		container.append("rect")
			.attr("x", x1)
			.attr("y", y)
			.attr("width", barWidth)
			.attr("height", tileHeight +0.5)
			.attr("fill", color(y));
	}
			
}


