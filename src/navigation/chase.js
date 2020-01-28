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

/* Sender of chat messages */
const SpeakingAs = "SecFor Holocam";

const display = () => {
    let content = {
        title: "Chase Encounter",
        wide: "Step 1: Determine range scale",
        wide2: "Step 2: Determine initial range separation",
        wide3: "Step 3: Determine Difficulty"
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Mechanics for acquiring and leveraging Contact Networks
     *
     *
     * @returns {void} sends output to Roll20 chat
     *
     * @function
     */
    display as main
}
