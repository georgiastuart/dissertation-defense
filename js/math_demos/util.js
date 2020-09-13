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