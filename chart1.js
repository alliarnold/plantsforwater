
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

    const svg = d3.select("#d3-container-2")
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
