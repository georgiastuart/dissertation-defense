import mcmc from './math_demos/mcmc.js'
import hmc from './math_demos/hmc.js'
import contour from './math_demos/generate_banana'
import { banana } from "./math_demos/util";

let banana_contour = contour();

mcmc(banana_contour, banana);
hmc(banana_contour, banana);