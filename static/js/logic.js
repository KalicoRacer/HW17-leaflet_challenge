// USGS earthquake data provided in GeoJSON
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define the GeoJSON Marker Options
// Function to determine marker size based on magnitude of the earthquake
function markerSize(magnitude) {
    return magnitude * 5;
}

function markerColor(magnitude) {
    return  magnitude > 5 ? "red":
            magnitude > 4 ? "orange":
            magnitude > 3 ? "gold":
            magnitude > 2 ? "yellow":
            magnitude > 1 ? "yellowgreen":
                            "greenyellow"; // <= 1 default
}

// Grabbing our GeoJSON data...
$.getJSON(link, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeatureCircle(feature, layer) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
    }

    function onEachFeaturePopup(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeaturePopup,
        pointToLayer: onEachFeatureCircle
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define background map layer
    var lightmap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
        attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    });

    var darkmap = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
        attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [39.5296, -119.8138],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
