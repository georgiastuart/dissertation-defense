import * as d3 from "d3";
import { get_width, banana } from "./util"

export default function () {
    let w = get_width() / 8;
    let h = w;

    let n = w;
    let m = h;
    let values = new Array(n * m);

    console.log(values.length);

    for (var j = 0.5, k = 0; j < m; ++j) {
        for (var i = 0.5; i < n; ++i, ++k) {
            values[k] = banana(9 - j / m * 10, i / n * 6 - 3);
        }
    }



    let num_contours = 5;
    let min = Math.min(...values);
    let max = Math.max(...values);

    let thresholds = Array.from({length: num_contours}, (_, i) => (max - min) / num_contours * i + min);
    let color = d3.scaleSequential(d3.extent(thresholds), d3.interpolateRgb('#f5f5f5', 'orange'))


    let contours = d3.contours()
            .size([n, m])
            .thresholds(thresholds)
            (values);
    return {'contours': contours, 'colors': color}
}

