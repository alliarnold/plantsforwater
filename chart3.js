
export function chart3() {
  
const width = window.innerWidth * .8,
height = window.innerHeight * .5,
margin = { top: 10, bottom: 40, left: 40, right: 20};

const hoverColor = "#2610eb";
const tipColor = "#d3f5bc";

// // since we use our scales in multiple functions, they need global scope
let svg, xScale, yScale, colorScale, tooltip;

/* APPLICATION STATE */
let state = {
  data: null,
  selection: "usdBen"
};

/* LOAD DATA */

d3.csv('data/bubblechart2.csv', d3.autoType)
.then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */

// this will be run *one time* when the data finishes loading in

function init() {

  /* SCALES */

  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.species))
    // COMMENT: view to see if axis need adjustments in diff states 
    .range([margin.left, width - margin.right])
    .paddingInner(.2)
    .paddingOuter(.1)

  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.count)])
    .range([height-margin.bottom, margin.top])
    
  colorScale = d3.scaleOrdinal()
    .domain(["Clams", "Mussels", "Oysters", "Seaweeds"])
    .range(["#EB9928","#2F4858", "#815f8a", "#8F4845"])

const container = d3.select("#d3-container-3").style("position", "relative")

    svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "relative");
        
// tooltip 

    tooltip = d3.select("#four")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("opacity", 0.8)
        .style("padding", "8px")
        //.style("background", tipColor)
        .style("border-radius", "4px")
        //.style("color", "blue")
        .style("font-size", "1.2em" )
        .text("tooltip");

// axises

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const xAxisGroup = svg.append("g")
  .attr("class", 'xAxis')
  .attr("transform", `translate(${0}, ${height-margin.bottom})`)
  .call(xAxis);
  
  const yAxisGroup = svg.append("g")
    .attr("class", 'yAxis')
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis);
    
svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height - 10)
  .text("species");

// svg.append("text")
//   .attr("class", "y label")
//   .attr("text-anchor", "middle")
//   .attr("x", -(height/2))
//   .attr("y", 10)
//   .attr("dy", ".75em")
//   .attr("transform", "rotate(-90)")
//   .text(`${d.yAxisLabel}`);

draw(); // calls the draw function

// set up selector

const dropdown = d3.select("#dropdown")

dropdown.selectAll("options")
    .data([
      {key: "usdBen", label: "Financial Benefit"},
      {key: "kgNitrogen", label: "Nitrogen Removed"}])
      .join("option")
      .attr("value", d => d.key)
      .text(d => d.label)

// dropdown.on event

dropdown.on("change", function () {
    state.selection = this.value
    console.log(state.selection)
    draw();
});

draw(); // not sure why this draw is necessary?

}

// joins filters with earlier sections and tools

function draw() {

    const filteredData = state.data
    .filter(d => 
        state.selection === "usdBen" || state.selection === d.countType)
        console.log(filteredData)
    
    svg.selectAll("rect")
        .data(filteredData)
        .join("rect")
        .attr("width", xScale.bandwidth)
        .attr("height", d => height-margin.bottom - yScale(d.count))
        .attr("x", d=> xScale(d.species))
        .attr("y", d=> yScale(d.count))
        .attr("fill", d=> colorScale(d.species))
        .on("mouseover", function(d,i){
            tooltip
                .html(`<div>${d.species}</div><div>Benefit: ${d.count}</div>`)
                .style("visibility", "visible")
                .style("opacity", .8)
                .style("background", tipColor)
                .style("color", "#581845")
                d3.select(this)
                    .transition()
                    .attr("fill", hoverColor)
        })
        .on("mousemove", function(){
            d3.select(".tooltip")
            .style("top", d3.event.pageY - 10 + "px")
            .style("left", d3.event.pageX + 10 + "px");
        })
        .on("mouseout", function (d){
            tooltip
                .html(``)
                .style("visiblity", "hidden");
                d3.select(this)
                    .transition()
                    .attr("fill", d=> colorScale(d.species))
        });
};

};