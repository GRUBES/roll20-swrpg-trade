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
import {DifficultyToDice, Macros} from "../util/enums";

/**
 * Crafting template for a armor
 *
 * @typedef {Object} ArmorTemplate
 *
 * @property defense {string} Defense modifier of the crafted armor
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property encumbrance {number} Encumbrance rating of the crafted armor
 * @property hardpoints {number} Customization Hard Points on the armor
 * @property isRestricted {boolean} whether the armor is Restricted
 * @property name {string} the name of the armor being crafted
 * @property price {number} base price of materials for crafting the armor
 * @property rarity {number} Rarity rating of the materials for the armor
 * @property skills {string[]} Skills that can be used to craft the armor
 * @property soak {string} Soak modifier of the crafted armor
 * @property time {string} the time required to craft the armor
 */

/* Sender of chat messages */
const SpeakingAs = "Armorsmith Droid";

/* Types of armor templates which can be crafted */
const TemplateType = {
    CLOTHING: 1,
    LIGHT: 2,
    CUSTOMIZABLE: 3,
    DEFLECTIVE: 4,
    COMBAT: 5,
    SEGMENTED: 6,
    AUGMENTATIVE: 7
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {ArmorTemplate} */
    [TemplateType.CLOTHING]: {
        defense: "+0",
        difficulty: 2,
        encumbrance: 1,
        hardpoints: 0,
        isRestricted: false,
        name: "Reinforced Clothing",
        price: 25,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        soak: "+1",
        time: "6 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.LIGHT]: {
        defense: "+0",
        difficulty: 2,
        encumbrance: 2,
        hardpoints: 0,
        isRestricted: false,
        name: "Light Armor",
        price: 250,
        rarity: 0,
        skills: ["Mechanics"],
        soak: "+2",
        time: "12 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.CUSTOMIZABLE]: {
        defense: "+0",
        difficulty: 2,
        encumbrance: 4,
        hardpoints: 4,
        isRestricted: false,
        name: "Customizable Armor",
        price: 500,
        rarity: 4,
        skills: ["Mechanics"],
        soak: "+1",
        time: "16 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.DEFLECTIVE]: {
        defense: "+1",
        difficulty: 2,
        encumbrance: 2,
        hardpoints: 1,
        isRestricted: false,
        name: "Deflective Armor",
        price: 500,
        rarity: 5,
        skills: ["Mechanics"],
        soak: "+1",
        time: "24 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.COMBAT]: {
        defense: "+0",
        difficulty: 3,
        encumbrance: 4,
        hardpoints: 3,
        isRestricted: false,
        name: "Combat Armor",
        price: 1250,
        rarity: 4,
        skills: ["Mechanics"],
        soak: "+2",
        time: "48 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.SEGMENTED]: {
        defense: "+1",
        difficulty: 4,
        encumbrance: 6,
        hardpoints: 4,
        isRestricted: true,
        name: "Segmented Armor",
        price: 2500,
        rarity: 6,
        skills: ["Mechanics"],
        soak: "+2",
        time: "72 hours"
    },
    /** @type {ArmorTemplate} */
    [TemplateType.AUGMENTATIVE]: {
        defense: "+2",
        difficulty: 4,
        encumbrance: 6,
        hardpoints: 6,
        isRestricted: true,
        name: "Augmentative Armor",
        price: 4500,
        rarity: 8,
        skills: ["Mechanics"],
        soak: "+2",
        time: "120 hours"
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
    let craftContent = {
        title: "Armor Construction",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
    };

    let itemContent = {
        title: tmpl.name,
        Encumbrance: tmpl.encumbrance,
        "Hard Points": tmpl.hardpoints,
        "Defense Increase": tmpl.defense,
        "Soak Increase": tmpl.soak
    };

    sendPrivate(SpeakingAs, craftContent);
    sendPrivate(SpeakingAs, itemContent);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Armor Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        "Step 1": "[Select a Template](!swrpg-craft-template #CraftArmorTemplate)",
        "Step 2": `[Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 3": `[Construct Armor](!swrpg-craft-construct ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(SpeakingAs, content);
};

export { construct, display }
