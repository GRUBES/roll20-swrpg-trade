/**
 * Core logic for crafting tools and gadgets
 *
 * @module swrpg/craft/gadget
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Macros, CraftingMode} from "../util/enums";
import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a gadget
 *
 * @typedef {Object} GadgetTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property encumbrance {number} Encumbrance rating of the gadget
 * @property isRestricted {boolean} whether the gadget is Restricted
 * @property name {string} the name of the gadget being crafted
 * @property price {number} base price of materials for crafting the gadget
 * @property rarity {number} Rarity rating of the materials for the gadget
 * @property skills {string[]} Skills that can be used to craft the gadget
 * @property special {string} Qualities of the crafted gadget
 * @property time {string} the time required to craft the gadget
 */

// Sender of chat messages
const SpeakingAs = "Engineering Droid";

// Types of templates which can be crafted
const TemplateType = {
    SIMPLE: 1,
    SPECIALIST: 2,
    PRECISION: 3
};

const Mode = CraftingMode.GADGET;

// Maps a TemplateType to its Template
const Template = {
    /** @type {GadgetTemplate} */
    [TemplateType.SIMPLE]: {
        difficulty: 1,
        encumbrance: 4,
        isRestricted: false,
        name: "Simple Tool",
        price: 50,
        rarity: 1,
        skills: ["Mechanics"],
        special: "Allows characters to make checks with chosen skill with the right tool",
        time: "2 hours"
    },
    /** @type {GadgetTemplate} */
    [TemplateType.SPECIALIST]: {
        difficulty: 2,
        encumbrance: 8,
        isRestricted: false,
        name: "Specialist Tool",
        price: 400,
        rarity: 4,
        skills: ["Mechanics"],
        special: "Add automatic success to checks with chosen skill",
        time: "10 hours"
    },
    /** @type {GadgetTemplate} */
    [TemplateType.PRECISION]: {
        difficulty: 3,
        encumbrance: 5,
        isRestricted: false,
        name: "Precision Tool",
        price: 150,
        rarity: 3,
        skills: ["Mechanics"],
        special: "Remove 2blk from checks with chosen skill",
        time: "16 hours"
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Gadget Construction",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${tmpl.difficulty})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
        Effect: tmpl.special,
        Encumbrance: tmpl.encumbrance
    };
    sendPrivate(SpeakingAs, content);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Gadget Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        wide: "Step 1: [Select a Template](!swrpg-craft-template #CraftGadgetTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        wide3: `Step 3: [Construct Gadget](!swrpg-craft-construct ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(SpeakingAs, content);
};

export { construct, display }
