// for nesting multiple charts in narrative, at VERY TOP wrap entire code in an export function
// don't forget the close-curly-bracket at the VERY bottom of all the code

export function chart3() {

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .8;
const height = window.innerHeight *.8;
const margin = { top: 10, bottom: 30, left: 40, right: 10 };

const staticColor = "magenta";
const hoverColor = "gold";
const tipColor = "#e8e8e8e8";

// adding let variables here
// since we use our scales in multiple functions, they need global scope
let svg;
let xScale;
let yScale;
let tooltip;


// manage interactivity
/* APPLICATION STATE */
let state = {
  data: null,
  selection: "all"
};


/* LOAD DATA */

d3.csv('data/squirrelActivities.csv', d3.autoType)
.then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  raw_data.sort(function(a, b) {
    return a.count - b.count;
  });
  state.data = raw_data;
  init();
});


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in

function init() {

  /* SCALES */

  xScale = d3.scaleBand()
  .domain(state.data.map(d=> d.activity))
  .range([margin.left, width-margin.right])
  .paddingInner(.4)

  yScale = d3.scaleLinear()
  .domain([0, d3.max(state.data, d=> d.count)])
  .range([height-margin.bottom, margin.top])  

  const container = d3.select("#d3-container-3").style("position", "relative");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "relative");

  // tooltip = d3.select("body")
  // change the d3.select to SPECIFIC ID for this graph's <div> instead of just the body
  tooltip = d3.select("#four")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("opacity", 0.8)
  .style("padding", "8px")
  .style('background', tipColor)
  .style("border-radius", "4px")
  .style("color", "blue")
  .style("font-size", "1.2em" )
  .text("tooltip");


// could add axes code here if desired


    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x",  width / 2 )
    .attr("y", height - 6)
    .text("squirrel activity types");

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -(height/2))
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("sightings in the field");
    // check if additional draw call req'd
    draw(); 

    //set up selector
    // if you will have multiples be sure to add number suffix
    const dropdown = d3.select("#dropdown")

    dropdown.selectAll("options")
      .data(["all","foraging", "running", "chasing", "climbing", "eating"])
      .join("option")
      .attr("value", d => d)
      .text(d => d)

      // dropdown.on("change", event => {
      // change this to use NON-arrow syntax for the function
      dropdown.on("change", function () {
        //state.selection = event.target.value
        // better to use the "this." syntax now too
        state.selection = this.value
        console.log(state.selection)
        draw();
      });

  draw(); // calls the draw function
}

// NEW CODE SECTION - contains earlier code sections of data join and draw plus some additions
/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  const filteredData = state.data
  .filter(d => 
    state.selection === d.activity || state.selection === "all")
    console.log(filteredData)

  svg.selectAll("rect")
  .data(filteredData)
  .join("rect")
  .attr("width", xScale.bandwidth)
  .attr("height", d=> height-margin.bottom - yScale(d.count))
  .attr("x", d=>xScale(d.activity))
  .attr("y", d=>yScale(d.count))
  .attr("fill", staticColor)
    // remove the term "event" here in parens 
    // .on("mouseover", function(event,d,i){
    .on("mouseover", function(d,i){
      tooltip
      .html(`<div>activity: ${d.activity}</div><div>sightings: ${d.count}</div>`)
      .style("visibility", "visible")
      .style("opacity", .8)
      .style("background", tipColor)
      d3.select(this)
          .transition()
          .attr("fill", hoverColor);
      })
      // here "event" is not yet needed in parameter
      // .on('mousemove', function (event) {
      .on('mousemove', function () {
        // change to a d3.select of tooltip
        //tooltip
        d3.select(".tooltip")
        // change positioning to d3.event reference
        // .style('top', event.pageY - 10 + 'px')
        // .style('left', event.pageX + 10 + 'px');
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
    })

    // "event" is no longer needed in the parameter here
    // .on("mouseout", function(event, d){
    .on("mouseout", function(d){
      tooltip
      .html(``)
      .style("visibility","hidden");
      d3.select(this)
          .transition()
          .attr("fill", staticColor);
      });

console.log(state)
}
// if this is a chart you are copying into export function you need a final end curly bracket
}
