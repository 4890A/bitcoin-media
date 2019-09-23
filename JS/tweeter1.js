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
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
  
    var url = `/samples/${sample}`;
  
    // Grab values from the response json object to build the plots
  
    console.log("BUILDING CHART **** ", sample);
  
    d3.json(url).then(function(data) {
  
      //@TODO: Build a Bubble Chart using the sample data
  
      var tracebubble = {
        type: "scatter",
        mode: "markers",
        x : data.otu_ids,
        y : data.sample_values,
        marker : {
          size: data.sample_values,
          color: data.sample_values,
          sizemode: 'diameter'
        }
      };
  
      var databubble = [tracebubble];
  
      var layout = {
        title: `Bubble Graph: ${sample}`,
        showlegend: false,
        //height: 600,
        //width: 600
      };
      
      Plotly.newPlot("bubble", databubble, layout);
      
      // @TODO: Build a Pie Chart
  
      var dataobj = [];
  
      for (var i=1; i < data.otu_labels.length; i++){
  
        obj1 = {};
        obj1.ol = data.otu_labels[i];
        obj1.sv = data.sample_values[i];
        obj1.oi = data.otu_ids[i];
  
        dataobj.push(obj1);
      };
  
      dataobj.sort(function(a, b) {
        return b.sample_values - a.sample_values;
      });
  
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      dataobj = dataobj.slice(0,10);
   
      var trace1 = {
        type: "pie",
        labels: dataobj.map(e => e.oi),
        values: dataobj.map(e => e.sv),
      };
  
      var datap = [trace1];
  
      var layout = {
        title: `Pie Graph: ${sample}`
      };
  
      Plotly.newPlot("pie", datap, layout);
  
      //GAUGE GRAPH
  
      console.log("WFREQ $$$$$$$$$$$$$$$$$$$$$  ",wf);
      
  
      var traceg = {
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        value: wf,
        title: {
          text: `Scrubs x Week - Sample: ${sample}`
        },
        titlefont: { size:15 },
        type: "indicator",
        mode: "gauge+number",
        gauge: {axis: {range: [null, 10]}},
      };
  
      var datag = [traceg];
    
      var layoutg = {
        title: "Bellybutton Washing Frequency",
        titlefont: { size:20 },
      };
        
      Plotly.newPlot("gauge",datag,layoutg);
      
    });
  };

  function SubTitlePie(titlep, placet){

    var pdata = d3.select(placet);

    console.log("WRITING SUBTITLE");
    console.log(titlep);
      
    // to clear any existing metadata
    pdata.html("");

    pdata.append("p").text(titlep);

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
  
  function init() {
    // Grab a reference to the dropdown select element
    
    var url = "/tweetsent";

    d3.json(url).then(function(response) {
    
        var datapie1 = [response.neutral[0], response.negative[0], response.positive[0]]
        var placepie1 = "pie1";

        buildPieChart(datapie1, placepie1);
                
      });

      var url2 = "/readtweets"
 
      d3.json(url2).then(function(tweetsnow) {
    
        var datapie2 = [tweetsnow.nsentiment.neutral, tweetsnow.nsentiment.negative, tweetsnow.nsentiment.positve]

        console.log("POSITIVE: ",tweetsnow.nsentiment.positve)
        var placepie2 = "pie2";

        buildPieChart(datapie2, placepie2);

        var ttweets = tweetsnow.nsentiment.neutral + tweetsnow.nsentiment.negative + tweetsnow.nsentiment.positive
        var titlep = `Number of Tottal Tweets${ttweets};`
        var placet = "title2"

        SubTitlePie(titlep, placet);

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

      

    };
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
  
    console.log("OPTION CHANGED *********************");
    console.log ("NEW SAMPLE ************* ",newSample);
    // Prevent the page from refreshing
    //d3.event.preventDefault();
  
    // Select the input value from the form
    //var nsample = d3.select("#selDataset").node().value;
    //console.log("GOT IT FROM HTML #### , ", nsample);
    
    // buildCharts(newSample);
    // buildMetadata(newSample);
    // //buildCharts(nsample);
    //buildMetadata(nsample);
  
  }
  
  // Initialize the dashboard
  

  console.log("BEFORE INIT *******************");
  init();
  
  //d3.select("#selDataset").on("change", optionChanged);