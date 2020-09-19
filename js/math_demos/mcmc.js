import * as d3 from "d3";
import {get_half_width, drawStep, banana, margin, createLinkNodes} from "./util"
import {dim, yScale, xScale } from "./generate_banana";

export default function (contourmap, distribution) {
    let w = get_half_width();
    let h = w;

    let cw = w / 4.0;
    let ch = cw;
    let radius = cw / 50;

    let coords = [{x: 0, y: 4}];

    let svg = d3.select("#mcmc-demo")
        .append("svg")
        .attr("viewBox", [0, 0, cw, ch])
        .attr("width", w + 2 * margin)
        .attr("height", h + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");


    // let g = svg.append("g")
    //     .attr("transform", "rotate(180 " + cw / 2 + " " + ch / 2 + ")");

    console.log(contourmap);
    svg.selectAll("path")
        .data(contourmap.contours)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => contourmap.colors(d.value))
        .attr("stroke", "#f5f5f5");


    // svg.append("g")
    //     .call(d3.axisLeft(y));


    let stop = false;
    let num_to_test = 5000;
    let count = 0;
    let accepted = 0;
    let delay = 1000;

    let mcmc = async () => {
        svg.select("#proposed").remove();
        svg.select("#current").remove();

        svg.selectAll("circle")
            .data(coords)
            .enter()
            .append("circle")
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .attr("r", radius)
            .style("fill", "grey")
            // .style("stroke", "#f5f5f5")
            // .style("stroke-width", "0.5")
            .style("fill-opacity", 0.25);



        let last_coord = coords[coords.length - 1];
        let new_coord = {x: 0, y: 0};
        new_coord.x = last_coord.x + drawStep(1);
        new_coord.y = last_coord.y + drawStep(1);

        svg.append("circle")
            .attr("cx", xScale(last_coord.x))
            .attr("cy", yScale(last_coord.y))
            .attr("r", radius)
            .attr("id", "current")
            .style("fill", "none")
            .style("stroke", "#009DDC")
            .style("stroke-width", "1")
            .style("fill-opacity", 0);

        svg.append("circle")
            .attr("cx", xScale(new_coord.x))
            .attr("cy", yScale(new_coord.y))
            .attr("r", radius)
            .attr("id", "proposed")
            .style("fill", "#009DDC")
            .style("stroke", "#f5f5f5")
            .style("stroke-width", "0.5");


        await new Promise((accept) => setTimeout(accept, delay));
        console.log(banana(new_coord.y, new_coord.x) / banana(last_coord.y, last_coord.x))

        if (Math.random() < (banana(new_coord.y, new_coord.x) / banana(last_coord.y, last_coord.x))) {
            coords.push(new_coord);
            svg.select("#proposed")
                .style("fill", "green");
            accepted++;
        } else {
            coords.push(last_coord);
            svg.select("#proposed")
                .style("fill", "red");
        }

        await new Promise((accept) => setTimeout(accept, delay));


        // coords.push({x: Math.random() * (dim.maxX - dim.minX) + dim.minX, y: Math.random() * (dim.maxY - dim.minY) + dim.minY})
        count++;

        console.log("AR", accepted / count);

        if ((count < num_to_test) && !stop) {
            mcmc();
        }
    };

    d3.select("#mcmcstart")
        .on("click", () => {
            console.log("MCMC simulation started");
            stop = false;
            delay = 2000;
            mcmc();
        });


    d3.select("#mcmcstop")
        .on("click", () => {
            console.log("MCMC simulation stopped")
            stop = true;
        });

    d3.select("#mcmcreset")
        .on("click", () => {
            console.log("resetting simulation");
            stop = true;
            count = 0;
            accepted = 0;
            coords = [{x: 0, y: 4}];

            svg.selectAll("circle").remove();
        })

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

