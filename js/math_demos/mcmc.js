import * as d3 from "d3";
import { get_width, rosenbrock } from "./util"

export default function (contourmap) {
    let w = get_width();
    let h = w * 0.5;

    let svg = d3.select("#mcmc-demo")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    console.log(contourmap);
    svg.selectAll("path")
        .data(contourmap.contours)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => contourmap.colors(d.value))
        .attr("stroke", "#f5f5f5");




    // svg.append("circle")
    //     .attr("cx", w / 2)
    //     .attr("cy", h / 2)
    //     .attr("r", 25)
    //     .style("fill", "purple");
}

