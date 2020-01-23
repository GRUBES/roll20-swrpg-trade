/**
 * Data structure for the predefined properties of the "Base" Roll Template
 *
 * @typedef {Object} BaseTemplate
 *
 * @property [title] {string}
 * @property [flavor] {string}
 * @property [wide] {string}
 * @property [roll] {string}
 * @property [results] {string}
 * @property [subtitle] {string}
 * @property [header] {string}
 * @property [item] {string}
 * @property [prewide] {string}
 * @property [wide] {string}
 * @property [wide2] {string}
 * @property [wide3] {string}
 * @property [wide4] {string}
 * @property [wide5] {string}
 */

import {Dice, DifficultyToDice} from "./enums";

/**
 * The "Base" Roll Template's predefined properties
 *
 * @type {string[]}
 *
 * @private
 */
const TemplateKeys = [
    "title",
    "flavor",
    "roll",
    "results",
    "subtitle",
    "header",
    "item",
    "prewide",
    "wide",
    "wide2",
    "wide3",
    "wide4",
    "wide5"
];

/**
 * Rolls dice in private using the "Base" Roll Template
 *
 * @param speakingAs {string} the sender of the chat message
 * @param cmd {string} !eed dice command to roll
 *
 * @return {void} sends output to Roll20 chat
 */
const rollPrivate = (speakingAs, cmd) => {
    let pool = eote.process.setDice(cmd.match(eote.defaults.regex.dice), new eote.defaults.dice());
    let upgradedPool = eote.process.upgrade(cmd.match(eote.defaults.regex.upgrade), pool);
    let finalPool = eote.process.downgrade(cmd.match(eote.defaults.regex.downgrade), upgradedPool);
    let results = eote.process.rollDice(finalPool);
    let graphics = [
        Dice.Success(results.totals.success),
        Dice.Failure(results.totals.failure),
        Dice.Advantage(results.totals.advantage),
        Dice.Threat(results.totals.threat),
        Dice.Triumph(results.totals.triumph),
        Dice.Despair(results.totals.despair)
        // Dice.Light(results.totals.light),
        // Dice.Dark(results.totals.dark)
    ].join("");
    sendPrivate(speakingAs, {results: graphics});
};

/**
 * Sends a public chat message with the given data using the "Base" Roll Template
 *
 * @param speakingAs {string} the sender of the chat message
 * @param data {BaseTemplate} the message data
 *
 * @return {void} sends output to Roll20 chat
 */
const sendPublic = (speakingAs, data) => {
    let msg = "&{template:base} " + parseMessage(data);
    sendChat(speakingAs, msg, null, {noarchive: true});
};

/**
 * Whispers the GM a chat message with the given data using the "Base" Roll Template
 *
 * @param speakingAs {string} the sender of the chat message
 * @param data {BaseTemplate} the message data
 *
 * @return {void} sends output to Roll20 chat
 */
const sendPrivate = (speakingAs, data) => {
    let msg = "/w gm &{template:base} " + parseMessage(data);
    sendChat(speakingAs, msg, null, {noarchive: true});
};

/**
 * Translates the given data into an appropriate message for the "Base" Roll Template
 *
 * @param data {BaseTemplate}
 *
 * @returns {string} the message content
 *
 * @private
 */
const parseMessage = (data) => _.chain(data)
    .mapObject((v, k) => {
        let separator = TemplateKeys.includes(k) ? "=" : ": ";
        return `{{${k}${separator}${v}}}`
    })
    .values()
    .value()
    .join("");

/**
 * Utility for sending chat messages
 *
 * @module swrpg/util/chat
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */
export {
    rollPrivate,
    sendPrivate,
    sendPublic
};
