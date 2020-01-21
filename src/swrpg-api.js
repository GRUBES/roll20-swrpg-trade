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
import * as Contact from "./contacts/contacts";
import * as Craft from "./crafting/craft";
import * as Repair from "./repair/repair";
import * as Slice from "./slicing/slice";
import * as Trade from "./trade/trade";
import { program } from "./crafting/droid";
import { assemble } from "./crafting/vehicle";

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
 * @returns {string} The name of the command to display
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
 * @param command {String} The command to display
 * @param input {String[]} The raw input parameters to pass to the command
 *
 * @returns {void}
 *
 * @private
 * @function execute
 */
function execute(command, input) {
    const routes = {
        "contact": Contact.investigate,
        "craft-acquire": Craft.acquire,
        "craft-assemble": assemble,
        "craft-construct": Craft.construct,
        "craft-mode": Craft.mode,
        "craft-program": program,
        "craft-template": Craft.template,
        "craft-ui": Craft.main,
        "repair": Repair.item,
        "slice-access": Slice.access,
        "slice-activate": Slice.activateSecurity,
        "slice-disable": Slice.disableSecurity,
        "slice-security-dec": Slice.decreaseSecurity,
        "slice-security-inc": Slice.increaseSecurity,
        "slice-security-reset": Slice.resetSecurity,
        "slice-ui": Slice.main,
        "trade": Trade.item
    };

    if (!(routes[command] && (typeof routes[command] === "function"))) {
        return;
    }

    routes[command](...input);
}

on("chat:message", route);
on("ready", () => {
    log(`[SWRPG] v${version} loaded.`);
});
