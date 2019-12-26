/**
 * Core logic for item repair
 *
 * @module swrpg/repair/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

const speakingAs = "Repair Droid";

const Condition = {
    NEW: 0,
    MINOR: 1,
    MODERATE: 2,
    MAJOR: 3
};

const CostModifier = {
    [Condition.NEW]: 0,
    [Condition.MINOR]: 0.25,
    [Condition.MODERATE]: 0.50,
    [Condition.MAJOR]: 1,
};

/**
 * Mechanics for repairing an item
 *
 * @param condition {Condition} the condition of the item
 * @param basePrice {number} the base price of the item
 *
 * @return {void} sends output to Roll20 chat
 */
const item = (condition, basePrice) => {
    let msg = [
        "/w gm &{template:base}",
        `{{title=Item Repair}}`,
        `{{Difficulty: ${condition}}}`,
        `{{Repair Cost: ${basePrice * CostModifier[condition]}}}`,
        `{{Each Advantage reduces cost by 10% for self repair}}`
    ].join(" ");
    sendChat(speakingAs, msg, null, {noarchive: true});
};

export {
    item
}
