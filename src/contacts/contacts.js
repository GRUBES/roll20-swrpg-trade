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

const speakingAs = "Information Broker";

const Reputation = {
    FAMOUS: 1,
    WELL_KNOWN: 2,
    AVERAGE: 3,
    UPSTART: 4,
    UNFAMILIAR: 5,
    ADVERSARY: 6
};

const Relevance = {
    VERY: 1,
    SOMEWHAT: 2,
    LITTLE: 3,
    NONE: 4
};

const investigate = (scope, expertise, obscurity, reputation, relevance) => {
    let ability = clamp5(scope);
    let proficiency = clamp5(expertise);
    let difficulty = clamp5(obscurity);
    let time = response(obscurity, reputation, relevance);

    let msg = `!eed ${ability}g ${difficulty}p upgrade(ability|${proficiency}) upgrade(difficulty|${relevance-1})`;
    sendChat(speakingAs, msg, null, {noarchive: true});

    msg = `/w gm &{template:base} {{title=Response Time}} {{${time} days}}`;
    sendChat(speakingAs, msg, null, {noarchive: true});
};

const response = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

const clamp5 = clamp(0, 5);

export {
    /**
     * Mechanics for acquiring and leveraging Contact Networks
     *
     * @param scope {number} the Scope rating of the Network
     * @param expertise {number} the Expertise rating of the Network
     * @param obscurity {number} the difficulty of acquiring the information
     * @param reputation {Reputation} the group's reputation with the Network
     * @param relevance {Relevance} the relevance of the knowledge to the Network
     *
     * @return {void} sends output to Roll20 chat
     */
    investigate
}
