/**
 * Core logic for item repair
 *
 * @module swrpg/repair/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
const speakingAs = "Repair Droid";

/**
 * Enumeration of Item Conditions
 *
 * @enum {number}
 * @readonly
 */
const Condition = {
    NEW: 0,
    MINOR: 1,
    MODERATE: 2,
    MAJOR: 3
};

/**
 * Maps an Item's Condition to its cost modifier
 *
 * @enum {number}
 * @readonly
 */
const CostModifier = {
    [Condition.NEW]: 0,
    [Condition.MINOR]: 0.25,
    [Condition.MODERATE]: 0.50,
    [Condition.MAJOR]: 1,
};

// Calculate repair values and display to GM
const display = (condition, basePrice) => {
    let diff = difficulty(condition);
    let price = cost(condition, basePrice);
    let content = {
        title: "Item Repair",
        Difficulty: diff,
        "Repair Cost": price,
        "Adv or Thr": "modifies cost accordingly by 10% each for self repair"
    };
    sendPrivate(speakingAs, content);
};

// Calculate the Difficulty of the repair check
const difficulty = (condition) => condition;

// Calculate the material cost of the repairs
const cost = (condition, basePrice) => basePrice * CostModifier[condition];

export {
    /**
     * Calculates the material cost of the repairs being performed
     *
     * @param condition {Condition} the current Condition of the item being repaired
     * @param basePrice {number} the standard value of the item being repaired
     *
     * @return {number} the cost in credits of the repairs being performed
     *
     * @function
     */
    cost,
    /**
     * Calculates the Difficulty of the repair check
     *
     * @param condition {Condition} the current Condition of the item being repaired
     *
     * @return {number} the Difficulty of the repair check
     *
     * @function
     */
    difficulty,
    /**
     * Calculates and displays results for repairing an item to the GM
     *
     * @param condition {Condition} the condition of the item
     * @param basePrice {number} the base price of the item
     *
     * @return {void} sends output to Roll20 chat
     *
     * @function
     */
    display as item
}
