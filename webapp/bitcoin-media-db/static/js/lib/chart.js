d3.json("/articles", data1 => {
  d3.json("/quotes/BTC", data2 => {
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
    // article publication. Linear interpolation is not computationally expensive
    articlesPrice = everpolate.linear(
      articles.map(article => article.x),
      btcValues.map(quote => quote.x),
      btcValues.map(quote => quote.y)
    );
    // append the interpolated prices into the data series
    articles.forEach((article, i) => (
      article.y = articlesPrice[i]
    ));

    var data = {
      series: [{
          name: "series-a",
          data: articles
        },
        {
          name: "series-b",
          data: btcValues
        }
      ]

    };
    // chart options
    var options = {
      height: 'ct-chart'.innerHeight,
      chartPadding: {
        top: 60,
        right: 50,
        bottom: 10,
        left: 50
      },

      // X-Axis specific configuration
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 7, // This sets the labels on the ticks of the x axis

        // A technical limitation of the zoom chartist plugin limits the x series to numerical values
        // this label interpolation function formats the unix label to a string date
        // this requires the moment.js library
        labelInterpolationFnc: function (value) {
          return moment(value, "X").format('MMM D YYYY');
        },
        showGrid: true,
        showLabel: true,
      },
      // Y-Axis specific configuration
      axisY: {
        // Lets offset the chart a bit from the labels
        offset: 60,
      },
      // add the tooltip and zoom plugins
      plugins: [
        Chartist.plugins.tooltip({
          transformTooltipTextFnc: function (tooltip) {
            return moment(tooltip, "X").format('MMM D YYYY');
          }
        }),
        Chartist.plugins.zoom({
          onZoom: function (chart, reset) {
            storeReset(reset);
          }
        }),
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Date',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Price USD',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 35
            },
            textAnchor: 'middle',
            flipTitle: true
          }
        }),
        Chartist.plugins.legend({
            legendNames: ['Articles', 'Price'],
        })
      ],
      // these are series specific options
      series: {
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

    var chart = new Chartist.Line('.ct-chart', data, options); // this creates th chart
    var seq = 0; // initialize counter for the animations
    var delay = 80;
    var durations = 500;

    // apply different rules on chart component as it is created to animation creation
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
      } else if (data.type == 'point') {
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
      };
    })
  })
})