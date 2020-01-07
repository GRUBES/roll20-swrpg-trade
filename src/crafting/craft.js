const Template = {
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
    }
};

const Weapon = {
    [Template.Weapon.FIST]: {
        difficulty: 2,
        isRestricted: false,
        price: 10,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        time: "4 hours"
    },
    [Template.Weapon.BLUNT]: {
        difficulty: 1,
        isRestricted: false,
        price: 5,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        time: "6 hours"
    },
    [Template.Weapon.SHIELD]: {
        difficulty: 2,
        isRestricted: false,
        price: 10,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        time: "8 hours"
    },
    [Template.Weapon.BLADED]: {
        difficulty: 2,
        isRestricted: false,
        price: 10,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        time: "16 hours"
    },
    [Template.Weapon.VIBRO]: {
        difficulty: 3,
        isRestricted: false,
        price: 200,
        rarity: 3,
        skills: ["Mechanics"],
        time: "24 hours"
    },
    [Template.Weapon.POWERED]: {
        difficulty: 4,
        isRestricted: false,
        price: 400,
        rarity: 4,
        skills: ["Mechanics"],
        time: "48 hours"
    },
    [Template.Weapon.SIMPLE]: {
        difficulty: 2,
        isRestricted: false,
        price: 10,
        rarity: 0,
        skills: ["Mechanics", "Survival"],
        time: "4 hours"
    },
    [Template.Weapon.SOLID_PISTOL]: {
        difficulty: 2,
        isRestricted: false,
        price: 50,
        rarity: 2,
        skills: ["Mechanics"],
        time: "8 hours"
    },
    [Template.Weapon.SOLID_RIFLE]: {
        difficulty: 3,
        isRestricted: false,
        price: 125,
        rarity: 2,
        skills: ["Mechanics"],
        time: "8 hours"
    },
    [Template.Weapon.ENERGY_PISTOL]: {
        difficulty: 3,
        isRestricted: false,
        price: 200,
        rarity: 3,
        skills: ["Mechanics"],
        time: "12 hours"
    },
    [Template.Weapon.ENERGY_RIFLE]: {
        difficulty: 3,
        isRestricted: false,
        price: 450,
        rarity: 4,
        skills: ["Mechanics"],
        time: "16 hours"
    },
    [Template.Weapon.HEAVY_RIFLE]: {
        difficulty: 4,
        isRestricted: true,
        price: 1000,
        rarity: 6,
        skills: ["Mechanics"],
        time: "24 hours"
    },
    [Template.Weapon.LAUNCHER]: {
        difficulty: 4,
        isRestricted: true,
        price: 4000,
        rarity: 7,
        skills: ["Mechanics"],
        time: "16 hours"
    },
    [Template.Weapon.MISSILE]: {
        difficulty: 3,
        isRestricted: true,
        price: 1100,
        rarity: 3,
        skills: ["Mechanics"],
        time: "4 hours"
    },
    [Template.Weapon.GRENADE]: {
        difficulty: 3,
        isRestricted: false,
        price: 35,
        rarity: 4,
        skills: ["Mechanics"],
        time: "2 hours"
    },
    [Template.Weapon.MINE]: {
        difficulty: 3,
        isRestricted: true,
        price: 425,
        rarity: 5,
        skills: ["Mechanics"],
        time: "4 hours"
    }
};

/**
 * Core logic for the Crafting system
 *
 * @module swrpg/craft/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */
export {
    weapon
}
