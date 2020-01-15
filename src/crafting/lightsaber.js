/**
 * Core logic for crafting lightsabers
 *
 * @module swrpg/craft/lightsaber
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a lightsaber
 *
 * @typedef {Object} LightsaberTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property hardpoints {number} Customization Hard Points on the lightsaber
 * @property isRestricted {boolean} whether the lightsaber is Restricted
 * @property name {string} the name of the lightsaber being crafted
 * @property price {number} base price of materials for crafting the lightsaber
 * @property rarity {number} Rarity rating of the materials for the lightsaber
 * @property skills {string[]} Skills that can be used to craft the lightsaber
 * @property special {string} Qualities of the crafted lightsaber
 * @property time {string} the time required to craft the lightsaber
 * @property type {string} the type of lightsaber
 */

/* Sender of chat messages */
const speakingAs = "The Living Force";

/* Types of lightsaber templates which can be crafted */
const TemplateType = {
    // TODO
};

/* Maps a TemplateType to its Template */
const Template = {
    // TODO
};

const construct = (templateType) => {
    // TODO
};

const display = (templateType) => {
    // TODO
};

export { construct, display }
