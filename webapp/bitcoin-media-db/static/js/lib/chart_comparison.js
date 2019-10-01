d3.json("/quotes/GLD", dataGLD => {
  d3.json("/quotes/BTC", dataBTC => {
    d3.json("/quotes/SPX", dataSPX => {
      console.log(dataGLD)
      console.log(dataBTC)
      data_points = dataGLD.length

      var btcValues = dataBTC.map(quote => ({
        "x": quote.unix,
        "y": Math.log10(quote.average)
      })).reverse(); // these arrays are reversed to manipulate the chart animations

      first_date = d3.min(btcValues.map(quote => quote.x))

      var gldValues = dataGLD.map(quote => ({
        "x": quote.unix,
        "y": Math.log10(quote.average)
      })).reverse().filter(quote => quote.x > first_date); // these arrays are reversed to manipulate the chart animations
      // bitcoin was created in 2010, limit the dates for the other stocks to after 2010
      var spxValues = dataSPX.map(quote => ({
        "x": quote.unix,
        "y": Math.log10(quote.average)
      })).reverse().filter(quote => quote.x > first_date); // these arrays are reversed to manipulate the chart animations


      // chart data series objects 
      var data = {
        series: [{
            name: "series-a",
            data: gldValues
          },
          {
            name: "series-b",
            data: btcValues
          },
          {
            name: "series-c",
            data: spxValues
          }

        ]

      };
      // chart options
      var options = {
        height: '.ct-chart'.innerHeight,
        chartPadding: {
          top: 60,
          right: 50,
          bottom: 30,
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

          labelInterpolationFnc: function (value) {
            return "10e" + parseFloat(value).toFixed(1); // format label to exponential
          },
        },
        // add the tooltip and zoom plugins
        plugins: [
          Chartist.plugins.tooltip({
            transformTooltipTextFnc: function (tooltip) {
              return tooltip;
            }
          }),
          Chartist.plugins.zoom({
            onZoom: function (chart, reset) {
              storeReset(reset);
            }
          }),
          // create and position axis titles
          Chartist.plugins.ctAxisTitle({
            axisX: {
              axisTitle: 'Date',
              axisClass: 'ct-axis-title',
              offset: {
                x: 0,
                y: 50
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
            legendNames: ['Gold', 'Bitcoin', 'S&P 500'],
          })
        ],
        // these are series specific options
        series: {
          'series-a': {
            showPoint: false,
            showLine: true,
            showArea: false
          },
          'series-b': {
            showPoint: false,
            showLine: true,
            showArea: false,
            lineSmooth: true
          },
          'series-c': {
            showPoint: false,
            showLine: true,
            showArea: false,
            lineSmooth: true
          }
        }
      };

      var chart = new Chartist.Line('.ct-chart', data, options); // this creates the chart
      var seq = 0; // initialize counter for the animations
      var delay = 80;
      var durations = 500;

      // apply different rules on chart component as it is created to animation teh creation
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
        } else if (data.type === 'point') {
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
})