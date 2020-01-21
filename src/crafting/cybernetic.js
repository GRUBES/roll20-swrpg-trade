/**
 * Core logic for crafting cybernetics
 *
 * @module swrpg/craft/cybernetic
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {sendPrivate} from "../util/chat";
import {Dice, DifficultyToDice, Macros} from "../util/enums";

/**
 * Crafting template for a cybernetic device
 *
 * @typedef {Object} CyberneticTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property isRestricted {boolean} whether the cybernetic is Restricted
 * @property name {string} the name of the cybernetic being crafted
 * @property price {number} base price of materials for crafting the cybernetic
 * @property rarity {number} Rarity rating of the materials for the cybernetic
 * @property skills {string[]} Skills that can be used to craft the cybernetic
 * @property special {string} Qualities of the crafted cybernetic
 * @property time {string} the time required to craft the cybernetic
 */

/* Sender of chat messages */
const SpeakingAs = "Cybernetics Droid";

/* Types of cybernetic templates which can be crafted */
const TemplateType = {
    REPLACEMENT: 1,
    APPENDAGE: 2,
    IMPLANT: 3
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {CyberneticTemplate} */
    [TemplateType.REPLACEMENT]: {
        difficulty: 3,
        isRestricted: false,
        name: "Prosthetic Replacement",
        price: 1000,
        rarity: 3,
        skills: ["Mechanics"],
        special: "Replace functionality of a lost limb or organ",
        time: "12 hours"
    },
    /** @type {CyberneticTemplate} */
    [TemplateType.APPENDAGE]: {
        difficulty: 4,
        isRestricted: false,
        name: "Cybernetic Appendage",
        price: 5000,
        rarity: 5,
        skills: ["Mechanics"],
        special: "Replaces a limb: +1 Brawn for an arm, +1 Agility for a leg; can only benefit from one arm and one leg modification",
        time: "48 hours"
    },
    /** @type {CyberneticTemplate} */
    [TemplateType.IMPLANT]: {
        difficulty: 4,
        isRestricted: false,
        name: "Cybernetic Implant",
        price: 1500,
        rarity: 6,
        skills: ["Mechanics"],
        special: "+1 Rank in a General Skill",
        time: "48 hours"
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
    let craftContent = {
        title: "Cybernetic Construction",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
        Effect: tmpl.special
    };

    let installContent = {
        title: "Cybernetic Installation",
        flavor: `Medicine (${Dice.Difficulty.HARD})`,
        prewide: "Time Required: 6 hours",
        wide: "Increase Difficulty twice if installing on self",
        wide2: "Failure: Cybernetic is not installed, suffers minor damage",
        wide3: "Threat: Inflict 3 strain or 1 wound",
        wide4: "Despair: Patient suffers Critical Injury"
    };

    sendPrivate(SpeakingAs, craftContent);
    sendPrivate(SpeakingAs, installContent);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Cybernetics Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        "Step 1": "[Select a Template](!swrpg-craft-template #CraftCyberneticTemplate)",
        "Step 2": `[Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 3": `[Construct Cybernetic](!swrpg-craft-construct ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(SpeakingAs, content);
};

export { construct, display }
