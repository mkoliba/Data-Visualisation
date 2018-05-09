var mapwidth = 900,
    mapheight = 600;
    
var projection;

var mapsvg = d3.select("#nyc_map")
    .attr("id", "Map")
    .attr("width", mapwidth)
    .attr("height", mapheight) 
    ;

    g = mapsvg.append("g");


d3.json("data/NYC_MapInfo.geojson", function(error, NYC_MapInfo) {


    var projection = d3.geoMercator().rotate([0, -55, 0]).fitSize([mapwidth, mapheight*1.7], NYC_MapInfo);

    var path = d3.geoPath().projection(projection);
    

      
	
	g = mapsvg.append("g");
	
	g.selectAll("path")
		.data(NYC_MapInfo.features)
		.enter()
		.append("path")
    		.attr("d", path)
		.style("fill", function(d) {
			var BoroName = d.properties.BoroName;
			if (BoroName == "Staten Island") return "#ffdead";
			else if (BoroName == "Queens") return "#53868b";
			else if (BoroName == "Brooklyn") return "#2F4F4F";
			else if (BoroName == "Manhattan") return "#006400";
			else if (BoroName == "Bronx") return "#6c7b8b";
			else return "#CCC";
        })
        .attr("class", function(d) {
			var BoroName = d.properties.BoroName;
			if (BoroName == "Staten Island") return "Staten-Island";
			else if (BoroName == "Queens") return "Queens";
			else if (BoroName == "Brooklyn") return "Brooklyn";
			else if (BoroName == "Manhattan") return "Manhattan";
			else if (BoroName == "Bronx") return "Bronx";
			else return "other";
		})
		.style("fill-opacity","0.7")
		.on("mouseover",function(d) {
			d3.select(this).style("fill-opacity","1");
		})
		.on("mouseout",function(d) {
			d3.selectAll("path").style("fill-opacity","0.7");
		});
		
	g.selectAll("text")
	.data(NYC_MapInfo.features)
	.enter().append("svg:text")
	.attr("dy",".35em")
	.text(function(d) {return d.properties.BoroName; })
	.attr("transform" ,function(d){
		return "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")";
	})
	.style("text-anchor","middle");
    
    
    
});

//create zoom handler 
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered 
function zoom_actions(){
 g.attr("transform", d3.event.transform);
}

zoom_handler(mapsvg);