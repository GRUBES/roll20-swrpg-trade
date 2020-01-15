/**
 * Core logic for crafting armor
 *
 * @module swrpg/craft/armor
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a armor
 *
 * @typedef {Object} ArmorTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property hardpoints {number} Customization Hard Points on the armor
 * @property isRestricted {boolean} whether the armor is Restricted
 * @property name {string} the name of the armor being crafted
 * @property price {number} base price of materials for crafting the armor
 * @property rarity {number} Rarity rating of the materials for the armor
 * @property skills {string[]} Skills that can be used to craft the armor
 * @property special {string} Qualities of the crafted armor
 * @property time {string} the time required to craft the armor
 * @property type {string} the type of armor
 */

/* Sender of chat messages */
const speakingAs = "Armorsmith Droid";

/* Types of armor templates which can be crafted */
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
