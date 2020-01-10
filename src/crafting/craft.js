/**
 * Core logic for the Crafting system
 *
 * @module swrpg/craft/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import * as Trade from "../trade/trade";
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

/**
 * Crafting template for a weapon
 *
 * @typedef {Object} WeaponTemplate
 *
 * @property critical {number} Critical Rating of the weapon
 * @property damage {string|number} Damage of the weapon. Number for Ranged weapons; string for Melee
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property encumbrance {number} Encumbrance rating of the weapon
 * @property hands {string} Description of hands needed to wield the weapon
 * @property hardpoints {number} Customization Hard Points on the weapon
 * @property isRestricted {boolean} whether the weapon is Restricted
 * @property name {string} the name of the weapon being crafted
 * @property price {number} base price of materials for crafting the weapon
 * @property range {string} Range Band of the weapon
 * @property rarity {number} Rarity rating of the materials for the weapon
 * @property skills {string[]} Skills that can be used to craft the weapon
 * @property special {string} Qualities of the crafted weapon
 * @property time {string} the time required to craft the weapon
 * @property type {string} the type of weapon
 */

/* Sender of chat messages */
const speakingAs = "Crafting Droid";

/* Types of templates which can be crafted */
const TemplateType = {
    Weapon: {
        FIST: 0,
        BLUNT: 1,
        SHIELD: 2,
        BLADED: 3,
        VIBRO: 4,
        POWERED: 5,
        SIMPLE: 6,
        SOLID_PISTOL: 7,
        SOLID_RIFLE: 8,
        ENERGY_PISTOL: 9,
        ENERGY_RIFLE: 10,
        HEAVY_RIFLE: 11,
        LAUNCHER: 12,
        MISSILE: 13,
        GRENADE: 14,
        MINE: 15
    },
    Gadget: {
        SIMPLE: 16,
        SPECIALIST: 17,
        PRECISION: 18
    },
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
    },
    Frame: {
        BIKE: 31,
        LANDSPEEDER: 32,
        AIRSPEEDER: 33,
        WALKER: 34,
        STARFIGHTER: 35,
        FREIGHTER: 36,
        SHUTTLE: 37,
        CORVETTE: 38,
        FRIGATE: 39,
        HEAVY_CRUISER: 40,
        DESTROYER: 41,
        STATION: 42
    },
    Engine: {
        SINGLE_COIL: 43,
        BAFFLED: 44,
        ION_TURBINE: 45,
        FUSIAL: 46,
        REPULSOR: 47,
        DRIVE_ARRAY: 48
    },
    Hull: {
        SLEEK: 49,
        HOLDS: 50,
        LIGHT: 51,
        DEFLECTIVE: 52,
        COMBAT: 53
    }
};

/* Step 1: Select Template. Maps a TemplateType to its Template */
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
    },
    /** @type {GadgetTemplate} */
    [TemplateType.Gadget.SIMPLE]: {
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
    [TemplateType.Gadget.SPECIALIST]: {
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
    [TemplateType.Gadget.PRECISION]: {
        difficulty: 3,
        encumbrance: 5,
        isRestricted: false,
        name: "Precision Tool",
        price: 150,
        rarity: 3,
        skills: ["Mechanics"],
        special: "Remove 2blk from checks with chosen skill",
        time: "16 hours"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.FIST]: {
        critical: 4,
        damage: "+1",
        difficulty: 2,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Fist Weapon",
        price: 10,
        range: "Engaged",
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        special: "Disorient 3",
        time: "4 hours",
        type: "Brawl"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.BLUNT]: {
        critical: 5,
        damage: "+2",
        difficulty: 1,
        encumbrance: 3,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Blunt Weapon",
        price: 5,
        range: "Engaged",
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        special: "Disorient 2",
        time: "6 hours",
        type: "Melee"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.SHIELD]: {
        critical: 5,
        damage: "+0",
        difficulty: 2,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Shield",
        price: 10,
        range: "Engaged",
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        special: "Defensive 1",
        time: "8 hours",
        type: "Melee"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.BLADED]: {
        critical: 3,
        damage: "+1",
        difficulty: 2,
        encumbrance: 2,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Bladed Weapon",
        price: 10,
        range: "Engaged",
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        special: "",
        time: "16 hours",
        type: "Melee"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.VIBRO]: {
        critical: 2,
        damage: "+1",
        difficulty: 3,
        encumbrance: 2,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Vibro Weapon",
        price: 200,
        range: "Engaged",
        rarity: 3,
        skills: ["Mechanics"],
        special: "Pierce 2; Vicious 1",
        time: "24 hours",
        type: "Melee"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.POWERED]: {
        critical: 3,
        damage: "+2",
        difficulty: 4,
        encumbrance: 3,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Powered Weapon",
        price: 400,
        range: "Engaged",
        rarity: 4,
        skills: ["Mechanics"],
        special: "Stun 3",
        time: "48 hours",
        type: "Melee"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.SIMPLE]: {
        critical: 5,
        damage: 4,
        difficulty: 2,
        encumbrance: 3,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Simple Projectile",
        price: 10,
        range: "Short",
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        special: "Limited Ammo 1",
        time: "4 hours",
        type: "Ranged (Light)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.SOLID_PISTOL]: {
        critical: 5,
        damage: 4,
        difficulty: 2,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Projectile Pistol",
        price: 50,
        range: "Short",
        rarity: 2,
        skills: ["Mechanics"],
        special: "",
        time: "8 hours",
        type: "Ranged (Light)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.SOLID_RIFLE]: {
        critical: 5,
        damage: 7,
        difficulty: 3,
        encumbrance: 5,
        hands: "One-handed",
        hardpoints: 1,
        isRestricted: false,
        name: "Projectile Rifle",
        price: 125,
        range: "Medium",
        rarity: 2,
        skills: ["Mechanics"],
        special: "Cumbersome 2",
        time: "8 hours",
        type: "Ranged (Heavy)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.ENERGY_PISTOL]: {
        critical: 3,
        damage: 6,
        difficulty: 3,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 3,
        isRestricted: false,
        name: "Energy Pistol",
        price: 200,
        range: "Medium",
        rarity: 3,
        skills: ["Mechanics"],
        special: "",
        time: "12 hours",
        type: "Ranged (Light)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.ENERGY_RIFLE]: {
        critical: 3,
        damage: 9,
        difficulty: 3,
        encumbrance: 4,
        hands: "One-handed",
        hardpoints: 4,
        isRestricted: false,
        name: "Energy Rifle",
        price: 450,
        range: "Long",
        rarity: 4,
        skills: ["Mechanics"],
        special: "",
        time: "16 hours",
        type: "Ranged (Heavy)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.HEAVY_RIFLE]: {
        critical: 3,
        damage: 10,
        difficulty: 4,
        encumbrance: 6,
        hands: "One-handed",
        hardpoints: 4,
        isRestricted: true,
        name: "Heavy Rifle",
        price: 1000,
        range: "Long",
        rarity: 6,
        skills: ["Mechanics"],
        special: "Cumbersome 3",
        time: "24 hours",
        type: "Gunnery"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.LAUNCHER]: {
        critical: 0,
        damage: 0,
        difficulty: 4,
        encumbrance: "",
        hands: "One-handed",
        hardpoints: "",
        isRestricted: true,
        name: "Launcher",
        price: 4000,
        range: "",
        rarity: 7,
        skills: ["Mechanics"],
        special: "",
        time: "16 hours",
        type: "Gunnery"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.MISSILE]: {
        critical: 2,
        damage: 20,
        difficulty: 3,
        encumbrance: 7,
        hands: "One-handed",
        hardpoints: 4,
        isRestricted: true,
        name: "Missile",
        price: 1100,
        range: "Extreme",
        rarity: 3,
        skills: ["Mechanics"],
        special: "Blast 10; Breach 1; Cumbersome 3; Guided 3; Prepare 1; Limited Ammo 1",
        time: "4 hours",
        type: "Gunnery"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.GRENADE]: {
        critical: 4,
        damage: 8,
        difficulty: 3,
        encumbrance: 1,
        hands: "One-handed",
        hardpoints: 0,
        isRestricted: false,
        name: "Grenade",
        price: 35,
        range: "Short",
        rarity: 4,
        skills: ["Mechanics"],
        special: "Blast 6; Limited Ammo 1",
        time: "2 hours",
        type: "Ranged (Light)"
    },
    /** @type {WeaponTemplate} */
    [TemplateType.Weapon.MINE]: {
        critical: 3,
        damage: 12,
        difficulty: 3,
        encumbrance: 3,
        hands: "Two-handed",
        hardpoints: 0,
        isRestricted: true,
        name: "Mine",
        price: 425,
        range: "Engaged",
        rarity: 5,
        skills: ["Mechanics"],
        special: "Blast 4; Limited Ammo 1",
        time: "4 hours",
        type: "Mechanics"
    }
};

const acquireMaterials = (templateType, region, tradeProximity, population) => {
    let diff = Trade.difficulty(Template[templateType].rarity, region, tradeProximity, population);
    let buy = Trade.purchasePrice(diff, Template[templateType].price);
    let content = {
        title: "Acquiring Materials",
        Difficulty: diff,
        "Purchase Price": buy
    };
    sendPrivate(speakingAs, content);
};

const constructDroid = (templateType) => {
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

const constructGadget = (templateType) => {
    let tmpl = Template[templateType];
    let content = {
        title: "Gadget Construction",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${tmpl.difficulty})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
        Effect: tmpl.special,
        Encumbrance: tmpl.encumbrance
    };
    sendPrivate(speakingAs, content);
};

const constructVehicle = (templateType) => {};

const constructWeapon = (templateType) => {
    let tmpl = Template[templateType];

    let craftContent = {
        title: "Weapon Construction",
        flavor: `${tmpl.skills.join(", ")} (${tmpl.difficulty})`,
        prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
    };

    let itemContent = {
        title: tmpl.name,
        subtitle: tmpl.type,
        Damage: tmpl.damage,
        Critical: tmpl.critical,
        Qualities: tmpl.special,
        Range: tmpl.range,
        "Hands Required": tmpl.hands,
        Encumbrance: tmpl.encumbrance,
        "Hard Points": tmpl.hardpoints
    };

    sendPrivate(speakingAs, craftContent);
    sendPrivate(speakingAs, itemContent);
};

const programDroid = (templateType) => {
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

export {
    Template,
    TemplateType,
    acquireMaterials,
    constructDroid as droid,
    constructGadget as gadget,
    constructVehicle as vehicle,
    constructWeapon as weapon,
    programDroid as directive
}
