/**
 * Core logic for crafting weapons
 *
 * @module swrpg/craft/weapon
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Macros} from "../util/enums";
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

/* Sender of chat messages */
const speakingAs = "Weaponsmith Droid";

/* Types of weapon templates which can be crafted */
const TemplateType = {
    FIST: 16,
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
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {WeaponTemplate} */
    [TemplateType.FIST]: {
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
    [TemplateType.BLUNT]: {
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
    [TemplateType.SHIELD]: {
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
    [TemplateType.BLADED]: {
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
    [TemplateType.VIBRO]: {
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
    [TemplateType.POWERED]: {
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
    [TemplateType.SIMPLE]: {
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
    [TemplateType.SOLID_PISTOL]: {
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
    [TemplateType.SOLID_RIFLE]: {
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
    [TemplateType.ENERGY_PISTOL]: {
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
    [TemplateType.ENERGY_RIFLE]: {
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
    [TemplateType.HEAVY_RIFLE]: {
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
    [TemplateType.LAUNCHER]: {
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
    [TemplateType.MISSILE]: {
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
    [TemplateType.GRENADE]: {
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
    [TemplateType.MINE]: {
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

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
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

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Weapon Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        wide: "Step 1: [Select a Template](!swrpg-craft-template #CraftWeaponTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        wide3: `Step 3: [Construct Weapon](!swrpg-craft-construct ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(speakingAs, content);
};

export { construct, display }
