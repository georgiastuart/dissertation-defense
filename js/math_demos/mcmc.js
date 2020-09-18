import * as d3 from "d3";
import { get_width } from "./util"

export default function (contourmap) {
    let w = get_width() / 2;
    let h = w;

    let cw = w / 4.0;
    let ch = w / 4.0;

    let dims = {minX: -3, maxX: 3, minY: -9, maxY: 1};
    let coords = [{x: 0, y: 0}];

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

    let y = d3.scaleLinear()
        .domain([-9, 1])
        .range([ch, 0]);

    let x = d3.scaleLinear()
        .domain([3, 3])
        .range([0, cw]);

    // svg.selectAll("circle")
    //     .data(coords)
    //     .enter()
    //     .append("circle")
    //     .attr('cx', (d) => x(d.x))
    //     .attr('cy', (d) => y(d.y))
    //     .attr("r", cw / 100)
    //     .style("fill", "#009DDC")
    //     .style("stroke", "#f5f5f5")
    //     .style("stroke-width", "0.5");

    let mcmc = () => {
        setTimeout(() => {
            svg.selectAll("circle")
                .data(coords)
                .enter()
                .append("circle")
                .attr('cx', (d) => x(d.x))
                .attr('cy', (d) => y(d.y))
                .attr("r", cw / 100)
                .style("fill", "#009DDC")
                .style("stroke", "#f5f5f5")
                .style("stroke-width", "0.5");

            coords.push({x: Math.random() * (dim.maxX - dim.minX) + dim.minX, y: Math.random() * (dim.maxY - dim.minY) + dim.minY})
        }, 1000);
    }

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

