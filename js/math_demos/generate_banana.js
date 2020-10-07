import * as d3 from "d3";
import {get_width, banana, get_half_width} from "./util"

let w = get_half_width() / 4;
let h = w;

export const dim = {minX: -3, maxX: 3, minY: -1, maxY: 9};

export const yScale = d3.scaleLinear()
    .domain([dim.minY, dim.maxY])
    .range([h, 0]);

export const xScale = d3.scaleLinear()
    .domain([dim.minX, dim.maxX])
    .range([0, w]);


export default function () {
    let w = get_half_width() / 4;
    let h = w;

    let n = w;
    let m = h;
    let values = new Array(n * m);

    console.log(values.length);

    for (let j = 0.5, k = 0; j < m; j++) {
        for (let i = 0.5; i < n; i++, k++) {
            values[k] = banana((m - j) / m * (dim.maxY - dim.minY) + dim.minY, i / n * (dim.maxX - dim.minX) + dim.minX)
        }
    }

    // for (var j = 0.5, k = 0; j < m; ++j) {
    //     for (var i = 0.5; i < n; ++i, ++k) {
    //         values[k] = banana(9 - j / m * 10, -(i / n * 6 - 3));
    //     }
    // }



    let num_contours = 5;
    let min = Math.min(...values);
    let max = Math.max(...values);

    let thresholds = Array.from({length: num_contours}, (_, i) => (max - min) / num_contours * i + min);
    let color = d3.scaleSequential(d3.extent(thresholds), d3.interpolateRgb('#ffffff', 'orange'))


    let contours = d3.contours()
            .size([n, m])
            .thresholds(thresholds)
            (values);
    return {'contours': contours, 'colors': color}
}

