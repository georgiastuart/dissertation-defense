import * as d3 from "d3";
import { get_width, rosenbrock } from "./util"

export default function () {
    let w = get_width();
    let h = w * 0.5;

    let n = w;
    let m = h;
    let values = new Array(n * m);

    for (var j = 0.5, k = 0; j < m; ++j) {
        for (var i = 0.5; i < n; ++i, ++k) {
            values[k] = rosenbrock(3 - j / m * 4, i / n * 4 - 2);
        }
    }



    let num_contours = 30;
    let min = 0;
    let max = 800;

    let thresholds = Array.from({length: num_contours}, (_, i) => (max - min) / num_contours * i + min);
    let color = d3.scaleSequential(d3.extent(thresholds), d3.interpolateRgb('orange', 'green'))


    let contours = d3.contours()
            .size([n, m])
            .thresholds(thresholds)
            (values);
    return {'contours': contours, 'colors': color}
}

