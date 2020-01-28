/**
 * Core logic for Terrain and Stellar Navigation challenges
 *
 * @module swrpg/nav/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import { sendPrivate } from "../util/chat";

/* Sender of chat messages */
const SpeakingAs = "Navigator Holomap";

const display = () => {
    let content = {
        title: "Terrain Navigation",
        wide: "Step 1: Determine range scale",
        wide2: "Step 2: Determine initial range separation",
        wide3: "Step 3: Determine Difficulty"
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
