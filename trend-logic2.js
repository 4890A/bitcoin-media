// console.log(trendData[104].date)
// console.log(trendData[104].countries[219].latlng)
// console.log(trendData[104].countries[219].trend_value)
// console.log(trendData[104].countries[219].name)
// console.log(trendData[104].countries.length)

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

trendCircles = []
dateRowNum = 1
for (var i = 0; i < trendData[dateRowNum].countries.length; i++) {

// console.log(trendData[dateRowNum].countries[i])
// console.log(trendData[dateRowNum].countries[i].latlng)
// console.log(trendData[dateRowNum].countries[i].trendValue)

  if (trendData[dateRowNum].countries[i].trendValue > 0) {
    trendCircle = L.circle(trendData[dateRowNum].countries[i].latlng, {
        fillOpacity: 0.75,
        color: "red",
        fillColor: "white",
        // Adjust radius
        radius: trendData[dateRowNum].countries[i].trendValue * 5000
      }).bindPopup() //.addTo(myMap);
    trendCircles.push(trendCircle);
  };
};

var worldMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
  })  // .addTo(myMap);
  
var trendOverlay = L.layerGroup(trendCircles);

var baseMap = {"World Map": worldMap};

var overlayMap = {"Google Trends": trendOverlay};

var myMap = L.map("map", {
  center: [15.5994, 0.6731],
  zoom: 2.3,
  layers: [worldMap, trendOverlay]
});

L.control.layers(baseMap, overlayMap, {collapsed: false
}).addTo(myMap);

// Usage!
sleep(2000).then(() => {
  // Do something after the sleep!
  console.log("Sleeping")
  trendOverlay.clearLayers()
});



// }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);

// for (var i = 0; i < trendD.length; i++) {

//   // Conditionals for countries points
//   var color = "";
//   if (countries[i].points > 200) {
//     color = "yellow";
//   }
//   else if (countries[i].points > 100) {
//     color = "blue";
//   }
//   else if (countries[i].points > 90) {
//     color = "green";
//   }
//   else {
//     color = "red";
//   }

// var heatArray = [];
// heatArray.push([25.787600, -80.263114]);
// console.log(heatArray)

// var heat = L.heatLayer(heatArray, {
//   radius: 20,
//   blur: 35
// }).addTo(myMap);