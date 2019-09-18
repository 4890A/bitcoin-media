function createChart(){

	var width = window.innerWidth;
	var height = window.innerHeight;
	
	// the center coordinate which will be used as a 
	// center attraction point for the bubbles
	var center = {x : width / 2.,
			y: height / 2. };

	
	// initialize svg area, bubbles and their nodes
	var svg = null;
	var bubbles = null;
	var nodes = [];

	// create repulsive force, as a function of node seperation
	var forceStrength = 0.05;

	function charge(distance) {
		return - Math.pow(distance.radius, 2.0) * forceStrength;
	}

	var simulation = d3.forceSimulation()
		// drag force that slows down bubbles
		.velocityDecay(0.2)
		// x and y forces that pull to the center
		.force('x', d3.forceX().strength(forceStrength).x(center.x))
		.force('y', d3.forceY().strength(forceStrength).y(center.y))
		// repulsive force
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



		var myNodes = data.map(d => (
			{
				name: d.word,
				radius: radiusScale(+d.frequency),
				value: +d.frquency,
				x: Math.random() * width,
				y: Math.random() * height
			}
		));

		// nodes may have to be sorted
		return myNodes
	}

	// higher order function that actually creates the chart/simulation
	// this is what will be returned by the parent function
	var chart = function (selector, data) {
		nodes = createNodes(data);

		svg = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		bubbles = svg.selectAll('.bubble')
			.data(nodes);

		var newBubbles = bubbles
			.enter().append('g').call(d3.drag);

		newBubbles
			.append('circle')
			.attr('r', 0)
			.attr('fill', d => color(d.radius));


		newBubbles.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(d => d.name)
			    .attr("font-family", "sans-serif")
			    .attr("font-size", d => d.radius / 5)
			    .attr("fill", "white");
		
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




function main(error, data) {
	if (error) {
		console.log(erorr);
	}
	console.log(data)
	myBubbleChart('#vis', data);
}

d3.json("../data/word_frequency.json", main)
