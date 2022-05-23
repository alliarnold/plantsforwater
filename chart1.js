export function chart1() {

// constants and globals

const width = window.innerWidth * .31
const height = window.innerHeight * .22

const margin = {top: 10, bottom: 10, left: 50, right: 10};

// updating variables

let svg;
let xScale;
let yScale;
let xAxis;
let yAxis;
let xAxisGroup;
let yAxisGroup;

// application state

let state = {
  data: [],
  selection: "",
 
};

// load data and format years

d3.csv('data/NYC-Water-Consumption.csv', d => {
  return {
    year: new Date(+d.year, 0,1),
    nycPop:(d.nycPop),
    countType: (d.countType),
    count: Number(+d.count, 0,1)
  }
})
  .then(data => {
    console.log("loaded data:", data);
    state.data = data;
    init();
  });

// initialize function

function init() {
// scales

xScale = d3.scaleTime()
  .domain(d3.extent(state.data, d => d.year))
  .range([margin.left, width - margin.right])

yScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d => d.count))
  .range([height - margin.bottom, margin.top])

// axes

xAxis = d3.axisBottom(xScale)
  .ticks(8)

yAxis = d3.axisLeft(yScale)
  .ticks(8)

// interactive element set-up

const selectElement = d3.select("#dropdownLine");

selectElement.selectAll("option")
  .data([
    {key: "", label: "select water use"},
    {key: "NYCConsumption", label: "nyc per day"},
    {key: "NYCperPerson", label: "one nyc resident per day"}])
    .join("option")
  .attr("value", d => d.key)
  .text(d => d.label)
  selectElement.on("change", function () {
    state.selection = this.value
    console.log(state.selection)
    draw();
  })

//create svg

svg = d3.select("#d3-container-1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// call axes

xAxisGroup = svg.append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate(${0}, ${height-margin.bottom})`)
  .call(xAxis)

yAxisGroup = svg.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(${margin.left}, ${0})`)
  .call(yAxis)

  // svg.append("text")
  // .attr("class", "y label")
  // .attr("text-anchor", "middle")
  // .attr("font-size", 11)
  // .attr("writing-mode", "vertical-rl")
  // .attr("x", 10)
  // .attr("y", (height+20)/2)
  // .text("gallons");

draw();

};

function draw() {
  const filteredData = state.data
          .filter(d => d.countType === state.selection)

  // update scales

  yScale.domain([0, d3.max(filteredData, d => d.count)])

  // update axis

  yAxisGroup
    .transition()
    .duration(500)
    .call(yAxis.scale(yScale)); // generates update



  // line function

  const lineGen = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.count))

  // + DRAW LINE AND/OR AREA
  svg.selectAll(".line")
    .data([filteredData])
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#581845")
    .transition()
    .duration(1000)
    .attr("d", d => lineGen(d))

  // draw line


}

};