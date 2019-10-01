
//Function to write list of comment (ptweets) in a place in the HTML form (tplace)
function tcomments (ptweets, tplace) {

    // Present top current comment from Twetter
  
    //Select place where comments will be written
    var pdata = d3.select(tplace);
      
    // Use `.html("") to clear any existing metadata
    pdata.html("");

    //Write the comments at the selected place - only if there are tweets.  Otherwise, it indicates that no comments at this moment
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
  
//Funtion to build a pie, displayint data in "datapie" at a place in the HTLM form (placepie)
  function buildPieChart(datapie, placepie) {

    //Create data for the pie
    var data = [{
        values: datapie,
        labels: ['Neutral', 'Negative', 'Positive'],
        type: 'pie'
      }];
    
      //Create layout for the pie
      var layout = {
        height: 400,
        width: 500
      };
      
      //Present pie at the indicated place (placepie)
      Plotly.newPlot(placepie, data, layout);
  }

  //Function to write the number of tweets read NOW at place in HTML (placet)
  function writeNtweets (ntweets, placet) {

    //Get reference to place where number of tweets will go
    
    //Select the place where the number of tweets will be written
    var ptweets = d3.select(placet);

    //Clean place to write number of tweets
    ptweets.html("");

    //Create the text with the number of tweets read
    text1 = `Number of Tweets: ${ntweets}.`;

    //Write string including number of tweets
    ptweets.append("p").text(text1).classed("title3", true);

    };


    //Function to build the trend line for positive, negative and neutral comments
    function buildLineChart(placel){

    //Trace for the line with nunmber of Negative tweets
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

    //Trace for the line with nunmber of Positive tweets
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

    //Trace for the line with nunmber of Neutral tweets
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

    //Data incluying data for lines for negative, positive and neutral number of tweets
    var data = [trace1, trace2, trace3];

    //Layout for tend line graph
    var layout = {
      title: "BITCOIN Tweets % Split",
      xaxis: {title: "Number of Point"},
      yaxis: {title: "% of Total"}
    };

    //Present line in placel within HTML 
    Plotly.newPlot(placel, data, layout);
  };

  //Function to read tweets NOW related to BITCOIN
  function readtweetsnow() {
    
 
    //API place where Python application renders comments in tweeter NOW
    var url2 = "/readtweets"

    console.log("->  READING NEW TWEETS ********************");
 
    //Read output from Python application reading tweets now
    d3.json(url2).then(function(tweetsnow) {
  
      var datapie2 = [tweetsnow.nsentiment.neutral, tweetsnow.nsentiment.negative, tweetsnow.nsentiment.positve]

      //PLace where pie for split of negative, positive and neutral tweets will be presented
      var placepie2 = "pie2";

      //Present pie with datapie2 in selected place (placepie2)
      buildPieChart(datapie2, placepie2);

      //Calculate the total number of tweets read NOW
      var ntweets = tweetsnow.nsentiment.neutral + tweetsnow.nsentiment.negative + tweetsnow.nsentiment.positve
      
      //Place where total number of tweets will be placed
      var placet = "#ntw1";

      //Update arrays where trend for negative, positive and neutral tweets will be stored
      neg1.push((tweetsnow.nsentiment.negative/ntweets)*100);
      pos1.push((tweetsnow.nsentiment.positve/ntweets)*100);
      neu1.push((tweetsnow.nsentiment.neutral/ntweets)*100);
      names1.push(index1);
      index1 = index1 + 1;

      //Place where trend line for % of negative, positive and neutral tweets will be rendered
      var placeline = "line1"

      //Build the trendline for the negative, positive and neutral tweets
      buildLineChart(placeline);

      //Write the number of tweets read NOW in placet within HTML
      writeNtweets (ntweets, placet);


      //Get all positive tweets and write them in position indicated #pos
      var ptweets = tweetsnow.positive;
      var placetweets1 = "#pos";

      tcomments(ptweets, placetweets1);

      //Get all negative tweets and write them in position indicated #neg
      var ntweets = tweetsnow.negative;
      var placetweets2 = "#neg";

      tcomments(ntweets, placetweets2);

      //Get all neutral tweets and write them in position indicated #neu
      var neutweets = tweetsnow.neutral;
      var placetweets3 = "#neu";

      tcomments(neutweets, placetweets3);
      
    
    });

  }
  
  //Function to initialize HTML form with all information
  function init() {

    //Initialize section with tweets read now
    readtweetsnow();

    };


  // Initialize the dashboard
  //Initialize arrays where trend lines for negative, positive and neutral tweet percentages are stored
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

//When button is activated, it will update tweets read NOW
button.on("click", function() {

  readtweetsnow();

});
  
  //d3.select("#selDataset").on("change", optionChanged);