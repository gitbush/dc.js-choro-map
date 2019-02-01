queue()
    .defer(d3.csv, "data/london-boroughs.csv")
    .defer(d3.json, "data/london-boroughs-geo.json")
    .await(makeGraphs);


function makeGraphs(error, londonCsv, londonGeo){

    // crossfilter csv data
    let cf = crossfilter(londonCsv);

    //  call choropleth map function
    choroMap(cf, londonGeo);

    // dc.js render all graphs
    dc.renderAll(); 
}


function choroMap(cf, londonGeo) {
    
    //  create dimension 
    let geoAreaNameDim = cf.dimension(dc.pluck("Area_name"));
    //  create group
    let geoPopGroup = geoAreaNameDim.group(dc.pluck("GLA_Population_Estimate_2017"));
    // create centre and projection
    let centre = d3.geo.centroid(londonGeo);
    let projection = d3.geo.mercator().center(centre).scale(35000).translate([250,200]);
    // declare dc.js choropleth chart class in a variable  
    let choroChart = dc.geoChoroplethChart("#choro-map");
    
    choroChart
        .width(550)
        .height(400)
        .dimension(geoAreaNameDim)
        .group(geoPopGroup)
        .projection(projection)
        .overlayGeoJson(londonGeo.features, "area", function(d){
            return d.properties.LAD13NM;
        });
}