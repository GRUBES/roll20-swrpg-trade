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
 * @property difficulty {number} Difficulty of the crafting check for the template
 * @property hardpoints {number} Customization Hard Points on the vehicle
 * @property isRestricted {boolean} whether the vehicle is Restricted
 * @property name {string} the name of the vehicle being crafted
 * @property price {number} base price of materials for crafting the vehicle
 * @property rarity {number} Rarity rating of the materials for the vehicle
 * @property skills {string[]} Skills that can be used to craft the vehicle
 * @property special {string} Qualities of the crafted vehicle
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

/* Maps a TemplateType to its Template */
const Template = {
    // TODO
};

const construct = (templateType) => {
    // TODO
};

const display = (templateType) => {
    currentMode = Mode.VEHICLE;
    let tmpl = TemplateType[templateType];
    let content = {
        title: "Vehicle Construction",
        flavor: `Current Template: ${tmpl ? tmpl.name : "- None -"}`,
        "Step 1": "[Select a Frame](!swrpg-ui-set-template #CraftFrameTemplate)",
        "Step 2": `[Acquire Frame Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 3": `[Construct Frame](!swrpg-craft-vehicle ${templateType})`,
        "Step 4": "[Select an Engine](!swrpg-ui-set-template #CraftEngineTemplate)",
        "Step 5": `[Acquire Engine Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 6": `[Construct Engine](!swrpg-craft-vehicle ${templateType})`,
        "Step 7": "[Select a Hull](!swrpg-ui-set-template #CraftHullTemplate)",
        "Step 8": `[Acquire Hull Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
        "Step 9": `[Construct Hull](!swrpg-craft-vehicle ${templateType})`,
        "Step 10": `[Assemble Vehicle](!swrpg-craft-assemble ${templateType})`,
        "Back to": Macros.craftingMain
    };
    sendPrivate(speakingAs, content);
};

export { construct, display }
