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
import {DifficultyToDice, Macros} from "../util/enums";

/**
 * Crafting template for a lightsaber
 *
 * @typedef {Object} HiltTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property encumbrance {number} Encumbrance of the crafted lightsaber
 * @property hands {string} Hands necessary to wield the lightsaber
 * @property hardpoints {number} Customization Hard Points on the lightsaber
 * @property isRestricted {boolean} whether the lightsaber is Restricted
 * @property name {string} the name of the lightsaber being crafted
 * @property price {number} base price of materials for crafting the lightsaber
 * @property rarity {number} Rarity rating of the materials for the lightsaber
 * @property skills {string[]} Skills that can be used to craft the lightsaber
 * @property special {string} Qualities of the crafted lightsaber
 * @property time {string} the time required to craft the lightsaber
 */

/* Sender of chat messages */
const SpeakingAs = "The Living Force";

/* Types of lightsaber templates which can be crafted */
const TemplateType = {
    STANDARD: 1,
    PRECISION: 2,
    DEFENSIVE: 3,
    DOUBLE: 4,
    PIKE: 5
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {HiltTemplate} */
    [TemplateType.STANDARD]: {
        difficulty: 2,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 5,
        isRestricted: false,
        name: "Standard Hilt",
        price: 100,
        rarity: 4,
        skills: ["Mechanics", "Lore"],
        special: "None",
        time: "6 hours"
    },
    /** @type {HiltTemplate} */
    [TemplateType.PRECISION]: {
        difficulty: 2,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 3,
        isRestricted: false,
        name: "Precision Hilt",
        price: 150,
        rarity: 5,
        skills: ["Mechanics", "Lore"],
        special: "Accurate 1; Damage -1",
        time: "12 hours"
    },
    /** @type {HiltTemplate} */
    [TemplateType.DEFENSIVE]: {
        difficulty: 3,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 3,
        isRestricted: false,
        name: "Defensive Hilt",
        price: 300,
        rarity: 6,
        skills: ["Mechanics", "Lore"],
        special: "Defensive 1; Damage -1",
        time: "12 hours"
    },
    /** @type {HiltTemplate} */
    [TemplateType.DOUBLE]: {
        difficulty: 3,
        encumbrance: 2,
        hands: "Two-handed",
        hardpoints: 4,
        isRestricted: false,
        name: "Double-bladed Hilt",
        price: 300,
        rarity: 5,
        skills: ["Mechanics", "Lore"],
        special: "Unwieldy 3; Linked 1; Attachments and Crystals cost double",
        time: "12 hours"
    },
    /** @type {HiltTemplate} */
    [TemplateType.PIKE]: {
        difficulty: 3,
        encumbrance: 2,
        hands: "Two-handed",
        hardpoints: 4,
        isRestricted: false,
        name: "Pole Hilt",
        price: 150,
        rarity: 5,
        skills: ["Mechanics", "Lore"],
        special: "Cumbersome 3; Defensive 1",
        time: "12 hours"
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
    let craftContent = {
        title: "Lightsaber Construction",
        flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
    };

    let itemContent = {
        title: tmpl.name,
        Qualities: tmpl.special,
        "Hands Required": tmpl.hands,
        Encumbrance: tmpl.encumbrance,
        "Hard Points": tmpl.hardpoints
    };

    sendPrivate(SpeakingAs, craftContent);
    sendPrivate(SpeakingAs, itemContent);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Lightsaber Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        "Step 1": "[Select a Hilt](!swrpg-craft-template #CraftHiltTemplate)",
        "Step 2": `[Acquire Hilt Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 3": `[Construct Hilt](!swrpg-craft-construct ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(SpeakingAs, content);
};

export { construct, display }
