var mapwidth = 900,
    mapheight = 600;
    
var projection;

var mapsvg = d3.select("#nyc_map")
    .attr("width", mapwidth)
    .attr("height", mapheight);

var zoom_group = mapsvg.append("g");	
var nyc_map_group = zoom_group.append("g");
var njc_map_group = zoom_group.append("g");
var projection = d3.geoMercator();
var path;

d3.json("data/NYC_MapInfo.geojson", function(error, NYC_MapInfo) {
	//.log(projection.scale());
	
	projection.center([40.774986, -73.946488]).angle([-55]).fitExtent([[-200, 0],[mapwidth+200, mapheight+500]], NYC_MapInfo);
	
	//console.log(projection.translate());

	//projection.scale(89382.38598763589);

	//console.log(projection.scale());

    path = d3.geoPath().projection(projection);
    
	
	nyc_map_group.selectAll("path")
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
		// .on("mouseout",function(d) {
		// 	d3.selectAll("path").style("fill-opacity","0.7");
		// });
		
	nyc_map_group.selectAll("text")
	.data(NYC_MapInfo.features)
	.enter().append("svg:text")
	.attr("dy",".35em")
	.text(function(d) {return d.properties.BoroName; })
	.attr("transform" ,function(d){
		return "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")";
	})
	.style("text-anchor","middle");
    draw_NJC_map();
	draw_points();
    
});

//create zoom handler 
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered 
function zoom_actions(){
	
	zoom_group.attr("transform", d3.event.transform);
	//console.log(projection.scale())
}

zoom_handler(mapsvg);

function draw_NJC_map (){
	d3.json("data/jerseycityzipcodegeojson.geojson", function(error, njc_map_data) {
		
		njc_map_group.selectAll("path")
		.data(njc_map_data.features)
		.enter()
		.append("path")
			.attr("d", path)
		.style("fill", "#CCC")
		.style("fill-opacity","0.7")
		// .on("mouseover",function(d) {
		// 	d3.select(this).style("fill-opacity","1");
		// })
	
	
	});
}

//##################################################################


var point_group = zoom_group.append("g");

var station_data;

function relative_difference(out_r, in_r){
	if (out_r == 0 && in_r == 0){
		return 0
	}
	//console.log((out_r - in_r)/(d3.max([out_r, in_r])));
	return (out_r - in_r)/(d3.max([out_r, in_r]));
}

function toPaddedHexString(num, len) {
	num = Math.floor(num);
	var str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

console.log(relative_difference[7,8])
console.log(relative_difference[7,8])

function color_scale(x){
	var red, blue;
	if (x>0){
		blue = 255;
		red = 255 - 255*x ;
	}
	else{
		red = 255;
		blue = 255 + 255 * x ;
	}
	rgb = '#' + toPaddedHexString(red,2) + '00' + toPaddedHexString(blue,2);
	return rgb;
}

function draw_points(){
	d3.json("data/stations_rents_outin.json", function(error, rents_out_in) {
		//console.log(rents_out_in)
		station_data =rents_out_in;
		point_group.selectAll("circle")
			.data(rents_out_in.stations)
			.enter()
			.append("circle")
				.attr("cx", function(d) {
					if (d && d.lon && d.lat) 
						 return projection([d.lon, d.lat])[0]; })
				.attr("cy", function(d) {
					if (d && d.lon && d.lat) return projection([d.lon, d.lat])[1];
				})
				.attr("r", 3)
				//.attr("class", "non_brushed")
				.style("z-index", 4)
				.style("position", "relative")
				.style("fill", "yellow")
				.style("stroke", "gray")
				.style("stroke-width", 0.25)
				.style("opacity", 0.75)
			.append("title") 
				.text(function(d) {
					return d.name; });


			update_poits();
	});


}


function update_poits(){
	//console.log(station_data.values[0])

	out_in = station_data.values[100]
	
	point_group.selectAll("circle")
		.data(out_in)
		.style("fill", function(d){
			//console.log(d,(d[0] - d[1])/(d3.max([d[0], d[1]])),color_scale(relative_difference(d[0],d[1])))
			return color_scale(relative_difference(d[0],d[1]));
		} )
		.selectAll("title")
    		.text(function(d,i){
				//console.log(i, out_in[d.o][0])
				return d.name + "in: " + out_in[d.o][1] + " out: " + out_in[d.o][0];
			});
		
}

