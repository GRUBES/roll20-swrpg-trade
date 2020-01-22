/**
 * Core logic for crafting vehicles. Based on the Nubian Design Collective's Whole Vehicle Crafting
 * Handbook
 *
 * @module swrpg/craft/vehicle
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 *
 * @see https://community.fantasyflightgames.com/topic/272869-the-nubian-design-collectives-whole-vehicle-crafting-handbook/
 */

import {DifficultyToDice, Macros} from "../util/enums";
import {sendPrivate} from "../util/chat";

/**
 * Crafting template for a vehicle frame
 *
 * @typedef {Object} FrameTemplate
 *
 * @property altitude {number} Maximum altitude of the vehicle, in meters
 * @property assemblyCost {number} Cost for supplies needed to assemble the vehicle
 * @property assemblyCrew {number} Number of crew needed to assemble the vehicle
 * @property assemblyDifficulty {number} Difficulty of check to assemble the vehicle
 * @property assemblyTime {string} Time required to assemble the vehicle
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
 * @property vsl {number} Vehicle Scaling Law
 */

/**
 * Crafting template for an engine
 *
 * @typedef {Object} EngineTemplate
 *
 * @property defense {string} Defense Ratings of the vehicle upon installing this Engine
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property hardpoints {number} Hard Point cost of installing this Engine
 * @property name {string} the name of the engine being crafted
 * @property price {number} base price of materials for crafting the engine
 * @property rarity {number} Rarity rating of the materials for the engine
 * @property skills {string[]} Skills that can be used to craft the engine
 * @property speed {number} the Max Speed of the vehicle upon installing this Engine
 * @property strain {string} System Strain Threshold of the vehicle upon installing this Engine
 * @property time {string} the time required to craft the engine
 */

/**
 * Crafting template for a hull
 *
 * @typedef {Object} HullTemplate
 *
 * @property armor {number} Armor of the vehicle upon installing this Hull
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property handling {number} Handling of the vehicle upon installing this Hull
 * @property hardpoints {number} Hard Point change upon installing this Hull
 * @property hull {string} Hull Trauma Threshold change upon installing this Hull
 * @property name {string} the name of the Hull being crafted
 * @property price {number} base price of materials for crafting the Hull
 * @property rarity {number} Rarity rating of the materials for the Hull
 * @property skills {string[]} Skills that can be used to craft the Hull
 * @property special {string} special effects upon installing this Hull
 * @property speed {number} the Max Speed change upon installing this Hull
 * @property strain {string} System Strain Threshold change upon installing this Hull
 * @property time {string} the time required to craft the Hull
 */

/* Sender of chat messages */
const SpeakingAs = "Mechanics Droid";

/* Types of vehicle templates which can be crafted */
const TemplateType = {
    Frame: {
        BIKE: 30,
        LANDSPEEDER: 1,
        AIRSPEEDER: 2,
        WALKER: 3,
        STARFIGHTER: 4,
        TRANSPORT: 5,
        CORVETTE: 6,
        PATROL_SHIP: 7,
        CARRIER: 8,
        FRIGATE: 9,
        HEAVY_CRUISER: 10,
        DESTROYER: 11,
        SMALL_STATION: 12,
        MEDIUM_STATION: 13,
        LARGE_STATION: 14,
        MASSIVE_STATION: 15,
        SMALL_MOON: 16
    },
    Engine: {
        SINGLE_COIL: 17,
        BAFFLED: 18,
        ION_TURBINE: 19,
        FUSIAL: 20,
        REPULSOR: 21,
        DRIVE_ARRAY: 22
    },
    Hull: {
        BASIC: 23,
        RACE: 24,
        BULK: 25,
        TRANSPORT: 26,
        SCOUT: 27,
        GUNSHIP: 28,
        LINE: 29
    }
};

/* Maps a TemplateType to its Template */
const Template = {
    /** @type {FrameTemplate} */
    [TemplateType.Frame.BIKE]: {
        altitude: 15,
        assemblyCost: 1000,
        assemblyCrew: 1,
        assemblyDifficulty: 3,
        assemblyTime: "48 hours",
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
        time: "12 hours",
        vsl: 5
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.LANDSPEEDER]: {
        altitude: 20,
        assemblyCost: 1000,
        assemblyCrew: 1,
        assemblyDifficulty: 3,
        assemblyTime: "48 hours",
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
        time: "24 hours",
        vsl: 5
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.AIRSPEEDER]: {
        altitude: 100000,
        assemblyCost: 1000,
        assemblyCrew: 1,
        assemblyDifficulty: 3,
        assemblyTime: "48 hours",
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
        time: "24 hours",
        vsl: 5
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.WALKER]: {
        altitude: 0,
        assemblyCost: 10000,
        assemblyCrew: 1,
        assemblyDifficulty: 3,
        assemblyTime: "120 hours",
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
        time: "72 hours",
        vsl: 10
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.STARFIGHTER]: {
        altitude: -1,
        assemblyCost: 10000,
        assemblyCrew: 1,
        assemblyDifficulty: 3,
        assemblyTime: "120 hours",
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
        time: "72 hours",
        vsl: 10
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.TRANSPORT]: {
        altitude: -1,
        assemblyCost: 25000,
        assemblyCrew: 5,
        assemblyDifficulty: 3,
        assemblyTime: "240 hours",
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
        time: "240 hours",
        vsl: 15
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.CORVETTE]: {
        altitude: -1,
        assemblyCost: 125000,
        assemblyCrew: 100,
        assemblyDifficulty: 4,
        assemblyTime: "1200 hours",
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
        time: "480 hours",
        vsl: 25
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.PATROL_SHIP]: {
        altitude: -1,
        assemblyCost: 125000,
        assemblyCrew: 100,
        assemblyDifficulty: 4,
        assemblyTime: "1200 hours",
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
        time: "480 hours",
        vsl: 25
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.CARRIER]: {
        altitude: -1,
        assemblyCost: 125000,
        assemblyCrew: 100,
        assemblyDifficulty: 4,
        assemblyTime: "1200 hours",
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
        time: "480 hours",
        vsl: 35
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.FRIGATE]: {
        altitude: -1,
        assemblyCost: 125000,
        assemblyCrew: 100,
        assemblyDifficulty: 4,
        assemblyTime: "1200 hours",
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
        time: "480 hours",
        vsl: 35
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.HEAVY_CRUISER]: {
        altitude: -1,
        assemblyCost: 1250000,
        assemblyCrew: 5000,
        assemblyDifficulty: 5,
        assemblyTime: "2400 hours",
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
        time: "1200 hours",
        vsl: 50
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.DESTROYER]: {
        altitude: -1,
        assemblyCost: 1250000,
        assemblyCrew: 5000,
        assemblyDifficulty: 5,
        assemblyTime: "2400 hours",
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
        time: "1200 hours",
        vsl: 65
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.SMALL_STATION]: {
        altitude: -1,
        assemblyCost: 125000,
        assemblyCrew: 100,
        assemblyDifficulty: 4,
        assemblyTime: "1200 hours",
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "Small Station",
        passenger: 0,
        price: 750000,
        rarity: 5,
        silhouette: 6,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours",
        vsl: 35
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.MEDIUM_STATION]: {
        altitude: -1,
        assemblyCost: 1250000,
        assemblyCrew: 5000,
        assemblyDifficulty: 5,
        assemblyTime: "2400 hours",
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "Medium Station",
        passenger: 0,
        price: 2000000,
        rarity: 5,
        silhouette: 7,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours",
        vsl: 50
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.LARGE_STATION]: {
        altitude: -1,
        assemblyCost: 3250000,
        assemblyCrew: 5000,
        assemblyDifficulty: 5,
        assemblyTime: "2400 hours",
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "Large Station",
        passenger: 0,
        price: 7500000,
        rarity: 5,
        silhouette: 8,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours",
        vsl: 65
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.MASSIVE_STATION]: {
        altitude: -1,
        assemblyCost: 4000000,
        assemblyCrew: 5000,
        assemblyDifficulty: 5,
        assemblyTime: "2400 hours",
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "Massive Station",
        passenger: 0,
        price: 20000000,
        rarity: 5,
        silhouette: 9,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours",
        vsl: 80
    },
    /** @type {FrameTemplate} */
    [TemplateType.Frame.SMALL_MOON]: {
        altitude: -1,
        assemblyCost: 10000000,
        assemblyCrew: 50000,
        assemblyDifficulty: 5,
        assemblyTime: "6000 hours",
        crew: 0,
        difficulty: 5,
        encumbrance: 0,
        hardpoints: 90,
        hull: 150,
        isRestricted: false,
        name: "That's no Moon...",
        passenger: 0,
        price: 75000000,
        rarity: 5,
        silhouette: 10,
        skills: ["Mechanics"],
        special: "Crafting Rules p5",
        speed: 0,
        time: "2400 hours",
        vsl: 100
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.SINGLE_COIL]: {
        defense: "0/0/0/0",
        difficulty: 1,
        hardpoints: 2,
        name: "Single Ion Coil",
        price: 500,
        rarity: 2,
        skills: ["Mechanics"],
        speed: 1,
        strain: "2*Silhouette",
        time: "24 hours"
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.BAFFLED]: {
        defense: "0/0/0/2",
        difficulty: 2,
        hardpoints: 4,
        name: "Electron Baffle",
        price: 1000,
        rarity: 3,
        skills: ["Mechanics"],
        speed: 2,
        strain: "4*Silhouette",
        time: "48 hours"
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.ION_TURBINE]: {
        defense: "1/0/0/0",
        difficulty: 2,
        hardpoints: 3,
        name: "Ion Turbine",
        price: 2000,
        rarity: 2,
        skills: ["Mechanics"],
        speed: 1,
        strain: "1xVSL",
        time: "48 hours"
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.FUSIAL]: {
        defense: "1/0/0/0",
        difficulty: 3,
        hardpoints: 3,
        name: "Fusial Thrust",
        price: 2500,
        rarity: 4,
        skills: ["Mechanics"],
        speed: 3,
        strain: "4*Silhouette",
        time: "60 hours"
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.REPULSOR]: {
        defense: "1/1/1/1",
        difficulty: 3,
        hardpoints: 4,
        name: "Repulsor Cluster",
        price: 3000,
        rarity: 4,
        skills: ["Mechanics"],
        speed: 4,
        strain: "4*Silhouette",
        time: "120 hours"
    },
    /** @type {EngineTemplate} */
    [TemplateType.Engine.DRIVE_ARRAY]: {
        defense: "0/0/0/0",
        difficulty: 4,
        hardpoints: 4,
        name: "Ion Drive Array",
        price: 5250,
        rarity: 5,
        skills: ["Mechanics"],
        speed: 4,
        strain: "2*Silhouette",
        time: "120 hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.BASIC]: {
        armor: 1,
        difficulty: 2,
        handling: -2,
        hardpoints: "No change",
        hull: "No change",
        name: "Basic Hull",
        price: 500,
        rarity: 2,
        skills: ["Mechanics"],
        special: "None",
        speed: "No change",
        strain: "No change",
        time: "48*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.RACE]: {
        armor: 1,
        difficulty: 2,
        handling: 1,
        hardpoints: -1,
        hull: "-1*Silhouette",
        name: "Race Ship",
        price: 500,
        rarity: 2,
        skills: ["Mechanics"],
        special: "None",
        speed: "+1 regardless of Silhouette",
        strain: "-1*Silhouette",
        time: "48*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.BULK]: {
        armor: 1,
        difficulty: 3,
        handling: -4,
        hardpoints: "No change",
        hull: "No change",
        name: "Bulk Freighter",
        price: 1000,
        rarity: 3,
        skills: ["Mechanics"],
        special: "Cargo Bays have higher capacity",
        speed: "No change",
        strain: "No change",
        time: "72*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.TRANSPORT]: {
        armor: 1,
        difficulty: 3,
        handling: -2,
        hardpoints: "No change",
        hull: "No change",
        name: "Transport",
        price: 1000,
        rarity: 3,
        skills: ["Mechanics"],
        special: "Cargo Bays, Hangar Bays, Passenger Berths, and Repair Bays cost -1HP",
        speed: "No change",
        strain: "No change",
        time: "72*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.SCOUT]: {
        armor: 2,
        difficulty: 3,
        handling: 1,
        hardpoints: "No change",
        hull: "No change",
        name: "Scout Ship",
        price: 1000,
        rarity: 5,
        skills: ["Mechanics"],
        special: "Repair Bays cost -1HP",
        speed: "No change",
        strain: "No change",
        time: "72*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.GUNSHIP]: {
        armor: 3,
        difficulty: 4,
        handling: -2,
        hardpoints: "No change",
        hull: "No change",
        name: "Gunship",
        price: 2000,
        rarity: 5,
        skills: ["Mechanics"],
        special: "Can mount 1 Oversized Weapon",
        speed: "No change",
        strain: "No change",
        time: "96*Silhouette hours"
    },
    /** @type {HullTemplate} */
    [TemplateType.Hull.LINE]: {
        armor: 5,
        difficulty: 4,
        handling: -2,
        hardpoints: "No change",
        hull: "No change",
        name: "Gunship",
        price: 3000,
        rarity: 7,
        skills: ["Mechanics"],
        special: "Can mount Weapon Banks; maximum Armor rating Silhouette+2; Medical Bays cost 1HP",
        speed: "No change",
        strain: "No change",
        time: "96*Silhouette hours"
    }
};

const construct = (templateType) => {
    let tmpl = Template[templateType] || {};
    let content = {
        title: "Vehicle Construction",
        subtitle: tmpl.name,
        flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
        prewide: `Time Required: ${tmpl.time}, -2xVSL hours for each additional success`,
        Effect: tmpl.special || "None"
    };
    sendPrivate(SpeakingAs, content);
};

const display = (templateType) => {
    let tmpl = Template[templateType] || {};
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
        "Step 8": `[Acquire Hull Materials (xVSL)](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 9": `[Construct Hull](!swrpg-craft-construct ${templateType})`,
        "Step 10": `[Assemble Vehicle](!swrpg-craft-assemble ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(SpeakingAs, content);
};

const assemble = (templateType) => {
    let tmpl = Template[templateType] || {};

    // FIXME This won't work without selecting the Frame template again before Assembling
    let assembleContent = {
        title: "Vehicle Assembly",
        flavor: `${tmpl.skills.join(", ")} (${tmpl.assemblyDifficulty})`,
        prewide: `Time Required: ${tmpl.assemblyTime}, -5xVSL hours per additional success`,
        wide: `Crew Required: ${tmpl.assemblyCrew}`,
        wide2: `Supply Cost: ${tmpl.assemblyCost}`
    };
    sendPrivate(SpeakingAs, assembleContent);
};

export { construct, display, assemble }
