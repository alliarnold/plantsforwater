// at VERY TOP wrap entire code in an export function
// don't forget the close-curly-bracket at the VERY bottom of all the code

export function chart3() {

    /* CONSTANTS AND GLOBALS */
  
  const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = {top: 20, bottom: 50, left: 80, right: 60};
  
  
  // these variables allow us to access anything we manipulate in init() but need access to in draw().
  // All these variables are empty before we assign something to them.
  let svg;
  let xScale;
  let yScale;
  let xAxis;
  let yAxis;
  let xAxisGroup;
  let yAxisGroup;
  
  /* APPLICATION STATE */
  let state = {
    data: [],
    selection: "", // + YOUR FILTER SELECTION
  };
  
  /* LOAD DATA */
  // + SET YOUR DATA PATH
  d3.csv('../data/populationOverTime.csv', d => {
    // use custom initializer to reformat the data the way we want it
    // ref: https://github.com/d3/d3-fetch#dsv
    return {
      year: new Date(+d.Year, 0, 1),
      country: d.Entity,
      population: +d.Population
    }
  })
    .then(data => {
      console.log("loaded data:", data);
      state.data = data;
      init();
    });
  
  /* INITIALIZING FUNCTION */
  // this will be run *one time* when the data finishes loading in
  function init() {
    // + SCALES
    xScale = d3.scaleTime()
      .domain(d3.extent(state.data, d => d.year))
      .range([margin.left, width - margin.right])
  
    yScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d => d.population)])
      .range([height - margin.bottom, margin.top])
  
    // + AXES
  
    xAxis = d3.axisBottom(xScale)
      .ticks(10)
  
    yAxis = d3.axisLeft(yScale)
  
  
    // + UI ELEMENT SETUP
  
    const selectElement = d3.select("#dropdown")
  
    selectElement.selectAll("option")
      .data(["Select a Country",
            ...new Set(state.data.map(d => d.country))])
      .join("option")
      .attr("attr", d => d)
      .text(d => d)
  
  /*   selectElement.on("change", function () {
      console.log("New selection is", this.value);
      state.selection = this.value;
      console.log("updated state = ", state)
      draw(); 
    }); */
    
    selectElement.on("change", function () {
      console.log("New selection is", this.value);
      state.selection = this.value;
      console.log("updated state = ", state)
      draw(); 
    });
  
  
  
    // + CREATE SVG ELEMENT
  
    svg = d3.select("#d3-container-3")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
    
  
    // + CALL AXES
  
    xAxisGroup = svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(${0},${height - margin.bottom})`)
      .call(xAxis)
  
    yAxisGroup = svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${margin.left},${0})`)
      .call(yAxis)
  
  
    draw(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw() {
    // + FILTER DATA BASED ON STATE
    const filteredData = state.data
      .filter(d => d.country === state.selection)
      // .filter(d => d.country === state.selection)
      console.log(state.data)
  
    // + UPDATE SCALE(S), if needed
    
    yScale.domain([0,d3.max(filteredData, d => d.population)])
  
    // + UPDATE AXIS/AXES, if needed
  
    yAxisGroup
      .transition()
      .duration(1000)
      .call(yAxis.scale(yScale)) // generates updated scale
  
  
    // UPDATE LINE GENERATOR FUNCTION
  
    const lineGen = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.population))
  
  
    // + DRAW LINE AND/OR AREA
  
    svg.selectAll(".line")
      .data([filteredData])
      .join("path")
      .attr("class","line")
      .attr("stroke","blue")
      .attr("fill","none")
      .attr("d", d => lineGen(d))
    
  
  }
  }