d3.csv("final_no_headers.csv", function(data) {
    $(document).ready(function(){
	
	$("form").append("Input the X axis (numbers) <select class='x' name='xAxisInput'></select><br>")
	$("form").append("Input the Y axis (numbers) <select class='y' name='yAxisInput'></select><br>")
	$("form").append("Input a color charactaristic (nominal) <select class='c' name='color'></select><br>")
	$("form").append("Input the type of graph you want to view <select class='t' name=type></select><br>");
	
	var keys=Object.keys(data[0])
	for(var a=0; a<keys.length-1; a++){
	    $(".y").append("<option value='"+keys[a]+"'>"+keys[a]+"</option>");
	    $(".x").append("<option value='"+keys[a]+"'>"+keys[a]+"</option>");
	    $(".c").append("<option value='"+keys[a]+"'>"+keys[a]+"</option>");
	}
	$(".t").append("<option value= 'Regular Scatter'>Regular Scatter</option>");
	$(".t").append("<option value='Voronoi Tesselation'>Voronoi Tesselation</option>");
	$(".t").append("<option value='Centroids'>Centroids</option>");
	$(".t").append("<option value='Delunay Trangulation Hull'>Delunay Trangulation Hull</option>");
	$("form").append("<button name='updateButton' tpye='submit'>Update</button>");
    })
    
    
});
