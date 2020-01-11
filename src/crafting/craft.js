/**
 * Core logic for the Crafting system
 *
 * @module swrpg/craft/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import { display as displayArmor } from "./armor";
import { display as displayDroid } from "./droid";
import { display as displayGadget } from "./gadget";
import { display as displayLightsaber } from "./lightsaber";
import { display as displayVehicle } from "./vehicle";
import { display as displayWeapon } from "./weapon";
import * as Trade from "../trade/trade";
import { sendPrivate } from "../util/chat";

/* Sender of chat messages */
const speakingAs = "Crafting Droid";

// Crafting modes
const Mode = {
    NONE: -1,
    ARMOR: 0,
    DROID: 1,
    GADGET: 2,
    VEHICLE: 3,
    WEAPON: 4,
    LIGHTSABER: 5
};

// Maps a Mode to its appropriate callback to redisplay correct chat prompt
const ModeCallback = {
    [Mode.ARMOR]: displayArmor,
    [Mode.DROID]: displayDroid,
    [Mode.GADGET]: displayGadget,
    [Mode.LIGHTSABER]: displayLightsaber,
    [Mode.VEHICLE]: displayVehicle,
    [Mode.WEAPON]: displayWeapon
};

/**
 * Cache of the current crafting type
 * @type {Mode}
 */
let currentMode;

/**
 * Cache of the currently selected TemplateType
 * @type {TemplateType}
 */
let currentTemplate;
const setTemplate = (t) => {
    currentTemplate = t;
    if (typeof ModeCallback[currentMode] === "function") {
        ModeCallback[currentMode]();
    }
};

const acquire = (rarity, basePrice, region, tradeProximity, population) => {
    let diff = Trade.difficulty(rarity, region, tradeProximity, population);
    let buy = Trade.purchasePrice(diff, basePrice);
    let content = {
        title: "Acquiring Materials",
        Difficulty: diff,
        "Purchase Price": buy
    };
    sendPrivate(speakingAs, content);
};

// Render the entry point chat UI for the crafting system
const displayMain = () => {
    currentMode = Mode.NONE;
    setTemplate();
    let content = {
        title: "Crafting Station",
        wide: "[Create Armor](!swrpg-ui-armor)",
        wide2: "[Create Droid](!swrpg-ui-droid)",
        wide3: "[Create Gadget](!swrpg-ui-gadget)",
        wide4: "[Create Vehicle](!swrpg-ui-vehicle)",
        wide5: "[Create Weapon](!swrpg-ui-weapon)"
    };
    sendPrivate(speakingAs, content);
};

// local exports
export {
    acquire,
    displayMain as main,
    /**
     * Set the current Crafting Template
     *
     * @param t {TemplateType} The Template to set
     *
     * @returns {void}
     *
     * @function
     */
    setTemplate as template
}
// alias exports for other crafting modules
export { construct as droid, program as directive, display as displayDroid } from "./droid";
export { construct as gadget, display as displayGadget } from "./gadget";
export { construct as vehicle, display as displayVehicle } from "./vehicle";
export { construct as weapon, display as displayWeapon } from "./weapon";
export { construct as lightsaber, display as displayLightsaber } from "./lightsaber";
export { construct as armor, display as displayArmor } from "./armor"
