/**
 * Core logic for slicing encounters
 *
 * @module swrpg/slice/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Entities} from "../util/enums";
import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
const SpeakingAs = "H4-x0r";

/* Tracks number of security programs currently running */
let SecurityPrograms = 0;
const decreaseSecurity = () => {
    SecurityPrograms = Math.max(SecurityPrograms-1, 0);
    display();
};
const increaseSecurity = () => {
    SecurityPrograms++;
    display();
};
const resetSecurity = () => {
    SecurityPrograms = 0;
    display();
};

const access = () => {
    let content = {
        title: "Access Difficulties",
        "Unsecured or Access Known": "Simple (-)",
        "Cantina Terminal, Datapad": "Easy (1p)",
        "Common Vehicle Computer": "Average (2p)",
        "Local HoloNet, Military Base, Starship Network": "Hard (3p)",
        "Regional HoloNet, Imperial Datavault": "Daunting (4p)",
        "Ancient Archive": "Formidable (5p)",
        wide: "System Admin with Defensive Slicing adds 1blk per Rank",
        wide2: "System Admin with Improved Defensive Slicing upgrades difficulty per Rank"
    };
    sendPrivate(SpeakingAs, content);
};

const activateSecurity = () => {
    let content = {
        title: "Activate a Security Program",
        flavor: "Computers (2p)"
    };
    sendPrivate(SpeakingAs, content);
};

const display = () => {
    let content = {
        title: "Slicing Encounter",
        flavor: "Actions with * may only be executed by an Intruder when no Security Programs are active.",
        prewide: `Active Security Programs: ${SecurityPrograms}
              ${enums.Macros.sliceIncrease} ${enums.Macros.sliceDecrease} ${enums.Macros.sliceReset}`,
        wide: enums.Macros.sliceAccess,
        wide2: `${enums.Macros.sliceActivate} ${enums.Macros.sliceDisable}`,
        wide3: `${enums.Macros.sliceEnact} ${enums.Macros.sliceLockdown}`,
        wide4: `${enums.Macros.sliceExpel} ${enums.Macros.sliceTrace}`
    };
    sendPrivate(SpeakingAs, content);
};

export {
    access,
    activateSecurity,
    /**
     * Decrease the number of active Security Programs in the current system
     *
     * @returns {void}
     *
     * @function
     */
    decreaseSecurity,
    disableSecurity,
    /**
     * Display the primary Slicing UI in chat
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    display as main,
    /**
     * Increase the number of active Security Programs in the current system
     *
     * @returns {void}
     *
     * @function
     */
    increaseSecurity,
    /**
     * Reset the number of active Security Programs in the current system to zero
     *
     * @returns {void}
     *
     * @function
     */
    resetSecurity
}
