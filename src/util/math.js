/**
 * Math utility module
 *
 * @module swrpg/util/math
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

// Clamp a value between two others, inclusive
const clamp = (min, max) => v => Math.max(Math.min(v, max), min);

export {
    /**
     * Partial function for clamping a value to a range, inclusive
     *
     * @param min {number} the minimum value of the clamp range
     * @param max {number} the maximum value of the clamp range
     * @param v {number} the value to clamp
     *
     * @returns {number} the clamped value
     *
     * @partial
     * @function
     */
    clamp
}
