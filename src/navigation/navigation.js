/**
 * Core logic for Terrain and Stellar Navigation challenges
 *
 * @module swrpg/nav/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {sendPrivate} from "../util/chat";
import {Dice, DifficultyToDice} from "../util/enums";
import {pool} from "../util/dice";

/* Sender of chat messages */
const SpeakingAs = "Navigator Holomap";

/**
 * Build appropriate difficulty pool for the navigation check
 *
 * @param speed {number} vehicle's current speed
 * @param silhouette {number} vehicle's silhouette
 * @param hazard {number} navigational hazard rating
 *
 * @returns {Object}
 */
const difficulty = (speed, silhouette, hazard) => {
    log(JSON.stringify({speed, silhouette}));
    let cmd = `!eed ${speed}p ${hazard}blk upgrade(difficulty|${Math.ceil(silhouette/2)})`;
    let result = pool(cmd);
    return result.count;
};

const display = (speed, silhouette, hazard) => {
    let count = difficulty(parseInt(speed), parseInt(silhouette), parseInt(hazard));
    let content = {
        title: "Terrain Navigation",
        flavor: "Piloting (Space) or Piloting (Planetary)",
        prewide: [
            count.difficulty ? DifficultyToDice[count.difficulty] : "",
            count.challenge ? Dice.Challenge(count.challenge) : "",
            count.setback ? Dice.Setback(count.setback) : ""
        ].filter(Boolean).join(""),
        header: "Outcome Suggestions",
        wide: `${Dice.Failure(1)} Unsuccessful navigation and speed decreases by 1`,
        wide2: `${Dice.Despair(1)} May result in a collision`
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Displays the UI for navigation challenges
     *
     * @returns {void} sends output to Roll20 chat
     *
     * @function
     */
    display as main
}
