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
import {Dice, DifficultyToDice, Macros} from "../util/enums";

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
        title: "Critical Injury Recovery",
        flavor: "Difficulty of all checks is set by Severity of Critical Injury",
        prewide: `
            **All Characters:**
            - *Once per full Week of Rest*: **Resilience** check
        
            **Humanoids/Non-Droids:**
            - (Once per Week) *Another character* may perform **Medicine** check 
            - (Once per 24 hours) *Bacta Tank:* **Resilience** check
            
            **Droids:**
            - (Once per Week) *Another character* may perform **Mechanics** check`,
        header: "Difficulty Modifiers:",
        wide: "Increase by 2 for character healing/repairing their own Injury",
        wide2: "Increase by 1 if proper equipment is not available",
    };
    sendPrivate(SpeakingAs, content);
};

/**
 * Calculate difficulty of Medicine check for recovery
 *
 * @param wounds {number} target's current wound value
 * @param threshold {number} target's wound threshold
 * @param isSelfHeal {boolean} true if the target is healing themself; false otherwise
 * @param hasEquipment {boolean} true if the healer has appropriate medical equipment; false otherwise
 *
 * @returns {number} Difficulty of Medicine check
 *
 * @private
 * @function
 */
const medicineDifficulty = (wounds, threshold, isSelfHeal, hasEquipment) => {
    /*
     * E-CRB 220
     * Wounds <= half of Threshold -> Easy
     * Wounds > half of Threshold -> Average
     * Wounds > Threshold -> Hard
     */
    let ratio = wounds / threshold;
    let diff = (ratio > 1) ? 3 : ((ratio > 0.5) ? 2 : 1);

    /*
     * E-CRB 219
     * A character may attempt to heal their own normal wounds ... but increases
     * the difficulty twice.
     */
    if (isSelfHeal) {
        diff += 2;
    }

    /*
     * E-CRB 219
     * ... attempting a Medicine check without the proper equipment increases difficulty by one
     */
    if (!hasEquipment) {
        diff += 1;
    }

    return Math.min(diff, 5);
};

/**
 * Display Medical Care UI
 *
 * @param wounds {number} target's current wound value
 * @param threshold {number} target's wound threshold
 * @param isSelfHeal {boolean} true if the target is healing themself; false otherwise
 * @param hasEquipment {boolean} true if the healer has appropriate medical equipment; false otherwise
 *
 * @returns {void} Displays output to chat
 *
 * @function
 */
export const medicine = (wounds, threshold, isSelfHeal, hasEquipment) => {
    let diff = medicineDifficulty(parseInt(wounds), parseInt(threshold), parseInt(isSelfHeal), parseInt(hasEquipment));

    let content = {
        title: "Medical Care",
        flavor: `- Medicine check for humanoids
        - Mechanics check for droids`,
        prewide: `(${DifficultyToDice[diff]})`,
        header: "Target Recovers:",
        wide: `one Wound per ${Dice.Success(1)}`,
        wide2: `one Strain per ${Dice.Advantage(1)}`
    };
    sendPrivate(SpeakingAs, content);
};

// Rules for recovering from Strain
export const strain = () => {
    let content = {
        title: "Strain Recovery Options",
        wide: `*Once during an Encounter:*
            ${Macros.recoverMedicine}`,
        wide2: `*After an Encounter:*
            **Discipline** or **Cool (${Dice.Difficulty.SIMPLE})**
            - recover 1 Strain per ${Dice.Success(1)}`,
        wide3: `*Full night rest:*
            - recover all Strain`
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
        title: "Wound Recovery Options",
        wide: "*Full night rest:* recover 1 Wound",
        wide2: `**Once per Encounter:**
            ${Macros.recoverMedicine}`,
        wide3: `**Humanoids/Non-Droids:**
            - *Stimpack*: requires one Maneuver; recover 5 Wounds with first, then 4, then 3, etc; limit 5 per day.
            - *Bacta Tank*:
            -- If wounded, recover 1 Wound per 2 hours
            -- If incapacitated, recover 1 Wound per 6 hours`,
        wide4: `**Droids:**
            - *Repair Patch:* requires one Maneuver; recover 3 Wounds; limit 5 per day
            - *Oil Bath:* recover 1 Wound per hour`
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
