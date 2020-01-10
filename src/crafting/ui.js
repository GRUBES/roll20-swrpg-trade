/**
 * Chat UI for the Crafting system
 *
 * @module swrpg/craft/ui
 *
 * @author Draico Dorath
 * @copyright 2019
 * @license MIT
 */

import * as Craft from "./craft";
import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
const speakingAs = "Crafting Droid";

/* Convience alias for common trade macros used by all Acquire Materials stages */
const tradeMacros = "#TradeLocation #TradeProximity #TradePopulation";

/* Convenience alias for Back to Crafting Station button */
const craftingStation = "[Crafting Station](!swrpg-ui-craft)";

// Crafting modes
const Mode = {
    NONE: -1,
    ARMOR: 0,
    DROID: 1,
    GADGET: 2,
    VEHICLE: 3,
    WEAPON: 4
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

// XXX Following methods are annoyingly repetitive

const displayArmor = () => {};

const displayDroid = () => {
    currentMode = Mode.DROID;
    let content = {
        title: "Droid Construction",
        flavor: `Current Chassis/Directive: ${Craft.Template[currentTemplate] ?
            Craft.Template[currentTemplate].name : "- None -"}`,
        wide: "Step 1: [Select a Chassis](!swrpg-ui-set-template #CraftDroidTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        wide3: `Step 3: [Construct Chassis](!swrpg-craft-droid ${currentTemplate})`,
        wide4: `Step 4: [Program Directives](!swrpg-craft-directive #CraftDirectiveTemplate)`,
        "Back to": craftingStation
    };
    sendPrivate(speakingAs, content);
};

const displayGadget = () => {
    currentMode = Mode.GADGET;
    let content = {
        title: "Gadget Construction",
        flavor: `Current Template: ${Craft.Template[currentTemplate] ?
            Craft.Template[currentTemplate].name : "- None -"}`,
        wide: "Step 1: [Select a Template](!swrpg-ui-set-template #CraftGadgetTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        wide3: `Step 3: [Construct Gadget](!swrpg-craft-gadget ${currentTemplate})`,
        "Back to": craftingStation
    };
    sendPrivate(speakingAs, content);
};

const displayVehicle = () => {
    currentMode = Mode.VEHICLE;
    let content = {
        title: "Vehicle Construction",
        flavor: `Current Template: ${Craft.Template[currentTemplate] ?
            Craft.Template[currentTemplate].name : "- None -"}`,
        "Step 1": "[Select a Frame](!swrpg-ui-set-template #CraftFrameTemplate)",
        "Step 2": `[Acquire Frame Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        "Step 3": `[Construct Frame](!swrpg-craft-vehicle ${currentTemplate})`,
        "Step 4": "[Select an Engine](!swrpg-ui-set-template #CraftEngineTemplate)",
        "Step 5": `[Acquire Engine Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        "Step 6": `[Construct Engine](!swrpg-craft-vehicle ${currentTemplate})`,
        "Step 7": "[Select a Hull](!swrpg-ui-set-template #CraftHullTemplate)",
        "Step 8": `[Acquire Hull Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        "Step 9": `[Construct Hull](!swrpg-craft-vehicle ${currentTemplate})`,
        "Step 10": `[Assemble Vehicle](!swrpg-craft-assemble ${currentTemplate})`,
        "Back to": craftingStation
    };
    sendPrivate(speakingAs, content);
};

const displayWeapon = () => {
    currentMode = Mode.WEAPON;
    let content = {
        title: "Weapon Construction",
        flavor: `Current Template: ${Craft.Template[currentTemplate] ?
            Craft.Template[currentTemplate].name : "- None -"}`,
        wide: "Step 1: [Select a Template](!swrpg-ui-set-template #CraftWeaponTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${currentTemplate} ${tradeMacros})`,
        wide3: `Step 3: [Construct Weapon](!swrpg-craft-weapon ${currentTemplate})`,
        "Back to": craftingStation
    };
    sendPrivate(speakingAs, content);
};

// Maps a Mode to its appropriate callback to redisplay correct chat prompt
// XXX Must stay below callback definitions unfortunately
const ModeCallback = {
    [Mode.ARMOR]: displayArmor,
    [Mode.DROID]: displayDroid,
    [Mode.GADGET]: displayGadget,
    [Mode.VEHICLE]: displayVehicle,
    [Mode.WEAPON]: displayWeapon
};

export {
    displayArmor as armor,
    displayDroid as droid,
    displayGadget as gadget,
    displayMain as main,
    displayVehicle as vehicle,
    displayWeapon as weapon,
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
};
