/**
 * Dice pool utility methods
 *
 * @module swrpg/util/dice
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

/**
 * Leverage the !eed chat command to build a dice pool
 *
 * @param cmd {string} !eed chat command
 *
 * @returns data {eote.diceObj} Dice descriptor for EOTE system
 *
 * @static
 * @function
 */
export const pool = (cmd) => {
    let pool = eote.process.setDice(cmd.match(eote.defaults.regex.dice), new eote.defaults.dice());
    let upgradedPool = eote.process.upgrade(cmd.match(eote.defaults.regex.upgrade), pool);
    return eote.process.downgrade(cmd.match(eote.defaults.regex.downgrade), upgradedPool);
};

/**
 * Leverage the !eed chat command to roll dice
 *
 * @param cmd {string} !eed chat command
 *
 * @returns data {eote.diceObj} Dice descriptor for EOTE system
 *
 * @static
 * @function
 */
export const roll = (cmd) => {
    return eote.process.rollDice(pool(cmd));
};
