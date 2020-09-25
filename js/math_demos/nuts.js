import * as d3 from "d3";
import {get_half_width, drawStep, banana, log_banana_gradient, log_banana, margin, createLinkNodes} from "./util"
import {dim, yScale, xScale } from "./generate_banana";



export default function (contourmap, distribution) {
    let w = get_half_width();
    let h = w;

    let cw = w / 4.0;
    let ch = cw;
    let radius = cw / 50;
    let delay = 1000;

    let coords = [{x: 0, y: 4}];

    let svg = d3.select("#nuts-demo")
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

    let ap = svg.append("text")
        .attr("id", "ap")
        .attr("x", xScale(dim.minX + 2))
        .attr("y", yScale(dim.maxY - 1))
        .attr("class", "demo-font")
        .text("Acc. prob.:\t");

    let check = svg.append("text")
        .attr("id", "check")
        .attr("x", xScale(dim.minX + 2))
        .attr("y", yScale(dim.maxY - 1.5))
        .attr("class", "demo-font")
        .text("Check:\t");

    let acc = svg.append("text")
        .attr("id", "acc")
        .attr("x", xScale(dim.minX + 2))
        .attr("y", yScale(dim.maxY - 2))
        .attr("class", "demo-font")
        .text("Accepted?:\t");

    let ar = svg.append("text")
        .attr("id", "ar")
        .attr("x", xScale(dim.minX + 2))
        .attr("y", yScale(dim.maxY - 2.5))
        .attr("class", "demo-font")
        .text("Acc. rate:\t");


    // svg.append("g")
    //     .call(d3.axisLeft(y));


    let stop = false;
    let num_to_test = 5000;
    let count = 0;
    let accepted = 0;

    let leapfrog = async (momentum, position, epsilon, L, gradient_fn) => {
        let qx = position.x, qy = position.y, mx = momentum.x, my = momentum.y;
        let grad = gradient_fn(qy, qx)
        mx -= 0.5 * epsilon * grad.x;
        my -= 0.5 * epsilon * grad.y;

        // await new Promise((accept) => setTimeout(accept, delay / 4));


        for (let i = 0; i < L; i++) {
            qx += epsilon * mx;
            qy += epsilon * my;


            if (i < L - 1) {
                grad = gradient_fn(qy, qx);
                mx -= epsilon * grad.x;
                my -= epsilon * grad.y;
            }
        }

        grad = gradient_fn(qy, qx)
        mx -= 0.5 * epsilon * grad.x;
        my -= 0.5 * epsilon * grad.y;

        return {position: {x: qx, y: qy}, momentum: {x: mx, y: my}};
    }

    let nuts = async (q, p, epsilon) => {
        let build_tree = async (q, p, u, v, j, epsilon) => {
            if (j === 0) {
                let result = await leapfrog(p, q, epsilon * v, 1, log_banana_gradient);
                let value = -log_banana(result.position.y, result.position.x) - 0.5 * (result.momentum.x * result.momentum.x + result.momentum.y * result.momentum.y);
                let n_prime =  (u < Math.exp(value)) | 0;
                let s_prime =  (value > Math.log(u) - 1000) | 0;
                console.log("value", value, u, n_prime, s_prime);

                svg.append("circle")
                    .attr('cx', xScale(result.position.x))
                    .attr('cy', yScale(result.position.y))
                    .attr("r", radius / 4)
                    .attr("id", "leapfrogPath")
                    .style("fill", n_prime ? "green" : "red")
                    .style("fill-opacity", 1);

                await new Promise((accept) => setTimeout(accept, delay / 4));

                return [{...result.position}, {...result.momentum},
                        {...result.position}, {...result.momentum},
                        {...result.position}, n_prime, s_prime]
            } else {
                let result = await build_tree(q, p, u, v, j - 1, epsilon);
                let q_neg = result[0], p_neg = result[1];
                let q_pos = result[2], p_pos = result[3];
                let q_prime = result[4];
                let n_prime = result[5];
                let s_prime = result[6];
                let q_2prime, n_2prime, s_2prime;

                console.log("sprime outside", s_prime);


                if (s_prime === 1) {
                    if (v === -1) {
                        result = await build_tree(q_neg, p_neg, u, v, j - 1, epsilon);
                        q_neg = result[0], p_neg = result[1];
                        q_2prime = result[4], n_2prime = result[5], s_2prime = result[6];
                    } else {
                        result = await build_tree(q_pos, p_pos, u, v, j - 1, epsilon);
                        q_pos = result[2], p_pos = result[3];
                        q_2prime = result[4], n_2prime = result[5], s_2prime = result[6];
                    }

                    if (Math.random() < (n_2prime / (n_prime + n_2prime))) {
                        q_prime = {...q_2prime}
                    }

                    svg.select("#currentacc")
                        .remove()
                        .append("circle")
                        .

                    s_prime = s_2prime * ((q_pos.x - q_neg.x) * p_neg.x + (q_pos.y - q_neg.y) * p_neg.y >= 0) * ((q_pos.x - q_neg.x) * p_pos.x + (q_pos.y - q_neg.y) * p_pos.y >= 0);
                    console.log("sprime", s_prime);
                    n_prime = n_prime + n_2prime;
                }

                return [{...q_neg}, {...p_neg}, {...q_pos}, {...p_pos}, {...q_prime}, n_prime, s_prime];
            }
        }

        let accept = false;
        let q_neg = {...q}, q_pos = {...q};
        let p_neg = {...p}, p_pos = {...p};
        let q_m = {...q};
        let u = Math.random() * Math.exp(-log_banana(q.y, q.x) - 0.5 * (p.x * p.x + p.y * p.y));
        let result, q_prime;

        let j = 0, n = 1, s = 1, v = 1, n_prime, s_prime;

        while ((s === 1) && (j < 10)) {
            if (Math.random() < 0.5) {
                v = -1;
            } else {
                v = 1;
            }

            if (v === -1) {
                result = await build_tree(q_neg, p_neg, u, v, j, epsilon);
                q_neg = result[0];
                p_neg = result[1];
                q_prime = result[4];
                n_prime = result[5];
                s_prime = result[6];
            } else {
                result = await build_tree(q_pos, p_pos, u, v, j, epsilon);
                q_pos = result[2];
                p_pos = result[3];
                q_prime = result[4];
                n_prime = result[5];
                s_prime = result[6];
            }

            console.log('Outside', s_prime, n_prime, n);

            if ((s_prime === 1) && (Math.random() < n_prime / n)) {
                accept = true;
                q_m = {...q_prime}
            }

            n += n_prime;
            s = s_prime * ((q_pos.x - q_neg.x) * p_neg.x + (q_pos.y - q_neg.y) * p_neg.y >= 0) * ((q_pos.x - q_neg.x) * p_pos.x + (q_pos.y - q_neg.y) * p_pos.y >= 0);
            console.log("s", s);
            j++;
        }
        return {position: q_m, accept: accept};
    }

    let mcmc = async () => {
        svg.select("#proposed").remove();
        svg.select("#current").remove();

        console.log(coords);

        svg.selectAll("#samples")
            .data(coords)
            .enter()
            .append("circle")
            .attr("id", "samples")
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .attr("r", radius)
            .style("fill", "grey")
            // .style("stroke", "#f5f5f5")
            // .style("stroke-width", "0.5")
            .style("fill-opacity", 0.25);


        svg.selectAll("#leapfrogPath").remove();

        let last_coord = coords[coords.length - 1];
        let momentum = {x: 0, y: 0};
        momentum.x = drawStep(1);
        momentum.y = drawStep(1);


        svg.append("circle")
            .attr("cx", xScale(last_coord.x))
            .attr("cy", yScale(last_coord.y))
            .attr("r", radius)
            .attr("id", "current")
            .style("fill", "none")
            .style("stroke", "#009DDC")
            .style("stroke-width", "1")
            .style("fill-opacity", 0);

        // svg.append("circle")
        //     .attr("cx", xScale(new_coord.x))
        //     .attr("cy", yScale(new_coord.y))
        //     .attr("r", radius)
        //     .attr("id", "proposed")
        //     .style("fill", "#009DDC")
        //     .style("stroke", "#f5f5f5")
        //     .style("stroke-width", "0.5");

        let result = await nuts(last_coord, momentum, 0.1)
        accepted += result.accept | 0;
        count++;
        let acc_r = accepted / count;

        ap.text("Acc. prob.: " + Math.min(acc_r, 1).toFixed(3));

        await new Promise((accept) => setTimeout(accept, delay));


        if (result.accept) {
            coords.push(result.position);
            svg.select("#proposed")
                .style("fill", "green");
            accepted++;
            acc.text("Accepted?: True")
        } else {
            coords.push(result.position);
            svg.select("#proposed")
                .style("fill", "red");
            acc.text("Accepted?: False")
        }

        ar.text("Acc. rate: " + (accepted / count).toFixed(3));
        await new Promise((accept) => setTimeout(accept, delay));


        // coords.push({x: Math.random() * (dim.maxX - dim.minX) + dim.minX, y: Math.random() * (dim.maxY - dim.minY) + dim.minY})

        console.log("AR", accepted / count);

        if ((count < num_to_test) && !stop) {
            mcmc();
        }
    };

    d3.select("#nutsstart")
        .on("click", () => {
            console.log("MCMC simulation started");
            stop = false;
            delay = 1000;
            mcmc();
        });


    d3.select("#nutsstop")
        .on("click", () => {
            console.log("MCMC simulation stopped")
            stop = true;
        });

    d3.select("#nutsreset")
        .on("click", () => {
            console.log("resetting simulation");
            stop = true;
            count = 0;
            accepted = 0;
            coords = [{x: 0, y: 4}];

            svg.selectAll("circle").remove();
        });

    d3.select("#nutsspeed")
        .on("click", () => {
            if (delay === 1000) {
                delay = 100;
            }  else {
                delay = 1000;
            }
            console.log("delay is now " + delay);
        });
}

