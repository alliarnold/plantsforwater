
export function chart2() {

    // constants and globals
    
    const width = window.innerWidth * .8
    const height = 110

    // since we use our scales in multiple functions, they need global scope
    
    let svg, xScale, yScale, colorScale, size, tooltipCircle;
    
    /* APPLICATION STATE */
    
    let state = {
        data: null,
        selection: "all",
    };

    /* LOAD DATA */

    d3.csv('data/bubblechart.csv', d3.autoType)
    .then(raw_data => {
        console.log("data", raw_data);
        // save our data to application state
        // make sure species are ordered by size
        raw_data.sort(function(a, b) {
            return a.kgNitrogen - b.kgNitrogen;
        });
        state.data = raw_data;
        init();
    });

    /* INITIALIZING FUNCTION */
    
    // this will be run *one time* when the data finishes loading in
    
    function init() {

        // SCALES

            // color
        
        colorScale = d3.scaleOrdinal()
            .domain(state.data.map(d =>d.species))
            .range(state.data.map(d => d.color))
    
            // scale size
        
        size = d3.scaleSqrt()
            .domain([0, d3.max(state.data, d => d.kgNitrogen)])
            .range([5, 50])

            // make it into a row

        xScale = d3.scaleBand()
            .domain(state.data.map(d=> d.species))
            .range([50, width-50])
            .paddingInner(.8)

        // make sure SVGs fit into the square

        yScale = d3.scaleLinear()
            .domain([0, d3.max(state.data, d=> d.count)])
            .range([height-10, 0])  
          

        //get your container

        const container = d3.select("#d3-container-2").style("position", "relative")
        
        svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("position", "relative");

        // get tooltip

        tooltipCircle = d3.select("#two")
            .append("div")
            .attr("class", "tooltip-circle")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("opacity", 0.8)
            .style("background-color", "#d3f5bc")
            .style("color", "#581845")
            .style("border-radius", "6px")
            .style("padding", "5px")
        
        draw(); // calls the draw function
        // set up selector

        const dropdownCircle = d3.select("#dropdownCircle")
        
        dropdownCircle.selectAll("option")
            .data([
                {key: "all", label: "all"},
                {key: "clams", label: "clams"},
                {key: "mussels", label: "mussels"},
                {key: "oysters", label: "oysters"},
                {key: "seaweeds", label: "seaweeds"}])
            .join("option")
            .attr("value", d => d.key)
            .text(d => d.label)

// dropdown.on event

        dropdownCircle.on("change", function () {
            state.selection = this.value
            console.log(state.selection)

        draw();
    });
        draw(); // calls the draw function
    }

    // now get the filtered data and draw it

    function draw() {

        const filteredData = state.data
            .filter(d => 
                state.selection === d.species || state.selection === "all")
                console.log(filteredData)

        svg.selectAll("circle")
                .data(filteredData)
                .join("circle")
                .attr("class", "circle")
                .attr("r", d => size(d.kgNitrogen))
                .attr("cx", d=> xScale(d.species))
                .attr("cy", (height+10)/2)
                .style("fill", d => colorScale(d.species))
                //.on("start", d3.easeBounceIn(0,1))
        // three functions that changes tooltip when user hovers
                .on("mouseover", function(d,i){
                    d3.select(this)
                        .style("stroke-width", 6)
                        .style("stroke", "white")
                        .transition()
                            .duration(250)
                            .style("stroke-width", 4)
                            .style("stroke", "#C3B1E1")
                        .transition()
                            .duration(175)
                            .style("stroke-width", 2)
                            .style("stroke", "#673147")
                        .transition()
                            .duration(175)
                            .style("stroke-width", 1)
                            .style("stroke", "#C3B1E1")
                        .transition()
                            .duration(175)
                            .style("stroke-width", 1)
                            .style("stroke", "white")
                        
    
                    tooltipCircle
                        .html(`${d.species} remove ${d.kgNitrogen} kg of nitrogen per hectare per year`)
                        .style("visibility", "visible")
                        .style("opacity", 0.8)
                        //.style("background-color", "#d3f5bc")

                    })
                .on('mousemove', function (event) {
                    d3.select(".tooltip-circle")
                    .style("top", d3.event.pageY + "px")
                    .style("left", d3.event.pageX + "px");

                })
                .on("mouseleave", function () 
                    { tooltipCircle
                        .style("visibility", "hidden")
                        .style("opacity", 0)
                        d3.select(this)
                        .style("stroke", "none")
                    })
    
    };

        
                    
}