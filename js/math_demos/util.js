export function get_width() {
    let sw = window.screen.width;

    if (sw < 640) {
        return sw;
    } else if (sw < 768) {
        return 640;
    } else if (sw < 1024) {
        return 768;
    } else if (sw < 1280) {
        return 1024;
    } else {
        return 1280;
    }
}

export function rosenbrock(y, x) {
    return Math.pow((1 - x), 2) + 100 * Math.pow((y - Math.pow(x, 2)), 2)
}

export function banana(y, x) {
    let a = 1.0, b = 1.0, cov = 0.9, k = 2.0, variance = 1.0;
    let xHat = a * x;
    let yHat = y / a - b * (Math.pow(xHat, 2) + 1)

    let determinant = Math.pow(variance, 2) - Math.pow(cov, 2);
    let coef = Math.pow(2 * Math.PI, -k/2.0) * Math.pow(determinant, -1/2);
    let exponent = -0.5 * (xHat * (cov * yHat + variance * xHat) + yHat * (cov * xHat + variance * yHat))
    let value = coef * Math.exp(exponent);

    if (value === NaN) {
        console.log(determinant, coef, exponent, coef * Math.exp(exponent));
    }

    return value;

}

