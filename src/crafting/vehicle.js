/**
 * Core logic for crafting vehicles
 *
 * @module swrpg/craft/vehicle
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Macros} from "../util/enums";
import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a vehicle
 *
 * @typedef {Object} VehicleTemplate
 *
 * @property altitude {number} Maximum altitude of the vehicle, in meters
 * @property assemblyCrew {number} Number of crew needed to assemble the vehicle
 * @property crew {string} Description of vehicle crew complement
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property encumbrance {number} Encumbrance capacity of the vehicle
 * @property hardpoints {number} Customization Hard Points on the vehicle
 * @property hull {number} Hull Trauma Threshold of the vehicle
 * @property isRestricted {boolean} whether the vehicle is Restricted
 * @property name {string} the name of the vehicle being crafted
 * @property passenger {number} Passenger capacity of the vehicle
 * @property price {number} base price of materials for crafting the vehicle
 * @property rarity {number} Rarity rating of the materials for the vehicle
 * @property silhouette {number} Vehicle Silhouette
 * @property skills {string[]} Skills that can be used to craft the vehicle
 * @property special {string} Qualities of the crafted vehicle
 * @property speed {number} Maximum speed of the vehicle
 * @property time {string} the time required to craft the vehicle
 * @property type {string} the type of vehicle
 */

/* Sender of chat messages */
const speakingAs = "Mechanics Droid";

/* Types of vehicle templates which can be crafted */
const TemplateType = {
    Frame: {
        BIKE: 31,
        LANDSPEEDER: 32,
        AIRSPEEDER: 33,
        WALKER: 34,
        STARFIGHTER: 35,
        FREIGHTER: 36,
        GUNSHIP: 54,
        SHUTTLE: 37,
        CORVETTE: 38,
        FRIGATE: 39,
        HEAVY_CRUISER: 40,
        DESTROYER: 41,
        STATION: 42,
        CARRIER: 55
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

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.BIKE]: {
        altitude: 15,
        assemblyCrew: 1,
        crew: "One pilot",
        difficulty: 2,
        encumbrance: 1,
        hardpoints: 4,
        hull: 2,
        isRestricted: false,
        name: "Speeder Bike",
        passenger: 0,
        price: 250,
        rarity: 1,
        silhouette: 2,
        skills: ["Mechanics"],
        special: "",
        speed: 4,
        time: "12 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.LANDSPEEDER]: {
        altitude: 20,
        assemblyCrew: 1,
        crew: "One pilot",
        difficulty: 2,
        encumbrance: 5,
        hardpoints: 5,
        hull: 7,
        isRestricted: false,
        name: "Landspeeder",
        passenger: 2,
        price: 500,
        rarity: 1,
        silhouette: 2,
        skills: ["Mechanics"],
        special: "",
        speed: 4,
        time: "24 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.AIRSPEEDER]: {
        altitude: 100000,
        assemblyCrew: 1,
        crew: "One pilot",
        difficulty: 3,
        encumbrance: 5,
        hardpoints: 6,
        hull: 5,
        isRestricted: false,
        name: "Airspeeder",
        passenger: 2,
        price: 1000,
        rarity: 2,
        silhouette: 2,
        skills: ["Mechanics"],
        special: "Can receive 'Larger Scope' upgrade twice",
        speed: 4,
        time: "24 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.WALKER]: {
        altitude: 0,
        assemblyCrew: 1,
        crew: "One pilot",
        difficulty: 3,
        encumbrance: 5,
        hardpoints: 8,
        hull: 10,
        isRestricted: false,
        name: "Walker",
        passenger: 0,
        price: 5000,
        rarity: 2,
        silhouette: 3,
        skills: ["Mechanics"],
        special: "All-Terrain Legs (SM65); Race Hull has base speed 3",
        speed: 5,
        time: "72 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.STARFIGHTER]: {
        altitude: -1,
        assemblyCrew: 1,
        crew: "One pilot",
        difficulty: 3,
        encumbrance: 5,
        hardpoints: 11,
        hull: 10,
        isRestricted: false,
        name: "Starfighter",
        passenger: 0,
        price: 10000,
        rarity: 4,
        silhouette: 3,
        skills: ["Mechanics"],
        special: "",
        speed: 5,
        time: "72 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.FREIGHTER]: {
        altitude: -1,
        assemblyCrew: 5,
        crew: "One pilot, one co-pilot",
        difficulty: 3,
        encumbrance: 20,
        hardpoints: 17,
        hull: 20,
        isRestricted: false,
        name: "Transport",
        passenger: 4,
        price: 75000,
        rarity: 3,
        silhouette: 4,
        skills: ["Mechanics"],
        special: "Cargo Bays and Passenger Berths cost -1HP; can receive 'Integrated Improvements' twice",
        speed: 4,
        time: "240 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.CORVETTE]: {
        altitude: -1,
        assemblyCrew: 100,
        crew: "80 officers, pilots, and crew",
        difficulty: 4,
        encumbrance: 215,
        hardpoints: 33,
        hull: 50,
        isRestricted: false,
        name: "Corvette",
        passenger: 160,
        price: 500000,
        rarity: 4,
        silhouette: 5,
        skills: ["Mechanics"],
        special: "Can receive 'Integrated Improvements' twice",
        speed: 3,
        time: "480 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.GUNSHIP]: {
        altitude: -1,
        assemblyCrew: 100,
        crew: 8,
        difficulty: 4,
        encumbrance: 20,
        hardpoints: 27,
        hull: 40,
        isRestricted: false,
        name: "Patrol Ship",
        passenger: 10,
        price: 500000,
        rarity: 4,
        silhouette: 5,
        skills: ["Mechanics"],
        special: "Can receive 'Integrated Improvements' twice; spend Triumph during crafting to gain 'Unusually Agile'",
        speed: 4,
        time: "480 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.CARRIER]: {
        altitude: -1,
        assemblyCrew: 100,
        crew: 800,
        difficulty: 4,
        encumbrance: 100,
        hardpoints: 37,
        hull: 60,
        isRestricted: true,
        name: "Carrier",
        passenger: 250,
        price: 1000000,
        rarity: 4,
        silhouette: 6,
        skills: ["Mechanics"],
        special: "Hangar and Repair Bays cost -1HP; can receive 'Larger Scope' and 'Integrated Improvements' twice",
        speed: 3,
        time: "480 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.FRIGATE]: {
        altitude: -1,
        assemblyCrew: 100,
        crew: 1000,
        difficulty: 4,
        encumbrance: 0,
        hardpoints: 47,
        hull: 80,
        isRestricted: true,
        name: "Frigate",
        passenger: 0,
        price: 1000000,
        rarity: 4,
        silhouette: 6,
        skills: ["Mechanics"],
        special: "Medical Bays cost 1HP",
        speed: 3,
        time: "480 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.HEAVY_CRUISER]: {
        altitude: -1,
        assemblyCrew: 5000,
        crew: 3000,
        difficulty: 4,
        encumbrance: 0,
        hardpoints: 65,
        hull: 95,
        isRestricted: true,
        name: "Heavy Cruiser",
        passenger: 0,
        price: 2500000,
        rarity: 5,
        silhouette: 7,
        skills: ["Mechanics"],
        special: "Medical Bays and Weapon Banks cost 1HP",
        speed: 3,
        time: "1200 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.DESTROYER]: {
        altitude: -1,
        assemblyCrew: 5000,
        crew: 8000,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 85,
        hull: 125,
        isRestricted: true,
        name: "Destroyer",
        passenger: 0,
        price: 10000000,
        rarity: 6,
        silhouette: 8,
        skills: ["Mechanics"],
        special: "Medical Bays and Weapon Banks cost 1HP; Cargo Bays, Hangar Bays, Repair Bays, Passenger Berths cost -1HP",
        speed: 2,
        time: "1200 hours"
    },
    /** @type {VehicleTemplate} */
    [TemplateType.Frame.STATION]: {
        altitude: -1,
        assemblyCrew: 5000,
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "Space Station",
        passenger: 0,
        price: 50000000,
        rarity: 5,
        silhouette: 8,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours"
    }
};

const construct = (templateType) => {
    // TODO
};

const display = (templateType) => {
    let tmpl = Template[templateType];
    if (!tmpl) {
        return;
    }
    let content = {
        title: "Vehicle Construction",
        flavor: `Current Template: ${tmpl.name || "- None -"}`,
        "Step 1": "[Select a Frame](!swrpg-craft-template #CraftFrameTemplate)",
        "Step 2": `[Acquire Frame Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 3": `[Construct Frame](!swrpg-craft-construct ${templateType})`,
        "Step 4": "[Select an Engine](!swrpg-craft-template #CraftEngineTemplate)",
        "Step 5": `[Acquire Engine Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 6": `[Construct Engine](!swrpg-craft-construct ${templateType})`,
        "Step 7": "[Select a Hull](!swrpg-craft-template #CraftHullTemplate)",
        "Step 8": `[Acquire Hull Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 9": `[Construct Hull](!swrpg-craft-construct ${templateType})`,
        "Step 10": `[Assemble Vehicle](!swrpg-craft-assemble ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(speakingAs, content);
};

const assemble = (templateType) => {
    // TODO
};

export { construct, display, assemble }
