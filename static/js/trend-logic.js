var url = `/googletrends`;

d3.json(url, function(trendData) {

var numCountries = trendData[0].countries.length
var dataCounter = 0

var worldMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
  });

// console.log(dataCounter)
// console.log(trendData[dataCounter].date)
// console.log(trendData[dataCounter].countries[i])
// console.log(trendData[dataCounter].countries[i].latlng)
// console.log(trendData[dataCounter].countries[i].trendValue)
trendCircles = [];

// #8E133B  #B9524C #DA8458 #EEAB65  #F6CA70 #F1DF80  

function createTrendCircles(trendCircles) {
  
    for (var i = 0; i < numCountries; i++) {
    trendValue = trendData[dataCounter].countries[i].trendValue
    if (trendValue > 0) {
      var color = "";
      var fillColor = "";
      if (trendValue > 80) {
        color = "red"
        fillColor = "red";
      }
      else if (trendValue > 60) {
        color = "orange"
        fillColor = "orange";
      }
      else if (trendValue > 40) {
        color = "yellow"
        fillColor = "yellow";
      }
      else if (trendValue > 20) {
        color = "green"
        fillColor = "green";
      }
      else {
        color = "violet"
        fillColor = "violet";
      }

      trendCircle = L.circle(trendData[dataCounter].countries[i].latlng, {
          fillOpacity: 0.75,
          color: color,//"red",
          fillColor: fillColor, //"white",
          // Adjust radius
          radius: trendValue * 10000
        }).bindPopup("<h1>" + trendData[dataCounter].countries[i].name + "</h1> <hr> <h3>Trend Value: " + trendData[dataCounter].countries[i].trendValue + "</h3>") //.addTo(myMap);
      trendCircles.push(trendCircle);
    };
  };
  dataCounter++;
  return trendCircles
};

trendCircles = [];
createTrendCircles(trendCircles);

var trendOverlay = L.layerGroup(trendCircles);
var baseMap = {"World Map": worldMap};
var overlayMap = {"Google Trends": trendOverlay};

var myMap = L.map("map", {
  center: [15.5994, 0.6731],
  zoom: 2.3,
  layers: [worldMap, trendOverlay]
});

L.control.layers(baseMap, overlayMap, {collapsed: false}).addTo(myMap);

var trendInterval = setInterval(function() {
  // console.log("inside trendInterval; datacounter = " + dataCounter)

  trendOverlay.clearLayers()
  trendCircles = []
  createTrendCircles(trendCircles);
  trendOverlay = L.layerGroup(trendCircles).addTo(myMap)

  if (dataCounter === trendData.length) {
    clearInterval(trendInterval)
  }
}, 100);

});