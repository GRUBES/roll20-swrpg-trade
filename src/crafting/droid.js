/**
 * Core logic for crafting droids
 *
 * @module swrpg/craft/droid
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Macros} from "../util/enums";
import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a droid programming directive
 *
 * @typedef {Object} DirectiveTemplate
 *
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property name {string} the name of the directive
 * @property skills {string[]} Skills that can be used to program the directive
 * @property skillsGranted {string[]} Skills the droid gains from the directive
 * @property talentsGranted {string[]} Talents the droid gains from the directive
 * @property time {string} the time required to program the directive
 */

/**
 * Crafting template for a droid
 *
 * @typedef {Object} DroidTemplate
 *
 * @property characteristics {number[]} list of characteristic ratings for the droid
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property isRestricted {boolean} whether the droid is Restricted
 * @property meleeDefense {number} Melee Defense rating of the crafted droid
 * @property name {string} the name of the droid chassis being crafted
 * @property price {number} base price of materials for crafting the droid
 * @property rangedDefense {number} Ranged Defense rating of the crafted droid
 * @property rank {string} Minion, Rival, or Nemesis
 * @property rarity {number} Rarity rating of the materials for the droid
 * @property skills {string[]} Skills that can be used to craft the droid
 * @property soak {number} Soak rating of the crafted droid
 * @property special {string} Qualities of the crafted droid
 * @property strain {number} Strain Threshold of the crafted droid
 * @property time {string} the time required to craft the droid
 * @property wounds {number} Wound Threshold of the crafted droid
 */

/* Sender of chat messages */
const speakingAs = "Droid Mechanic";

/* Types of droid templates which can be crafted */
const TemplateType = {
    Droid: {
        MONOTASK: 19,
        LABOR: 20,
        COMBAT: 21,
        SPECIALIST: 22,
        ADVANCED_COMBAT: 23
    },
    Directive: {
        LABOR: 24,
        COMBAT: 25,
        TRANSLATION: 26,
        REPAIR: 27,
        NAVIGATION: 28,
        HEALING: 29,
        ELIMINATION: 30
    }
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.LABOR]: {
        difficulty: 1,
        name: "Labor Directive",
        skills: ["Computers"],
        skillsGranted: ["1 General Skill +2 ranks"],
        talentsGranted: [],
        time: "8 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.COMBAT]: {
        difficulty: 2,
        name: "Combat Directive",
        skills: ["Computers"],
        skillsGranted: ["3 Combat Skills +1 rank"],
        talentsGranted: ["Body Guard 1"],
        time: "16 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.TRANSLATION]: {
        difficulty: 3,
        name: "Translation Directive",
        skills: ["Computers"],
        skillsGranted: ["3 Knowledge Skills +1 rank", "Charm 1"],
        talentsGranted: ["Convincing Demeanor 1", "Kill with Kindness 1"],
        time: "24 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.REPAIR]: {
        difficulty: 3,
        name: "Repair Directive",
        skills: ["Computers"],
        skillsGranted: ["Computers 1", "Mechanics 2"],
        talentsGranted: ["Gearhead 1", "Solid Repairs 1"],
        time: "24 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.NAVIGATION]: {
        difficulty: 3,
        name: "Navigation Directive",
        skills: ["Computers"],
        skillsGranted: ["Astrogation 2", "Computers 1", "Piloting (Space) 1"],
        talentsGranted: ["Galaxy Mapper 1", "Technical Aptitude 1"],
        time: "72 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.HEALING]: {
        difficulty: 4,
        name: "Healing Directive",
        skills: ["Computers"],
        skillsGranted: ["Xenology 1", "Medicine 2"],
        talentsGranted: ["Bacta Specialist 1", "Surgeon 1"],
        time: "72 hours"
    },
    /** @type {DirectiveTemplate} */
    [TemplateType.Directive.ELIMINATION]: {
        difficulty: 5,
        name: "Elimination Directive",
        skills: ["Computers"],
        skillsGranted: [
            "Nemesis; gain Strain Threshold equal to Wound Threshold",
            "4 ranks in each of 3 Combat Skills",
            "Cool 2",
            "Xenology 1",
            "Mechanics 2",
            "Stealth 2"
        ],
        talentsGranted: ["Adversary 2", "Lethal Blows 3"],
        time: "168 hours"
    },
    /** @type {DroidTemplate} */
    [TemplateType.Droid.MONOTASK]: {
        characteristics: [1, 1, 1, 1, 1, 1],
        difficulty: 2,
        isRestricted: false,
        meleeDefense: 0,
        name: "Monotask Chassis",
        price: 600,
        rangedDefense: 0,
        rank: "Minion",
        rarity: 2,
        skills: ["Mechanics"],
        soak: 2,
        special: "Silhouette 0",
        strain: 0,
        time: "24 hours",
        wounds: 3
    },
    /** @type {DroidTemplate} */
    [TemplateType.Droid.LABOR]: {
        characteristics: [3, 1, 2, 1, 1, 1],
        difficulty: 2,
        isRestricted: false,
        meleeDefense: 0,
        name: "Labor Chassis",
        price: 3500,
        rangedDefense: 0,
        rank: "Minion",
        rarity: 3,
        skills: ["Mechanics"],
        soak: 4,
        special: "Silhouette 1",
        strain: 0,
        time: "48 hours",
        wounds: 7
    },
    /** @type {DroidTemplate} */
    [TemplateType.Droid.COMBAT]: {
        characteristics: [2, 2, 1, 1, 1, 1],
        difficulty: 3,
        isRestricted: true,
        meleeDefense: 0,
        name: "Combat Chassis",
        price: 3250,
        rank: "Minion",
        rangedDefense: 0,
        rarity: 2,
        skills: ["Mechanics"],
        soak: 2,
        special: "Silhouette 1",
        strain: 0,
        time: "48 hours",
        wounds: 4
    },
    /** @type {DroidTemplate} */
    [TemplateType.Droid.SPECIALIST]: {
        characteristics: [1, 1, 2, 2, 2, 2],
        difficulty: 4,
        isRestricted: false,
        meleeDefense: 0,
        name: "Specialist Chassis",
        price: 4500,
        rangedDefense: 0,
        rank: "Rival",
        rarity: 3,
        skills: ["Mechanics"],
        soak: 3,
        special: "Silhouette 1",
        strain: 0,
        time: "56 hours",
        wounds: 11
    },
    /** @type {DroidTemplate} */
    [TemplateType.Droid.ADVANCED_COMBAT]: {
        characteristics: [4, 3, 3, 3, 1, 1],
        difficulty: 5,
        isRestricted: true,
        meleeDefense: 0,
        name: "Advanced Combat Chassis",
        price: 32500,
        rangedDefense: 1,
        rank: "Nemesis",
        rarity: 7,
        skills: ["Mechanics"],
        soak: 7,
        special: "Silhouette 1",
        strain: 10,
        time: "240 hours",
        wounds: 19
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType];
    let content = {
        title: "Droid Chassis Construction",
        subtitle: `${tmpl.name} (${tmpl.rank})`,
        flavor: `${tmpl.skills.join(", ")} (${tmpl.difficulty})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
        Characteristics: tmpl.characteristics.join("/"),
        Defense: `${tmpl.rangedDefense} | ${tmpl.meleeDefense}`,
        Soak: tmpl.soak,
        Qualities: tmpl.special,
        "Wound Threshold": tmpl.wounds,
        "Strain Threshold": tmpl.strain
    };
    sendPrivate(speakingAs, content);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Droid Construction",
        flavor: `Current Chassis/Directive: ${tmpl.name || "- None -"}`,
        wide: "Step 1: [Select a Chassis](!swrpg-craft-template #CraftDroidTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        wide3: `Step 3: [Construct Chassis](!swrpg-craft-construct ${templateType})`,
        wide4: `Step 4: [Program Directives](!swrpg-craft-directive #CraftDirectiveTemplate)`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(speakingAs, content);
};

const program = (templateType) => {
    let tmpl = Template[templateType];
    let content = {
        title: "Droid Directive Programming",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${tmpl.difficulty})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
        Skills: tmpl.skillsGranted.join("; "),
        Talents: tmpl.talentsGranted.join("; ")
    };
    sendPrivate(speakingAs, content);
};

export { construct, display, program }
