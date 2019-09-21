var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = "/tweetsloc";

d3.json(url, function(response) {

  // console.log(response);

  var heatArray = [];

  console.log(response.lat.length)


  for (var i = 0; i < response.lat.length; i++) {

    // console.log('IN FOR **************')
    // console.log(response.lat[i])
    // console.log(response.lon[i])

    heatArray.push([response.lat[i], response.lon[i]]);
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});
