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
    }
};

/* Step 1: Select Template. Maps a TemplateType to its Template */
const Template = {
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

/* Step 2: Acquire Materials */
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

/* Step 3: Construction */
const constructGadget = (templateType) => {
    let tmpl = Template[templateType];
    let content = {
        title: "Gadget Construction",
        subtitle: tmpl.name,
        Difficulty: tmpl.difficulty,
        Skills: tmpl.skills.join(", "),
        "Time Required": `${tmpl.time}, -2 hours for each additional success`,
        Effect: tmpl.special
    };
    sendPrivate(speakingAs, content);
};

/* Step 3: Construction */
const constructWeapon = (templateType) => {
    let tmpl = Template[templateType];
    let content = {
        title: "Weapon Construction",
        subtitle: `${tmpl.name} - ${tmpl.type}`,
        Difficulty: tmpl.difficulty,
        Skills: tmpl.skills.join(", "),
        "Time Required": `${tmpl.time}, -2 hours for each additional success`,
        Damage: tmpl.damage,
        Critical: tmpl.critical,
        Qualities: tmpl.special,
        Range: tmpl.range,
        "Hands Required": tmpl.hands,
        Encumbrance: tmpl.encumbrance,
        "Hard Points": tmpl.hardpoints
    };
    sendPrivate(speakingAs, content);
};

/**
 * Crafting template for a weapon
 *
 * @typedef {Object} WeaponTemplate
 *
 * @property hands {string} Description of hands needed to wield the weapon
 */
export {
    acquireMaterials,
    constructGadget as gadget,
    constructWeapon as weapon
}
