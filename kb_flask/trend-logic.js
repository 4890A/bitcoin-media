// Create variable for url to read data from html propagated by main application
var url = `/googletrends`;
d3.json(url, function(trendData) {

  // Create/initialize variables to used in later loops
  var numCountries = trendData[0].countries.length
  var dataCounter = 0

  // Establish base map tilelayer from Mapbox
  var worldMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

  // Create a function to create one layer of Google Trend circles for one date, 
  // establishing a circle for each countries with a trend score > 0
  trendCircles = [];
  function createTrendCircles(data, trendCircles) {
    
      for (var i = 0; i < numCountries; i++) {
        trendValue = data[dataCounter].countries[i].trendValue
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
            color = "purple"
            fillColor = "purple";
          }

        // Create the circle
        trendCircle = L.circle(data[dataCounter].countries[i].latlng, {
            fillOpacity: 0.75,
            color: color,//"red",
            fillColor: fillColor, //"white",
            // Adjust radius
            radius: trendValue * 10000
          }).bindPopup("<h1>" + data[dataCounter].countries[i].name + 
              "</h1> <hr> <h3>Trend Value: " + data[dataCounter].countries[i].trendValue + "</h3>")
        trendCircles.push(trendCircle);
      };
    };
    dataCounter++;
    // Return the trendCircles array to be added to a map overlay
    return trendCircles
  };

  // Call createTrendCircles function to get first overlayer and initialize the map with and add overlayer
  trendCircles = [];
  createTrendCircles(trendData, trendCircles);

  var trendOverlay = L.layerGroup(trendCircles);
  var baseMap = {"World Map": worldMap};
  var overlayMap = {"Google Trends": trendOverlay};

  var myMap = L.map("map", {
    center: [15.5994, 0.6731],
    zoom: 2.3,
    layers: [worldMap, trendOverlay]
  });

  L.control.layers(baseMap, overlayMap, {collapsed: true}).addTo(myMap);


  // Text box to add a title at bottom of page
  L.Control.textbox = L.Control.extend({
    onAdd: function(myMap) {
    var text = L.DomUtil.create('div');
    text.id = "info_text";
    text.innerHTML = "<h2 style='color:#f95700; font-size:50px;'>Bitcoin Trending on Google 2011–2019</h2>"
    return text;
    },
    onRemove: function(myMap) { // continue
    }
  });
  L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
  L.control.textbox({ position: 'bottomleft' }).addTo(myMap);

  // Now cycle through the rest of the data points, removing and adding layers every 100 ms
  // This happens as soon as screen loads
  var trendInterval = setInterval(function() {

    trendOverlay.clearLayers()
    trendCircles = []
    createTrendCircles(trendData, trendCircles);
    trendOverlay = L.layerGroup(trendCircles).addTo(myMap)

    if (dataCounter === trendData.length) {
        clearInterval(trendInterval)
    }
  }, 100);


  /* Create a legend to show values per circle color */
  var trendLegend = L.control({ position: "bottomright" });
    // Assemble html text to create the legend values
  innerHTML2 = "<h5>Trend Values</h5>";
  innerHTML2 += "<i style='background: red'></i><span><strong>80–100</strong></span><br>";
  innerHTML2 += "<i style='background: orange'></i><span><strong>60–80</strong></span><br>";
  innerHTML2 += "<i style='background: yellow'></i><span><strong>40–60</strong></span><br>";
  innerHTML2 += "<i style='background: green'></i><span><strong>20–40</strong></span><br>";
  innerHTML2 += "<i style='background: purple'></i><span><strong>0–20</strong></span><br>";

  trendLegend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML = innerHTML2;
    return div;
  };
  trendLegend.addTo(myMap);

  // Allow user input to display a single month's data
  var years = ["2012","2013","2014","2015","2016","2017","2018","2019"]
  var months = ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  // Load years into Year dropdown menu
  var tyears = d3.select("#exampleFormControlSelect1");
  tyears.html("");
  var row5 = tyears.append('option').text("2011");

  years.forEach(function(year) {
      row5 = tyears.append('option').text(year);
  });    

  // Load months into Month dropdown menu
  var tmonths = d3.select("#exampleFormControlSelect2");
  tmonths.html("");
  var row5 = tmonths.append('option').text("Jan");

  months.forEach(function(month) {
      row5 = tmonths.append('option').text(month);
  });    

  // When user clicks "Display Month" button, get year and month values
  var button = d3.select("#filter-btn");

  // Function to execute when Display Month button is clicked
  button.on("click", function() {

      // Retrieve date and month in user input fields
      var inputYear1 = d3.select("#exampleFormControlSelect1");
      var inputYear = inputYear1.property("value");
      var inputMonth1 = d3.select("#exampleFormControlSelect2");
      var inputMonthAlpha = inputMonth1.property("value");

      if (inputYear === "2019" && 
        (inputMonthAlpha === "Oct" || inputMonthAlpha === "Nov" || inputMonthAlpha === "Dec")) {
          alert("Data collection ended in September of 2019. Please choose another date.")
      }

      // Switch input month to numeric month to match data
      var inputMonthNumeric = ""

      switch(inputMonthAlpha)
      {case "Jan": inputMonthNumeric = "01"; break
      case "Feb": inputMonthNumeric = "02"; break
      case "Mar": inputMonthNumeric = "03"; break
      case "Apr": inputMonthNumeric = "04"; break
      case "May": inputMonthNumeric = "05"; break
      case "Jun": inputMonthNumeric = "06"; break
      case "Jul": inputMonthNumeric = "07"; break
      case "Aug": inputMonthNumeric = "08"; break
      case "Sep": inputMonthNumeric = "09"; break
      case "Oct": inputMonthNumeric = "10"; break
      case "Nov": inputMonthNumeric = "11"; break
      case "Dec": inputMonthNumeric = "12"; break
      }

      // Assemble date variable for the filter on the data
      var userDate = inputYear + "-" + inputMonthNumeric

      // Pull out the data matching the user input
      var filteredData = trendData.filter(filterBy => {
        return ((filterBy.date === userDate))});

      dataCounter = 0;
      trendOverlay.clearLayers();
      trendCircles = [];
      createTrendCircles(filteredData, trendCircles);
      trendOverlay = L.layerGroup(trendCircles).addTo(myMap)
    
  });  // end onbuttonclick Display one Month


  // When user clicks "Rerun Months" button, cycle through all months
  var button1 = d3.select("#filter-btn1");

  button1.on("click", function() {
      dataCounter = 0;
      var trendInterval = setInterval(function() {
        trendOverlay.clearLayers()
        trendCircles = []
        createTrendCircles(trendData, trendCircles);
        trendOverlay = L.layerGroup(trendCircles).addTo(myMap)

        if (dataCounter === trendData.length) {
            clearInterval(trendInterval)
        }
      }, 100);

  });

});