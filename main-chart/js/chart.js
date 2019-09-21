
d3.json("../data/articles.json", data => {
  var dateIt = 0
  var articles = data.slice(0,500);
  console.log(articles)
  var articleValues = articles.map(article => ({meta: article.headline,
    y: Math.sin(dateIt++ / 10), x: (article.date)}))

  var articlesDates = articles.map(aritcle => articles.date)
    
    var data = {
      series : [articleValues]
    };
    
    // We are setting a few options for our chart and override the defaults
    var options = {
      
      // Don't draw the line chart points
      showPoint: true,
      showArea: true,
      // Disable line smoothing
      lineSmooth: true,
      showLine: false,
      // X-Axis specific configuration
      axisX: {
        type: Chartist.FixedScaleAxis,
        // We can disable the grid for this axis
        showGrid: true,
        // and also don't show the label
        showLabel: true,
      },
      // Y-Axis specific configuration
      axisY: {
        // Lets offset the chart a bit from the labels
        offset: 60,
        // The label interpolation function enables you to modify the values
        // used for the labels on each axis. Here we are converting the
        // values into million pound.
      },
      plugins: [
        Chartist.plugins.tooltip(),
        Chartist.plugins.zoom({
          onZoom : function(chart, reset) { storeReset(reset); }
        })
      ]
    };
    
    // All you need to do is pass your configuration as third parameter to the chart function
    var chart = new Chartist.Line('.ct-chart', data, options);
    var seq = 0
    chart.on('draw', data => {
      seq++;
      if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: seq * 30 + 10,
            // Duration of the animation
            dur: 1000,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        })}
        else if (data.type == 'point') {
          data.element.animate(
            {      opacity: {
              // The delay when we like to start the animation
              begin: seq * 30 ,
              // Duration of the animation
              dur: 500,
              // The value where the animation should start
              from: 0,
              // The value where it should end
              to: 1
            }
          }
          )
        };
      })
      
      
    }
    )
    