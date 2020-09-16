import mcmc from './math_demos/mcmc.js'
import contour from './math_demos/generate_banana'

let banana = contour();

mcmc(banana);
