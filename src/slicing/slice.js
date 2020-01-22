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
        flavor: "Computers (INT)",
        prewide: `**Defensive Slicing** adds ${Dice.Setback(1)} per Rank
            **Improved Defensive Slicing** upgrades difficulty per Rank`,
        wide: `*Cantina Terminal, Datapad*: ${Dice.Difficulty.EASY}`,
        wide2: `*Common Vehicle Computer*: ${Dice.Difficulty.AVERAGE}`,
        wide3: `*Local HoloNet, Military system*: ${Dice.Difficulty.HARD}`,
        wide4: `*Regional HoloNet, Imperial Datavault*: ${Dice.Difficulty.DAUNTING}`,
        wide5: `*Ancient Archive*: ${Dice.Difficulty.FORMIDABLE}`
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

const backdoor = () => {
    let content = {
        title: "Create or Locate Backdoor",
        flavor: `Computers (${Dice.Difficulty.HARD})`
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

const enact = () => {
    let content = {
        title: "Enact Command",
        flavor: "Computers",
        wide: "Difficulty is set by similarity of command to the intended function of the system"
    };
    sendPrivate(SpeakingAs, content);
};

const expel = () => {
    let content = {
        title: "Expel User",
        flavor: "Opposed Computers",
        prewide: `Add ${Dice.Boost(1)} per known Signature fragment`,
        wide: "If expelled, upgrade the difficulty of further Access System checks by two"
    };
    sendPrivate(SpeakingAs, content);
};

const lockdown = () => {
    let content = {
        title: "Lockdown",
        flavor: `Computers (${Dice.Difficulty.HARD})`,
        wide: "Character must have physical access to restart the system"
    };
    sendPrivate(SpeakingAs, content);
};

const restart = () => {
    let content = {
        title: "Restart System",
        flavor: `Computers (${Dice.Difficulty.AVERAGE})`,
        wide: "Must have physical access",
        wide2: "Takes one hour"
    };
    sendPrivate(SpeakingAs, content);
};

const trace = () => {
    let content = {
        title: "Trace User",
        flavor: "Opposed Computers",
        prewide: `Add ${Dice.Boost(1)} per known Signature fragment`,
        header: "On Success, learn one of:",
        wide: "Target's physical location",
        wide2: "One segment of target's Signature",
        wide3: "Full list of actions target has taken in system this encounter"
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Display information on the Access System action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    access,
    /**
     * Display information on the Activate Security System action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    activateSecurity,
    /**
     * Display information on identifying a Backdoor in the system
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    backdoor,
    /**
     * Decrease the number of active Security Programs in the current system
     *
     * @returns {void}
     *
     * @function
     */
    decreaseSecurity,
    /**
     * Display information on the Disable Security System action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
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
     * Display information on the Enact Command action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    enact,
    /**
     * Display information on the Expel User action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    expel,
    /**
     * Increase the number of active Security Programs in the current system
     *
     * @returns {void}
     *
     * @function
     */
    increaseSecurity,
    /**
     * Display information on the Lockdown action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    lockdown,
    /**
     * Reset the number of active Security Programs in the current system to zero
     *
     * @returns {void}
     *
     * @function
     */
    resetSecurity,
    /**
     * Display information on the Restart System action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    restart,
    /**
     * Display information on the Trace User action
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    trace
}
