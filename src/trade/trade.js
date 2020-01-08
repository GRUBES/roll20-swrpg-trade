import {clamp} from "../util/math";

const speakingAs = "Trade Representative";

/**
 * Enumeration of proximity to major trade route
 *
 * @enum {number}
 * @readonly
 */
const Proximity = {
    ON: 0,
    NEAR: 1,
    FAR: 2
};

/**
 * Enumeration of population values for the trade location
 *
 * @enum {number}
 * @readonly
 */
const Population = {
    HIGH: 0,
    AVERAGE: 1,
    LOW: 2,
    NONE: 3
};

/**
 * Enumeration of the Regions of the Galaxy
 *
 * @enum {number}
 * @readonly
 */
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

/**
 * Maps a population value to its rarity modifier
 *
 * @enum {number}
 * @readonly
 */
const PopulationToModifier = {
    [Population.HIGH]: -1,
    [Population.AVERAGE]: 0,
    [Population.LOW]: 1,
    [Population.NONE]: 4
};

/**
 * Maps a trade route proximity value to its rarity modifier
 *
 * @enum {number}
 * @readonly
 */
const ProximityToModifier = {
    [Proximity.ON]: -1,
    [Proximity.NEAR]: 0,
    [Proximity.FAR]: 1
};

/**
 * Maps a galactic Region to its rarity modifier
 *
 * @enum {number}
 * @readonly
 */
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
 * Calculates and displays results for trading an display to the GM
 *
 * @param rarity {number} Rarity of the display being purchased
 * @param region {Region} The Region in which the display is being purchased
 * @param tradeProximity {Proximity} Current proximity to major trade route
 * @param population {Population} relative population of planet on which the display is being purchased
 * @param basePrice {number} the base price of the display being purchased
 *
 * @return {void} sends output to Roll20 chat
 */
const display = (rarity, region, tradeProximity, population, basePrice) => {
    let data = calculate(rarity, region, tradeProximity, population, basePrice);
    let msg = [
        "/w gm &{template:base}",
        `{{title=Trade Negotiations}}`,
        `{{Difficulty: ${data.difficulty}}}`,
        `{{Purchase Price: ${data.purchasePrice}}}`,
        `{{Sell Prices: ${data.sellPrices.join(" | ")}}}`
    ].join(" ");
    sendChat(speakingAs, msg, null, {noarchive: true});
};

/**
 * Mechanics for trading an display
 *
 * @param rarity {number} Rarity of the display being purchased
 * @param region {Region} The Region in which the display is being purchased
 * @param tradeProximity {Proximity} Current proximity to major trade route
 * @param population {Population} relative population of planet on which the display is being purchased
 * @param basePrice {number} the base price of the display being purchased
 *
 * @return {{difficulty: number, purchasePrice: number, sellPrices: number[]}}
 */
const calculate = (rarity, region, tradeProximity, population, basePrice) => {
    let diff = difficulty(rarity, region, tradeProximity, population);
    let buy = purchasePrice(diff, basePrice);
    let sell = sellPrices(buy);

    return {difficulty: diff, purchasePrice: buy, sellPrices: sell};
};

/**
 * Calculates the Difficulty of the Negotiation or Streetwise check needed to locate a buyer or
 * seller for the desired display
 *
 * @param rarity {number} the Rarity of the desired display
 * @param region {Region} the Region where the trade is taking place
 * @param tradeProximity {Proximity} the proximity to major trade route(s)
 * @param population {Population} the population of the location of the trade
 *
 * @returns {number} the Difficulty of the required check
 */
const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
    rarityToDifficulty(rarity),
    RegionToModifier[region],
    ProximityToModifier[tradeProximity],
    PopulationToModifier[population]
].reduce((t, v) => t + v));

/**
 * Calculates the recommended Purchase Price of the display for this trade
 *
 * @param diff {number} the Difficulty of the trade check
 * @param basePrice {number} the standard value of the display
 *
 * @returns {number} the modified value of the display for this trade
 */
const purchasePrice = (diff, basePrice) => clampModifier(diff) * basePrice;

/**
 * Calculates the recommended Sale Prices of the display.
 *
 * @param purchasePrice
 *
 * @returns {number[]} list of recommended Sale Prices. The first element is the base Sale Price,
 *  the second is for two successes in the sale check, and the third is for three or more successes.
 */
const sellPrices = (purchasePrice) => [purchasePrice / 4, purchasePrice / 2, purchasePrice * 0.75];

/**
 * Maps an display's Rarity to the appropriate Difficulty
 *
 * @param r {number} the Rarity
 *
 * @returns {number} the base Difficulty of the check
 *
 * @private
 */
const rarityToDifficulty = (r = 0) => Math.floor(clampRarity(r) / 2);

const clampDifficulty = clamp(0, 5);
const clampModifier = clamp(1, 4);
const clampRarity = clamp(0, 10);

/**
 * Core logic for the Galactic Economy system
 *
 * @module swrpg/trade/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */
export {
    difficulty,
    display,
    purchasePrice,
    sellPrices
}
