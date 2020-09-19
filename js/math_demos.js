import mcmc from './math_demos/mcmc.js'
import contour from './math_demos/generate_banana'
import { banana } from "./math_demos/util";

let banana_contour = contour();

mcmc(banana_contour, banana);
