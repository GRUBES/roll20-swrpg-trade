/**
 * Core logic for the Contact Networks system
 *
 * @module swrpg/contacts/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import {clamp} from "../util/math";
import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
const speakingAs = "Information Broker";

/**
 * Enumeration of information Obscurity values for Contact Networks
 *
 * @enum {number}
 * @readonly
 */
const Obscurity = {
    COMMON: 0,
    STANDARD: 1,
    RESEARCH: 2,
    SPECIALIST: 3,
    GROUNDBREAKING: 4,
    SECRET: 5
};

/**
 * Enumeration of Reputation ranks for Contact Networks
 *
 * @enum {number}
 * @readonly
 */
const Reputation = {
    FAMOUS: 1,
    WELL_KNOWN: 2,
    AVERAGE: 3,
    UPSTART: 4,
    UNFAMILIAR: 5,
    ADVERSARY: 6
};

/**
 * Enumeration of information Relevance when leveraging Contact Networks
 *
 * @enum {number}
 * @readonly
 */
const Relevance = {
    VERY: 1,
    SOMEWHAT: 2,
    LITTLE: 3,
    NONE: 4
};

// Calculate results for Contact Network and display
const display = (scope, expertise, obscurity, reputation, relevance) => {
    let ab = ability(scope);
    let pf = proficiency(expertise);
    let diff = difficulty(obscurity);
    let time = responseTime(obscurity, reputation, relevance);

    // FIXME How can I roll this in private?
    eote.process.setup(`!eed ${ab}g ${diff}p upgrade(ability|${pf}) upgrade(difficulty|${relevance-1})`, speakingAs);

    sendPrivate(speakingAs, {title: "Response Time", Days: time});
};

// Calculate the number of ability dice the Contact Network uses
const ability = (scope) => clamp5(scope);

// Calculate the Difficulty of the Contact Network's skill check
const difficulty = (obscurity) => clamp5(obscurity);

// Calculate the number of ability upgrades the Contact Network receives
const proficiency = (expertise) => clamp5(expertise);

// Calculate the response time of the informant
const responseTime = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

const clamp5 = clamp(0, 5);

export {
    /**
     * Calculate the number of ability dice the Contact Network uses for its investigation check
     *
     * @param scope {number} the Contact Network's Scope ranking
     *
     * @returns {number} the number of ability dice to roll
     *
     * @function
     */
    ability,
    /**
     * Calculate the Difficulty of the Contact Network's investigation check
     *
     * @param obscurity {Obscurity} the Obscurity of the information being sought
     *
     * @returns {number} the base Difficulty of the check
     *
     * @function
     */
    difficulty,
    /**
     * Mechanics for acquiring and leveraging Contact Networks
     *
     * @param scope {number} the Scope rating of the Network
     * @param expertise {number} the Expertise rating of the Network
     * @param obscurity {number} the difficulty of acquiring the information
     * @param reputation {Reputation} the group's reputation with the Network
     * @param relevance {Relevance} the relevance of the knowledge to the Network
     *
     * @returns {void} sends output to Roll20 chat
     *
     * @function
     */
    display as investigate,
    /**
     * Calculate the number of ability upgrades the Contact Network receives
     *
     * @param expertise {number} the Contact Network's Expertise ranking
     *
     * @returns {number} the number of ability upgrades to perform
     *
     * @function
     */
    proficiency,
    /**
     * Calculate the Contact Network's approximate response time for this investigation
     *
     * @param obscurity {Obscurity} the Obscurity of the information being sought
     * @param reputation {Reputation} the party's Reputation rank with this Contact Network
     * @param relevance {Relevance} the Relevance of the information to the Contact Network's expertise
     *
     * @returns {number} the number of days it will take the Network to respond
     *
     * @function
     */
    responseTime
}
