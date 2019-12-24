/**
 * Core logic for the Galactic Economy system
 *
 * @module swrpg/trade/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

const speakingAs = "Trade Representative";

const Proximity = {
    ON: 0,
    NEAR: 1,
    FAR: 2
};

const Population = {
    HIGH: 0,
    AVERAGE: 1,
    LOW: 2,
    NONE: 3
};

const Region = {
    CORE: 0,
    COLONIES: 1,
    INNER_RIM: 2,
    MID_RIM: 3,
    OUTER_RIM: 4,
    EXPANSION: 5,
    WILD: 6,
    UNKNOWN: 7
};

const PopulationToModifier = {
    [Population.HIGH]: -1,
    [Population.AVERAGE]: 0,
    [Population.LOW]: 1,
    [Population.NONE]: 4
};

const ProximityToModifier = {
    [Proximity.ON]: -1,
    [Proximity.NEAR]: 0,
    [Proximity.FAR]: 1
};

const RegionToModifier = {
    [Region.CORE]: -1,
    [Region.COLONIES]: 0,
    [Region.INNER_RIM]: 0,
    [Region.MID_RIM]: 1,
    [Region.OUTER_RIM]: 2,
    [Region.EXPANSION]: 2,
    [Region.WILD]: 3,
    [Region.UNKNOWN]: 4
};

/**
 * Mechanics for trading an item
 *
 * @param rarity {number} Rarity of the item being purchased
 * @param region {Region} The Region in which the item is being purchased
 * @param tradeProximity {Proximity} Current proximity to major trade route
 * @param population {Population} relative population of planet on which the item is being purchased
 * @param basePrice {number} the base price of the item being purchased
 *
 * @return {void} sends output to Roll20 chat
 */
const execute = (rarity, region, tradeProximity, population, basePrice) => {
    let diff = difficulty(rarity, region, tradeProximity, population);
    let purchasePrice = clampModifier(diff) * basePrice;
    let sellPrices = [purchasePrice / 4, purchasePrice / 2, purchasePrice * 0.75];

    let msg = [
        "/w gm &{template:base}",
        `{{title=Trade Negotiations}}`,
        `{{Difficulty: ${diff}}}`,
        `{{Purchase Price: ${purchasePrice}}}`,
        `{{Sell Prices:`,
        sellPrices.join(" | "),
        `}}`
    ].join(" ");
    sendChat(speakingAs, msg);
};

const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
        rarityToDifficulty(rarity),
        RegionToModifier[region],
        ProximityToModifier[tradeProximity],
        PopulationToModifier[population]
    ].reduce((t, v) => t + v));


const rarityToDifficulty = (r = 0) => Math.floor(clampRarity(r) / 2);

const clamp = (min, max) => v => Math.max(Math.min(v, max), min);
const clampDifficulty = clamp(0, 5);
const clampModifier = clamp(1, 4);
const clampRarity = clamp(0, 10);

export {
    execute
}
