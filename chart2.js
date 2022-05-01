// at VERY TOP wrap entire code in an export function
// don't forget the close-curly-bracket at the VERY bottom of all the code

export function chart2() {
  
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 60, right: 40 };
  let svg;

  /**
   * APPLICATION STATE
   * */
  let state = {
    data: null
  };

  /**
   * LOAD DATA
   * Using a Promise.all([]), we can load one or more than one dataset at a time
   * */
  Promise.all([
    d3.csv("./data/data2.csv"), 
  ]).then(([data]) => {
    state.data = data;
    console.log("state: ", state);
    init();
  });

  /**
   * INITIALIZING FUNCTION
   * this will be run *one time* when the data finishes loading in
   * */
  function init() {

    svg = d3
      .select("#d3-container-2")
      .append("svg")

    draw(); // calls the draw function
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {

    svg.style('background-color', 'mediumseagreen')

    svg.selectAll('text')
      .data(state.data)
      .join('text')
      .attr('dx', '50%')
      .attr('dy', '50%')
      .style('text-anchor', 'middle')
      .text(d => `I am SVG number ${d.data}`)

  }
// if you are copying code over from an existing chart project
// the NEW ending curly bracket must be added at the end
}