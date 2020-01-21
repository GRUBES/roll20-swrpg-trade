/**
 * Core logic for slicing encounters
 *
 * @module swrpg/slice/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Dice, Macros} from "../util/enums";
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
        wide: `*Cantina Terminal, Datapad*: ${Dice.Difficulty.EASY}`,
        wide2: `*Common Vehicle Computer*: ${Dice.Difficulty.AVERAGE}`,
        wide3: `*Local HoloNet, Military system*: ${Dice.Difficulty.HARD}`,
        wide4: `*Regional HoloNet, Imperial Datavault*: ${Dice.Difficulty.DAUNTING}`,
        wide5: `*Ancient Archive*: ${Dice.Difficulty.FORMIDABLE}`,
        prewide: `**Defensive Slicing** adds ${Dice.Setback(1)} per Rank
            **Improved Defensive Slicing** upgrades difficulty per Rank`
    };
    sendPrivate(SpeakingAs, content);
};

const activateSecurity = () => {
    let content = {
        title: "Activate a Security Program",
        flavor: `Computers (${Dice.Difficulty.AVERAGE})`
    };
    sendPrivate(SpeakingAs, content);
};

// Disabling a Security Program has same difficulties as System Access check
const disableSecurity = access;

const display = () => {
    let content = {
        title: "Slicing Encounter",
        flavor: "Actions with * may only be executed by an Intruder when no Security Programs are active.",
        prewide: `*Active Security Programs: ${SecurityPrograms}*
              ${Macros.sliceIncrease} ${Macros.sliceDecrease} ${Macros.sliceReset}`,
        wide: Macros.sliceAccess,
        wide2: `${Macros.sliceActivate} ${Macros.sliceDisable}`,
        wide3: `${Macros.sliceEnact} ${Macros.sliceLockdown}`,
        wide4: `${Macros.sliceExpel} ${Macros.sliceTrace}`
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
