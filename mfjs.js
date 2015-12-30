var circles, largeNodeCircle, color = d3.scale.category20(),
    colorDeactivated = false,
    maX = 0,
    maY = 0,
    miX = 0,
    miY = 0,
    alpha = 100;
var arrayOfVerts=[];
var arrayOfColors=[];
var arrayOfMesh=[];
function updateColor() {
    if (!colorDeactivated) {
        circles.attr("fill", function(d) {
            return color(d.Type)
        })
        largeNodeCircle.attr("opacity", "0")
	colorDeactivated = true;
    } else if (colorDeactivated) {
        colorDeactivated = false;
        circles.attr("fill", function(d) {
            return color(eval("d['" + colorInput + "']"))
        })
        largeNodeCircle.attr("opacity", "1")
    }
}
function returnCentroid(node, data) {
    var exists = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].Color == eval("node['" + colorInput + "']")) {
            exists = 1;
            if (eval("node['" + yAxisInput + "']") && eval("node['" + xAxisInput + "']")) {
                data[i].averageX = (data[i].averageX * data[i].Number + parseFloat(eval("node['" + xAxisInput + "']"))) / (data[i].Number + 1)
                data[i].averageY = (data[i].averageY * data[i].Number + parseFloat(eval("node['" + yAxisInput + "']"))) / (data[i].Number + 1)
                data[i].Number+=3;
                break;
            }  
        }
    }
    if (exists == 0) data.push({
        'Color': eval("node['" + colorInput + "']"),
        'Number': 1,
        'averageX': eval("node['" + xAxisInput + "']"),
        'averageY': eval("node['" + yAxisInput + "']"),
        'Centroid': true
    })
    return data;
}
var height = 1500,
    width = 1500;
var voronoi, vertices;

//for triangulation
dsq = function(a,b) {
     var dx = a[0]-b[0], dy = a[1]-b[1];
     return dx*dx+dy*dy;
 },
asq = alpha*alpha,


//LOAD THE DATA!!!!
d3.csv("final_no_headers.csv", function(data) {
       
    //set up voronoi
    voronoi = d3.geom.voronoi()
	.clipExtent([[0, 0], [width, height]]);
       
    //filter out bad data
    function datafilter(data) {
        if (!data) return false;
	else if (data == "*") return false;
	else if (parseFloat(data)==0)return false;
	else return true
	
    }
    for (var a = data.length - 1; a >= 0; a--) {
	try{
	    if (!(datafilter(eval("data[a]['" + xAxisInput + "']")) && datafilter(eval("data[a]['" + yAxisInput + "']")) && datafilter(eval("data[a]['" + colorInput + "']")))){
		data.splice(a, 1);
	    }
	}
	catch(e){
	    data.splice(a, 1);
	}
	
    }
    
    //maxes of data
    function findMaxesofData() {
	for (var a = 0; a < data.length; a++) {
            if (parseFloat(eval("data[a]['" + xAxisInput + "']")) > maX) maX = parseFloat(eval("data[a]['" + xAxisInput + "']"))
            if (parseFloat(eval("data[a]['" + yAxisInput + "']")) > maY) maY = parseFloat(eval("data[a]['" + yAxisInput + "']"))
	}
    }
    //mins of data
    function findMinsofData(){
	for (var a = 0; a < data.length; a++) {
            if (parseFloat(eval("data[a]['" + xAxisInput + "']")) < miX) miX = parseFloat(eval("data[a]['" + xAxisInput + "']"))
            if (parseFloat(eval("data[a]['" + yAxisInput + "']")) < miY) miY = parseFloat(eval("data[a]['" + yAxisInput + "']"))
       }
    }
    
    //find maxes of data before creating scales
    findMaxesofData();
    miY=maY;
    miX=maX;
    findMinsofData();
    
    var scaleX = d3.scale.log()
	.range([0, width])
	.domain([miX, maX]);
    
    
    var scaleY = d3.scale.log()
	.range([height, 0])
	.domain([miY, maY]);
    
    
    var replaceData=data;
    
    if(graphType==="Voronoi Tesselation"){
	vertices=replaceData.map(function(d){
            return [scaleX(parseFloat(eval("d['"+xAxisInput+"']"))), scaleY(parseFloat(eval("d['"+yAxisInput+"']"))),{color: color(eval("d['"+colorInput+"']"))}];
	});
	
    }
    
    if(graphType==="Delunay Trangulation Hull"){
	for (var a=0; a< replaceData.length; a++){
	    if(arrayOfColors.indexOf(eval("replaceData[a]['"+colorInput+"']"))===-1){
		arrayOfColors.push(eval("replaceData[a]['"+colorInput+"']"));
	    }
	}
	for(var a=0; a<arrayOfColors.length; a++){
	    try{
		var toPush=
		    d3.geom.delaunay(
			replaceData
			    .map(function(d){
				return [scaleX(parseFloat(eval("d['"+xAxisInput+"']"))),
					scaleY(parseFloat(eval("d['"+yAxisInput+"']"))),
					{color: eval("d['"+colorInput+"']")}];
			    })
			    .filter(function(d){
				return eval("d[2]['color']")==arrayOfColors[a]? true:false;
			    }))	     
		    .filter(function(t) {
			return dsq(t[0],t[1]) < asq && dsq(t[0],t[2]) < asq && dsq(t[1],t[2]) < asq;
		    })
		arrayOfMesh.push(toPush);
		
	    }
	    catch(e){
		console.log("oh well");
	    }
	}
    }
    function tickFinderX(number){return miX+((maX-miX)/Math.pow(10, 5-number))}
    function tickFinderY(number){return miY+((maY-miY)/Math.pow(10, 5-number))}
    
    var zoom = d3.behavior.zoom().scaleExtent([0, 100])
	.on("zoom", zoomed);
    
    var formatter = d3.format("0.2r");
    var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient("bottom")
	.tickSize(1, 1)
	.tickFormat(function(d) {
            return formatter(d)
	})
	.tickValues([tickFinderX(1), tickFinderX(2), tickFinderX(3), tickFinderX(4), tickFinderX(5)])
    var formatter2 = d3.format("0.2r");
    var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient("left")
	.tickSize(1, 1)
	.tickFormat(function(d) {
            return  formatter2(d)
	})
	.tickValues([tickFinderY(1), tickFinderY(2), tickFinderY(3), tickFinderY(4), tickFinderY(5)])
    var canvas = d3.select("body")
	.append("svg")
	.attr("width", width + 200)
	.attr("height", height + 200)
	.call(zoom)
	.append("g")
	.attr("transform", "translate(100, 100)")
    if(graphType==="Voronoi Tesselation"){
	var path = canvas.selectAll("path").data(voronoi(vertices), polygon).enter().append("path")
	    .attr("fill", function(d, i) {
		try{
		    return d["point"][2]["color"];
		}catch(e){
		    return "#EEE";	
		}	
	    })
	    .attr("d", polygon)
    }   
    function polygon(d) {
	try {
	    return "M" + d.join("L") + "Z";
	}
	catch(e){
	    console.log("oh well");
	}
    }
    if(graphType==="Delunay Trangulation Hull"){
	var totalMesh=[];
	for(var a=0; a<arrayOfMesh.length; a++){
	    totalMesh=totalMesh.concat(arrayOfMesh[a]);
	}
	console.log(totalMesh);
	var path=canvas
	    .selectAll("path")
	    .data(totalMesh).enter().append("path")
	    .attr("d", function(d) {
		return "M" + d[0][0]+","+d[0][1]+"L"+d[1][0]+","+d[1][1]+"L"+d[2][0]+","+d[2][1]+"Z";
	    })
	    .attr("fill", function(d){
		console.log(d[0][2]["color"]);
		return color(d[0][2]["color"])
	    })
	    .attr("class", function(d){return d[0][2]["color"]})
		.attr("opacity", "0.5");

	

	
    }
    function zoomed() {
	canvas.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    canvas.on("mouseup", mouseup);
    canvas.append("g").attr("class", "x axis").call(xAxis).attr("transform", "translate(0," + height + ")");
    canvas.append("g").attr("class", "y axis").call(yAxis);
    
    var text1 = canvas.append("text").text(yAxisInput).attr("x", -height / 2).attr("y", "-70").attr("style", "font-size:30px").attr('transform', 'rotate(-90)')
    
    var text1 = canvas.append("text").text("Single Diodes").attr("x", height / 2).attr("y", "-70").attr("style", "font-size:30px")
    
    var text2 = canvas.append("text").text(xAxisInput).attr("x", width / 2).attr("y", height + 50).attr("style", "font-size:30px")
    if(graphType==="Centroids"||graphType==="Regular Scatter"){
	var nodes = canvas.selectAll(".node")
	    .data(data).enter()
	    .append("g")
	    .attr("class", "node")
	circles = nodes.append("circle")
	    .attr("cx", function(d) {
		return scaleX(eval("d['" + xAxisInput + "']"))
	    })
	    .attr("cy", function(d) {
		return scaleY(eval("d['" + yAxisInput + "']"))
	    })
	    .attr("r", "3")
	    .attr("fill", function(d) {
		return color(eval("d['" + colorInput + "']"))
	    })
	    .on("mousedown", function(d) {
		mousedown(eval("d['" + colorInput + "']"))
	    })
	
	nodes.append("title").text(function(d) {
	    return eval("d['" + colorInput + "']")
	});
    }
    if (graphType==="Centroids"){
	var largeNodeData = []
	for (var i = 0; i < data.length; i++) {
	    if (eval("data[i]['" + yAxisInput + "']") != "?" && eval("data[i]['" + xAxisInput + "']") != "?") {
		largeNodeData = returnCentroid(data[i], largeNodeData);
	    }
	}
	var largeNode = canvas.selectAll(".largeNode")
	    .data(largeNodeData)
	    .enter()
	    .append("g")
	    .attr("class", "largeNode")
	
	largeNodeCircle = largeNode.append("circle")
	    .filter(function(d) {
		return parseFloat(d.Number) >= 2
            })
	    .attr("cx", function(d) {
		return scaleX(d.averageX)
	    })
	    .attr("cy", function(d) {
		return scaleY(d.averageY)
	    })
	    .attr("r", function(d) {
		return Math.sqrt(parseFloat(d.Number))
	    })
	    .attr("fill", function(d) {
		return color(d.Color)
	    })
	    .on("mousedown", function(d) {
		mousedown(d.Color)
	    })
	largeNode.append("title").text(function(d) {
	    return d.Color;
    });
	
    
    }
    function mousedown(man) {
	if (!colorDeactivated) {
	    
            circles.attr("opacity", function(d) {
		return eval("d['" + colorInput + "']") === man ? color(eval("d['" + colorInput + "']")) : "0"
            })
            largeNodeCircle.attr("opacity", function(d) {
		return d.Color === man ? color(d.Color) : "0"
            })
	}	
    }
    function mouseup() {
	if (!colorDeactivated) {
	    
            circles.attr("opacity", function(d) {
		return "1"
            })
            largeNodeCircle.attr("opacity", function(d) {
		return "1"
            })
	}
    }
})
