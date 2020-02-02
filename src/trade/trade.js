/**
 * Core logic for the Galactic Economy system
 *
 * @module swrpg/trade/core
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import {Dice, DifficultyToDice} from "../util/enums";
import {clamp} from "../util/math";
import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
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

// Calculate trade values and display to GM
const display = (rarity, region, tradeProximity, population, basePrice) => {
    let diff = difficulty(rarity, region, tradeProximity, population);
    let buy = Math.ceil(purchasePrice(diff, basePrice));
    let sellList = sellPrices(buy).map(Math.ceil);
    let content = {
        title: "Trade Negotiations",
        flavor: `Negotiation or Streetwise (${DifficultyToDice[diff]})`,
        prewide: `Purchase Price: ${buy}`,
        header: "Sell Prices",
        wide: `${Dice.Success(1)} ${sellList[0]}`,
        wide2: `${Dice.Success(2)} ${sellList[1]}`,
        wide3: `${Dice.Success(3)} ${sellList[2]}`
    };
    sendPrivate(speakingAs, content);
};

// Calculate the Difficulty of the Negotiation or Streetwise roll
const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
    rarityToDifficulty(rarity),
    RegionToModifier[region],
    ProximityToModifier[tradeProximity],
    PopulationToModifier[population]
].reduce((t, v) => t + v));

// Calculate recommended Purchase Price
const purchasePrice = (diff, basePrice) => clampModifier(diff) * basePrice;

// Calculate recommended Sale Prices based on number of Successes
const sellPrices = (p) => [p / 4, p / 2, p * 0.75];

// Maps an item's Rarity to the appropriate Difficulty
const rarityToDifficulty = (r = 0) => Math.floor(clampRarity(r) / 2);

const clampDifficulty = clamp(0, 5);
const clampModifier = clamp(1, 4);
const clampRarity = clamp(0, 10);

export {
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
     *
     * @function
     */
    difficulty,
    /**
     * Calculates and displays to the GM results for trading an item
     *
     * @param rarity {number} Rarity of the display being purchased
     * @param region {Region} The Region in which the display is being purchased
     * @param tradeProximity {Proximity} Current proximity to major trade route
     * @param population {Population} relative population of planet on which the display is being purchased
     * @param basePrice {number} the base price of the display being purchased
     *
     * @returns {void} sends output to Roll20 chat
     *
     * @function
     */
    display as item,
    /**
     * Calculates the recommended Purchase Price of the display for this trade
     *
     * @param diff {number} the Difficulty of the trade check
     * @param basePrice {number} the standard value of the display
     *
     * @returns {number} the modified value of the display for this trade
     *
     * @function
     */
    purchasePrice,
    /**
     * Calculates the recommended Sale Prices of the display.
     *
     * @param purchasePrice {number} the price at which this item could be purchased in this location
     *
     * @returns {number[]} list of recommended Sale Prices. The first element is the base Sale Price,
     *  the second is for two successes in the sale check, and the third is for three or more successes.
     *
     * @function
     */
    sellPrices
}
