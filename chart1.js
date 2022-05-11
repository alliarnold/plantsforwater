
export function chart1() {

  // CONSTANTS AND GLOBALS
  const margin = { top: 20, bottom: 50, left: 60, right: 40 };
  
  let svg;

  // APPLICATION STATE
  
  // let state = {
  //   data: null
  // };

  // LOAD DATA
  
  d3.csv("./data/NYC-Water-Consumption.csv", d => {
      // use custom initializer to reformat the data the way we want it
      return {
        Year: new Date(+d.Year),
        NYCPop: d.NYCPop,
        NYCConsumption: d.NYCConsumption,
        NYCperPerson: d.NYCperPerson
      }}).then(raw_data => {
        console.log("data", raw_data);
        init();
      });  
  // INITIALIZING FUNCTION
  //this will be run *one time* when the data finishes loading in

  function init() {

  // SCALES
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Year))
      .range([margin.left, width - margin.right])
      
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.NYCConsumption)])
      .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
      .domain(["NYCConsumption", "NYCperPErson"])
      .range(["cadetblue", "#8F4845"])

  // CREATE SVG

    const svg = d3.select("#d3-container-1")
      .append("svg")

  // BUILD AND CALL AXISES

    const xAxis = d3.axisBottom(xScale)

    const xAxisGroup = svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate(${0}, ${height - margin.bottom})`)
            .call(xAxis)

          xAxisGroup.append("text")
            .attr("class", 'xLabel')
            .attr("transform", `translate(${width / 2}, ${35})`)
            .text("Year")

    const yAxis = d3.axisLeft(yScale)

    const yAxisGroup = svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate(${margin.right}, ${0})`)
            .call(yAxis)
        
          yAxisGroup.append("text")
            .attr("class", 'yLabel')
            .attr("transform", `translate(${-45}, ${height / 2})`)
            .attr("writing-mode", 'vertical-rl')
            .text("NYC Water Consumption - per million gallons, per day")

    // generate line

    const lineGen = d3.line()
      .x(d => xScale(d.Year))
      .y(d => yScale(d.population))

    // draw line

    svg.selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", 'line')
      .attr("fill", "none")
      .attr("stroke", colorScale(d.NYCConsumption))
      .attr("d", d => lineGen(d))

    draw(); // calls the draw function
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  // function draw() {

  //   svg.style('background-color', 'cadetblue')

  //   svg.selectAll('text')
  //     .data(state.data)
  //     .join('text')
  //     .attr('dx', '50%')
  //     .attr('dy', '50%')
  //     .style('text-anchor', 'middle')
  //     .text(d => `hello I am SVG number ${d.data}`)

  }
// if you are copying code over from an existing chart project
// the NEW ending curly bracket must be added at the end
}



export function chart1() {

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 10, bottom: 40, left: 40, right: 10 },
  radius = 3;

// extrapolated function allows replacement of numbers 

const formatMillions = () => d3.format(".2s")(num).replace(/G/, 'B');
const formatDate = d3.timeFormat("%Y")

// these variables allow us to access anything we manipulate in init() 
// they start empty

let svg;
let xScale;
let yScale;
let yAxis;
let xAxisGroup;
let yAxisGroup;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "NYCConsumption",
};

/* LOAD DATA */

d3.csv('../data/NYC-Water-Consumption.csv', d => {
  return {
    Year: new Date(+d.Year, 0, 1),
    NYCConsumption: d.NYCConsumption,
    NYCperPerson: +d.NYCperPerson
    NYCPop: +d.NYCPop
  }
})
  .then(data => {
    console.log("loaded data:", data);
    state.data = data;
    init();
  });

/* INITIALIZING FUNCTION */

function init() {
  
  // SCALES
  xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d => d.Year))
    .range([margin.right, width - margin.left])

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.population))
    .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
    .ticks(6) // limit the number of tick marks showing -- note: this is approximate
  yAxis = d3.axisLeft(yScale)
    .tickFormat(formatBillions)

  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown")

  // add in dropdown options from the unique values in the data
  selectElement.selectAll("option")
    .data([
      // manually add the first value
      "Select a country",
      // add in all the unique values from the dataset
      ...new Set(state.data.map(d => d.country))])
    .join("option")
    .attr("attr", d => d)
    .text(d => d)

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
  selectElement.on("change", event => {
    state.selection = event.target.value
    console.log('state has been updated to: ', state)
    draw(); // re-draw the graph based on this new selection
  });

  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // + CALL AXES
  xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    .text("Year")

  yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.right}, ${0})`)
    .call(yAxis)

  yAxisGroup.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("Population")

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    .filter(d => d.country === state.selection)

  // + UPDATE SCALE(S), if needed
  yScale.domain([0, d3.max(filteredData, d => d.population)])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))// need to udpate the scale

  // specify line generator function
  const lineGen = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.population))

  // + DRAW LINE AND/OR AREA
  svg.selectAll(".line")
    .data([filteredData]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr("stroke", "black")
    .transition()
    .duration(1000)
    .attr("d", d => lineGen(d))
}


}