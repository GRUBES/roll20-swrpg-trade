/**
 * Core logic for Chase encounters
 *
 * @module swrpg/nav/chase
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import { sendPrivate } from "../util/chat";
import {Dice, Macros} from "../util/enums";

/* Sender of chat messages */
const SpeakingAs = "GNN News Runner";

const display = () => {
    let content = {
        title: "Chase Encounter",
        flavor: "Competitive Piloting checks",
        prewide: "Step 1: Decide appropriate scale (Planetary or Personal)",
        wide: "Step 2: Decide Vehicles' relative starting distance (Range Bands)",
        wide2: `Step 3: Determine Difficulty for each Vehicle: ${Macros.navMain}`,
        wide3: `Vehicle with more ${Dice.Success(1)} opens/closes relative distance by one band`,
        wide4: "If the winner is traveling faster than the loser, open/close by one additional band",
        wide5: "Chase ends when Vehicles are at Engaged/Close range or beyond Extreme range"
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Mechanics for acquiring and leveraging Contact Networks
     *
     * @returns {void} sends output to Roll20 chat
     *
     * @function
     */
    display as main
}
