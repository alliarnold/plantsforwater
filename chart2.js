
export function chart2() {

// constants and globals

// const margin = { top: 30, bottom: 30, left: 40, right: 40 };

const width = 250
const height = 250
const margin = {top: 5, bottom: 5, left: 5, right: 5};

// append

const svg = d3.select("#d3-container-1")
  .append("svg")
  
// load data

d3.csv("./data/bubblechart.csv", d3.autoType)
.then(data => {
  console.log(data)

// color palette for species

const colorScale = d3.scaleOrdinal()
  .domain(["Clams", "Mussels", "Oysters", "Seaweeds"])
  .range(["#EB9928",/*"#99E8DA"*/ "#2F4858", "#815f8a" /*"#99E8DA"*/, "#8F4845"])

// scale size

const size = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.kgNitrogen)])
  .range([7, 65])

// tooltip

const  tooltip = d3.select("#d3-container-1")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "#d3f5bc")
  .style("color", "#581845")
  .style("border-radius", "6px")
  .style("padding", "5px")

// initiating center bubble

let node = svg.append("g")
  .selectAll("circle")
  .data(data)
  .join("circle")
    .attr("class", "node")
    .attr("r", d => size(d.kgNitrogen))
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("fill", d => colorScale(d.species))
    //.attr("stroke", "white")
    //.style("stroke-width", .5)
// three functions that changes tooltip when user hovers
    .on("mouseover", function(d,i){

      d3.select(this)
        .style("stroke", "white")
        .style("stroke-width", 4);

      tooltip
        .html(`${d.species} remove ${d.kgNitrogen} kg of nitrogen per hectare per year`)
        .style("visibility", "visible")
        .style("opacity", .8)
        .style("background-color", "#d3f5bc")
    })
    // here "event" is not yet needed in parameter
    // .on('mousemove', function (event) {
    .on('mousemove', function () {

      // change to a d3.select of tooltip
      d3.select(".tooltip")
      // change positioning to d3.event reference
      .style('top', d3.select(this).attr("cy") + "px" /*d3.event.y - 10 + 'px'*/)
      .style('left', d3.select(this).attr("cx") + "px" /*d3.event.x + 10 + 'px'*/);
  })
    .on("mouseleave", function () 
    { tooltip
      .style("opacity", 0)
      d3.select(this)
      .style("stroke", "none")
      .transition()
        .duration(3000)
        .transition()
        .ease(d3.easeBounce)
    })
    .call(d3.drag() // call specific function when circle is dragged
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  // svg.append("text")
  //     .attr()
  //     .attr()
  //     .attr("class", "node")
  //     .text(function(d) { return d.species});

// features of the forces applied to the nodes:

const simulation = d3.forceSimulation()
  .force("center", d3.forceCenter().x(width/2).y(height/2)) // attracts to center
  .force("charge", d3.forceManyBody().strength(.1)) // nodes are attracted to each other
  .force("collide", d3.forceCollide().strength(.2).radius(function(d) { return (size(d.kgNitrogen)+3)}).iterations(1)) // avoids bubbles overlapping

// apply these forces to the nodes and update their positions
// once force finishes positioning - simulations stop

simulation.nodes(data)
  .on("tick", function(d){
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
  });

// What happens when a circle is dragged?
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(.7).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}

});
  
}