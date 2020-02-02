/**
 * Core logic for the recovery rules
 *
 * @module swrpg/recovery/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import { sendPrivate } from "../util/chat";
import { Macros } from "../util/enums";

/* Sender of chat messages */
const SpeakingAs = "TB-77";

// Rules for recovering from Critical Hits to a Vehicle
export const hit = () => {
    let content = {
        title: "Critical Hit Recovery"
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering from Hull Trauma to a Vehicle
export const hull = () => {
    let content = {
        title: "Hull Trauma Recovery"
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering from Critical Injuries
export const injury = () => {
    let content = {
        title: "Critical Injury Recovery"
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering from Strain
export const strain = () => {
    let content = {
        title: "Strain Recovery"
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering System Strain on a Vehicle
export const system = () => {
    let content = {
        title: "System Strain Recovery"
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering from Wounds
export const wound = () => {
    let content = {
        title: "Wound Recovery",
        wide: "Full night rest: recover 1 Wound"
    };
    sendPrivate(SpeakingAs, content);
};

// Main recovery UI
const display = () => {
    let content = {
        title: "Medical Bay",
        wide: "**Character:**",
        wide2: `${Macros.recoverWound} ${Macros.recoverStrain} ${Macros.recoverInjury}`,
        wide3: "**Vehicle:**",
        wide4: `${Macros.recoverHull} ${Macros.recoverSystem} ${Macros.recoverHit}`
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Display the Recovery UI in chat
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    display as main
}
