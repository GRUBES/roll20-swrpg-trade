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
    sendPrivate,
    sendPublic
};
