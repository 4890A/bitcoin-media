d3.json("../data/articles.json", data1 => {
  d3.json("http://127.0.0.1:5000/btcquotes", data2 => {
    console.log(data1)
    console.log(data2)
    data_points = data1.length
    // dataseires for btcValues
    var btcValues = data2.map(quote => ({
      "x": quote.unix,
      "y": quote.average
    })).reverse(); // these arrays are reversed to manipulate the chart animations

    // dataseries for nyt articles. 
    var articles = data1.map(article => ({
      "x": article.date,
      "meta": article.headline // the meta tag will be used on the tooltip
    })).reverse();

    // the dates on the articles do not direclty coorespond to btc quote data
    // everpolate is used to interpolate the price information at the time of 
    // article publication
    articlesPrice = everpolate.linear(
      articles.map(article => article.x),
      btcValues.map(quote => quote.x),
      btcValues.map(quote => quote.y)
    );
    // append the interpolated prices into the data series
    articles.forEach((article, i) => (
      article.y = articlesPrice[i]
    )
    );

    var data = {
      series: [{ name: "series-a", data: articles},
      { name: "series-b", data: btcValues}]

    };

    // We are setting a few options for our chart and override the defaults
    var options = {

      // Don't draw the line chart points
      // Disable line smoothing
      // X-Axis specific configuration
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 7, // This sets the labels on the ticks of the x axis

        // A technical limitation of the zoom chartist plugin limits the x series to numerical values
        // this label interpolation function formats the unix label to a string date
        // this requires the moment.js library
        labelInterpolationFnc: function(value) {
          return moment(value, "X").format('MMM D YYYY');
        },
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
        Chartist.plugins.tooltip({
          transformTooltipTextFnc: function(tooltip) {
            var xy = tooltip.split(",");
            return xy[1];
          }
        }),
        Chartist.plugins.zoom({
          onZoom: function (chart, reset) {
            storeReset(reset);
          }
        })
      ],
      series:{
        'series-a': {
          showPoint: true,
          showLine: false,
          showArea: false
        },
        'series-b': {
          showPoint: false,
          showLine: true,
          showArea: true,
          lineSmooth: true
        }
      }
    };

    // All you need to do is pass your configuration as third parameter to the chart function
    var chart = new Chartist.Line('.ct-chart', data, options);
    var seq = 0 ;
    var delay = 80 ;
    var durations = 500 ;
    chart.on('draw', data => {
      seq++;
      if (data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: 1 + 1000,
            // Duration of the animation
            dur: 1000,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        })
      }
      else if (data.type == 'point') {
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: (seq / (data_points * .1)) * 30 + 1000,
            // Duration of the animation
            dur: 500,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        })
      }
      // grid line animation
      /*
      else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
          begin: seq * delay,
          dur: durations,
          from: data[data.axis.units.pos + '1'] - 30,
          to: data[data.axis.units.pos + '1'],
          easing: 'easeOutQuart'
        };
    
        var pos2Animation = {
          begin: seq * delay,
          dur: 1000,
          from: data[data.axis.units.pos + '2'] - 100,
          to: data[data.axis.units.pos + '2'],
          easing: 'easeOutQuart'
        }
        var animations = {};
        animations[data.axis.units.pos + '1'] = pos1Animation;
        animations[data.axis.units.pos + '2'] = pos2Animation;
        animations['opacity'] = {
          begin: seq * delay,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        };
    
        data.element.animate(animations)
        ;
      } */
      ;
    })
  })
})