function tcomments (ptweets, tplace) {

    // Present top current comment from Twetter
  
    var pdata = d3.select(tplace);
      
    // Use `.html("") to clear any existing metadata
    pdata.html("");

    console.log("LENGTH OF ARRAY: ", ptweets.length);
  
    if (ptweets.length < 1){
      pdata.append("p").text("No comments at this moment");
    }
    else { 
    Object.entries(ptweets).forEach(([key, value]) => {
  
      valuel = `${key}: ${value.text};`
      pdata.append("p").text(valuel);
  
    });
    };
  
};
  

  function buildPieChart(datapie, placepie) {

    console.log("CREATING PIE ********");
    console.log(datapie);

    var data = [{
        values: datapie,
        labels: ['Neutral', 'Negative', 'Positive'],
        type: 'pie'
      }];
      
      var layout = {
        height: 400,
        width: 500
      };
      
      Plotly.newPlot(placepie, data, layout);
  }

  function writeNtweets (ntweets, placet) {

    //Get reference to place where number of tweets will go
    
    var ptweets = d3.select(placet);

    //Clean place to write number of tweets
    ptweets.html("");

    text1 = `Number of Tweets: ${ntweets}.`;
    console.log(text1);

    //Write string including number of tweets
    ptweets.append("p").text(text1).classed("title3", true);

    };

  function buildLineChart(placel){

    var trace1 = {
      type: "scatter",
      mode: "lines",
      //mode: "markers",
      name: "Negative",
      x: names1,
      y: neg1,
      // line: {color: "#17BECF"},
      line: {color: "green"},
      marker: { color:"#17BECF", simbol: "diamond-x"}
    };

    var trace2 = {
      type: "scatter",
      mode: "lines",
      //mode: "markers",
      name: "Positive",
      x: names1,
      y: pos1,
      // line: {color: "blue"},
      line: {color: "orange"},
      marker: { color:"blue", simbol: "hexagram"}
    };

    var trace3 = {
      type: "scatter",
      mode: "lines",
      //mode: "markers",
      name: "Neutral",
      x: names1,
      y: neu1,
      // line: {color: "red"},
      line: {color: "blue"},
      marker: { color:"red", simbol: "cross"}
    };

    var data = [trace1, trace2, trace3];

    var layout = {
      title: "BITCOIN Tweets % Split",
      xaxis: {title: "Number of Point"},
      yaxis: {title: "% of Total"}
      // xaxis: {
      //   range: [startDate, endDate],
      //   type: "date"
      // },
      // yaxis: {
      //   autorange: true,
      //   type: "linear"
      // }
    };

    Plotly.newPlot(placel, data, layout);
  };

  function readtweetsnow() {
    
    var url2 = "/readtweets"

    console.log("->  READING NEW TWEETS ********************");

    // var ntweets = 0;

    d3.json(url2).then(function(tweetsnow) {
  
      var datapie2 = [tweetsnow.nsentiment.neutral, tweetsnow.nsentiment.negative, tweetsnow.nsentiment.positve]

      console.log("POSITIVE: ",tweetsnow.nsentiment.positve)
      var placepie2 = "pie2";

      buildPieChart(datapie2, placepie2);

      var ntweets = tweetsnow.nsentiment.neutral + tweetsnow.nsentiment.negative + tweetsnow.nsentiment.positve
      var placet = "#ntw1";

      neg1.push((tweetsnow.nsentiment.negative/ntweets)*100);
      pos1.push((tweetsnow.nsentiment.positve/ntweets)*100);
      neu1.push((tweetsnow.nsentiment.neutral/ntweets)*100);
      names1.push(index1);
      index1 = index1 + 1;

            var placeline = "line1"
      buildLineChart(placeline);

      writeNtweets (ntweets, placet);

      var ptweets = tweetsnow.positive;
      var placetweets1 = "#pos";

      tcomments(ptweets, placetweets1);

      var ntweets = tweetsnow.negative;
      var placetweets2 = "#neg";

      tcomments(ntweets, placetweets2);

      var neutweets = tweetsnow.neutral;
      var placetweets3 = "#neu";

      tcomments(neutweets, placetweets3);
      
    
    });

  }
  
  function init() {
    // Grab a reference to the dropdown select element
    
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
      selector
        .append("option")
        .text("Search Tweeter")
        .property("value", "Search Tweeter");

    
    
    // var url = "/tweetsent";

    // d3.json(url).then(function(response) {
    
    //     var datapie1 = [response.neutral[0], response.negative[0], response.positive[0]]
    //     var placepie1 = "pie1";

    //     buildPieChart(datapie1, placepie1);
                
    //   });

    readtweetsnow();

    };
  
  function optionChanged() {
    // Fetch new data each time a new sample is selected
  
    console.log("OPTION CHANGED *********************");
    console.log ("NEW SAMPLE ************* ",newSample);

    readtweetsnow(); 
  };
  
  // Initialize the dashboard
  

  var neg1 = [];
  var pos1 = [];
  var neu1 = [];
  var names1 = [];
  var index1 = 1;

  console.log("BEFORE INIT *******************");
  init();

// Select the upvote and downvote buttons
// Select the button
var button = d3.select("#filter-btn");

button.on("click", function() {

  readtweetsnow();

});
  
  //d3.select("#selDataset").on("change", optionChanged);