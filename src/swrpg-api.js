/**
 * Entry point module for the Galactic Economy system
 *
 * @module swrpg/trade/api
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import { version } from "../package.json";
import * as Trade from "./trade/trade";
import * as Repair from "./repair/repair";

// API Command prefix
const prefix = "swrpg-";

// API Command prefix with !
const commandPrefix = `!${prefix}`;

/**
 * Handler method for chat messages
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {void}
 *
 * @private
 * @function route
 */
function route(msg) {
    if (!isCommand(msg)) { return; }

    execute(parseCommand(msg), parseInput(msg));
}

/**
 * Determines whether the given chat message is an SW:Trade command
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {Boolean} true if the message is a trade command; false otherwise
 *
 * @private
 * @function isCommand
 */
function isCommand(msg) {
    return (
        (msg.type === "api") &&
        msg.content.startsWith(commandPrefix)
    );
}

/**
 * Parses the API command out of the given Roll20 chat message
 *
 * @param msg {Object} Roll20 chat message data
 *
 * @returns {string} The name of the command to item
 *
 * @private
 * @function parseCommand
 */
function parseCommand(msg) {
    return msg.content
        .split(" ")[0]
        .toLowerCase()
        .replace(commandPrefix, "");
}

/**
 * Strips the command out of the chat message and returns the rest of the input parameters as an Array
 *
 * @param msg {Object} Roll20 chat message
 *
 * @returns {String[]} List of input parameters provided in chat message
 *
 * @private
 * @function parseInput
 */
function parseInput(msg) {
    // Dumb implementation; will break if e.g. needs to accept text strings with spaces in them
    return _.tail(msg.content.split(/\s+/));
}

/**
 * Invokes the given command with the given input on the corresponding route
 *
 * @param command {String} The command to item
 * @param input {String[]} The raw input parameters to pass to the command
 *
 * @returns {void}
 *
 * @private
 * @function item
 */
function execute(command, input) {
    const routes = {
        "trade": Trade.item,
        "repair": Repair.item
    };

    if (!(routes[command] && (typeof routes[command] === "function"))) {
        return;
    }

    routes[command](...input);
}

on("chat:message", route);
on("ready", () => log(`[SW:Trade] v${version} loaded.`));
