function createChart() {

	var width = window.innerWidth;
	var height = window.innerHeight +675;

	// the center coordinate which will be used as a
	// center attraction point for the bubbles
	var center = {
		x: width / 2.,
		y: height / 2.
	};


	// initialize svg area, bubbles and their nodes
	var svg = null;
	var bubbles = null;
	var nodes = [];

	// create repulsive force, as a function of node seperation
	var forceStrength = 0.05;

	function charge(distance) {
		return -Math.pow(distance.radius, 2.0) * forceStrength;
	}

	var simulation = d3.forceSimulation()
		// drag force that slows down bubbles
		.velocityDecay(0.2)
		// x and y forces that pull to the center
		.force('x', d3.forceX().strength(forceStrength).x(center.x))
		.force('y', d3.forceY().strength(forceStrength).y(center.y))
		// repulsive many-body force
		.force('charge', d3.forceManyBody().strength(charge))
		.on('tick', ticked);

	// prevents simulation from running before nodes are created
	simulation.stop();

	function createNodes(data) {

		// the frequency at which the most common word occurs
		var maxAmount = d3.max(data, d => (+d.frequency));
		console.log(maxAmount)

		color = chroma.scale(['white', 'orange'])
			.domain([2, 200]);

		// use a logarithmic scale for the bubble radius
		var radiusScale = d3.scalePow()
			.exponent(0.5)
			.range([2, 200])
			.domain([0, maxAmount]);


		var myNodes = data.map(d => ({
			name: d.word,
			radius: radiusScale(+d.frequency),
			value: +d.frquency,
			x: Math.random() * width,
			y: Math.random() * height
		}));

		// nodes may have to be sorted
		return myNodes
	}

	// higher order function that actually creates the chart/simulation
	// this is what will be returned by the parent function
	var chart = function (selector, data) {
		nodes = createNodes(data);

		// put a svg container inside the bubble div
		svg = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		bubbles = svg.selectAll('.bubble')
			.data(nodes); // hook the data to html elements

		var newBubbles = bubbles
			.enter().append('g').call(d3.drag); //entry point for the new nodes
		// this appends a svg group which wil later contain the bubble and text

		newBubbles
			.append('circle')
			.attr('r', 0)
			.attr('fill', d => color(d.radius)); // color of bubble scaled to value


		newBubbles.append("text")
			.attr("dy", ".3em") // centers text to svg group
			.style("text-anchor", "middle")
			.text(d => d.name)
			.attr("font-family", "sans-serif")
			.attr("font-size", d => d.radius / 5) // animate the bubble growth
			.attr("fill", "#d9865e");

		bubbles = bubbles.merge(newBubbles);

		circles = svg.selectAll('circle')
			.data(nodes);

		circles.transition()
			.duration(2000)
			.attr('r', d => (d.radius));


		simulation.nodes(nodes);
		simulation.alpha(1).restart()
	};

	function ticked() {
		bubbles.attr("transform", function (d) {
			var k = "translate(" + d.x + "," + d.y + ")";
			return k
		})
	}

	return chart

}

var myBubbleChart = createChart();

// options for the spinner
var opts = {
	lines: 13, // The number of lines to draw
	length: 38, // The length of each line
	width: 17, // The line thickness
	radius: 45, // The radius of the inner circle
	scale: .3, // Scales overall size of the spinner
	corners: 1, // Corner roundness (0..1)
	color: 'orange', // CSS color or array of colors
	fadeColor: 'orange', // CSS color or array of colors
	speed: 1, // Rounds per second
	rotate: 0, // The rotation offset
	animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
	direction: 1, // 1: clockwise, -1: counterclockwise
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	className: 'spinner', // The CSS class to assign to the spinner
	top: '50%', // Top position relative to parent
	left: '50%', // Left position relative to parent
	position: 'absolute' // Element positioning
};

var target = document.getElementById("bubble-vis"); // html target for vis
var spinner = new Spinner(opts); // create spinner, but do not start spinning

// handles errors in the api request and stops spinner on success
function main(error, data) {

	if (error) {
		console.log(erorr);
	}
	spinner.stop(); // json has finished loading, stop spinner
	myBubbleChart('#bubble-vis', data);
}

// this function is the entrypoint for the file, it is run from html "onClick"
function init() {
	d3.selectAll("svg").remove(); //clear visualization
	spinner.spin(target) // spinner starts
	var x = document.getElementById("uniqueID").value;
	d3.json("/words/" + x, main);
}