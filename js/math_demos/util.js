export let margin= 0;

export function get_width() {
    let sw = window.screen.width;

    if (sw < 640) {
        return sw - 2 * margin;
    } else if (sw < 768) {
        return 640 - 2 * margin ;
    } else if (sw < 1024) {
        return 768  - 2 * margin;
    } else if (sw < 1280) {
        return 1024 - 2 * margin;
    } else {
        return 1280 - 2 * margin;
    }
}

export function get_half_width() {
    let sw = window.innerWidth;
    console.log("screen width", sw);

    if (sw < 640) {
        return sw / 2 - 2 * margin;
    } else if (sw < 768) {
        return 640 / 2 - 2 * margin ;
    } else if (sw < 1024) {
        return 768 / 2  - 2 * margin;
    } else if (sw < 1280) {
        return 1024 / 2 - 2 * margin;
    } else {
        return 1280 / 2 - 2 * margin;
    }
}

export function rosenbrock(y, x) {
    return Math.pow((1 - x), 2) + 100 * Math.pow((y - Math.pow(x, 2)), 2)
}

export function banana(y, x) {
    let a = 1.0, b = 1.0, cov = 0.9, k = 2.0, variance = 1.0;
    let xHat = a * x;
    let yHat = y / a - b * (Math.pow(xHat, 2) + Math.pow(a, 2))

    let determinant = Math.pow(variance, 2) - Math.pow(cov, 2);
    let coef = Math.pow(2 * Math.PI, -k/2.0) * Math.pow(determinant, -1/2);
    let exponent = -0.5 * (xHat * (cov * yHat + variance * xHat) + yHat * (cov * xHat + variance * yHat))
    let value = coef * Math.exp(exponent);

    if (value === NaN) {
        console.log(determinant, coef, exponent, coef * Math.exp(exponent));
    }

    return value;

}

// Standard Normal variate using Box-Muller transform.
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    let u = 0;
    let v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export function drawStep(step) {
    return randn_bm() * step;
}

export function createLinkNodes(start, end, radius, markerWidth, xScale, yScale) {
    let xdiff = end.x - start.x;
    let ydiff = end.y - start.y;
    let angle = Math.acos(Math.abs(xdiff) / Math.sqrt(xdiff * xdiff + ydiff * ydiff))

    console.log(xdiff, ydiff, angle);

    let linkStart = {x: xScale(start.x), y: yScale(start.y)};
    let linkEnd = {x: xScale(end.x), y: yScale(end.y)};

    if (xdiff < 0) {
        linkStart.x -= Math.cos(angle) * radius;
        linkEnd.x += Math.cos(angle) * radius + markerWidth
    } else if (xdiff > 0) {
        linkStart.x += Math.cos(angle) * radius;
        linkEnd.x -= Math.cos(angle) * radius + markerWidth
    }

    if (ydiff < 0) {
        linkStart.y += Math.sin(angle) * radius;
        linkEnd.y -= Math.sin(angle) * radius + markerWidth;
    } else if (ydiff > 0) {
        linkStart.y -= Math.sin(angle) * radius;
        linkEnd.y += Math.sin(angle) * radius + markerWidth;
    }

    return {start: linkStart, end: linkEnd}
}
