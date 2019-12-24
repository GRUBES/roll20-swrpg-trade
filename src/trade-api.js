/**
 * Entry point module for the Galactic Economy system
 *
 * @module swrpg/trade/api
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import { version } from "../package.json";

on("ready", () => {
    log(`[SWT] v${version} loaded.`);
});
