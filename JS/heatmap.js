var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = "/tweetsloc";

console.log('I AM IN MAP ******')
console.log(url)

//d3.json(url).then(function(response) {
d3.json(url, function(response) {

  console.log(response);

  console.log(response.length)

  var heat = L.heatLayer(response, {
    radius: 20,
    blur: 5
  }).addTo(myMap);

});
