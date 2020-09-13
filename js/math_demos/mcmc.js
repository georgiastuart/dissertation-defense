import * as d3 from "d3";
import { get_width } from "./util"

export default function (contourmap) {
    let w = get_width() / 2;
    let h = w;

    let cw = w / 4.0;
    let ch = w / 4.0;

    let svg = d3.select("#mcmc-demo")
        .append("svg")
        .attr("viewBox", [0, 0, cw, ch])
        .attr("width", w)
        .attr("height", h);

    let g = svg.append("g")
        .attr("transform", "rotate(180 "+ cw / 2 + " " + ch / 2 + ")");

    console.log(contourmap);
    g.selectAll("path")
        .data(contourmap.contours)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => contourmap.colors(d.value))
        .attr("stroke", "#f5f5f5");



    // let xScale = d3.scaleLinear()
    //     .domain([-3, 3])
    //     .range([0, w / 2 - 50]);
    //
    // let xAxis = d3.axisBottom()
    //     .scale(xScale);
    //
    // svg.append("g")
    //     .attr("transform", "translate(25," + (h / 2.0 - 10) + ")")
    //     .call(xAxis);



    // svg.append("circle")
    //     .attr("cx", w / 2)
    //     .attr("cy", h / 2)
    //     .attr("r", 25)
    //     .style("fill", "purple");
}

