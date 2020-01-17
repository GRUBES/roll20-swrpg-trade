/**
 * Core logic for the Crafting system
 *
 * @module swrpg/craft/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import * as Armor from "./armor";
import * as Cybernetic from "./cybernetic";
import * as Droid from "./droid";
import * as Gadget from "./gadget";
import * as Lightsaber from "./lightsaber";
import * as Vehicle from "./vehicle";
import * as Weapon from "./weapon";
import * as Trade from "../trade/trade";
import { sendPrivate } from "../util/chat";
import { CraftingMode, Macros } from "../util/enums";

/* Sender of chat messages */
const SpeakingAs = "Crafting Droid";

// Maps a Mode to its Module
const ModeToModule = {
    [CraftingMode.ARMOR]: Armor,
    [CraftingMode.DROID]: Droid,
    [CraftingMode.GADGET]: Gadget,
    [CraftingMode.LIGHTSABER]: Lightsaber,
    [CraftingMode.VEHICLE]: Vehicle,
    [CraftingMode.WEAPON]: Weapon,
    [CraftingMode.CYBERNETIC]: Cybernetic
};

/**
 * Cache of the current crafting type
 * @type {Mode}
 */
let currentMode;
const setMode = (m) => {
    currentMode = m;
    ModeToModule[currentMode] ? ModeToModule[currentMode].display(currentTemplate) : display();
};

/**
 * Cache of the currently selected TemplateType
 * @type {TemplateType}
 */
let currentTemplate;
const setTemplate = (t) => {
    currentTemplate = t;
    ModeToModule[currentMode] ? ModeToModule[currentMode].display(currentTemplate) : display();
};

// Step 2: Acquire Materials
const acquire = (rarity, basePrice, region, tradeProximity, population) => {
    let diff = Trade.difficulty(rarity, region, tradeProximity, population);
    let buy = Trade.purchasePrice(diff, basePrice);
    let content = {
        title: "Acquiring Materials",
        Difficulty: diff,
        "Purchase Price": buy
    };
    sendPrivate(SpeakingAs, content);
};

// Step 3: Construct
const construct = () => {
    (currentTemplate && ModeToModule[currentMode]) ?
        ModeToModule[currentMode].construct(currentTemplate) :
        display();
};

// Render the entry point chat UI for the crafting system
const display = () => {
    currentMode = CraftingMode.NONE;
    currentTemplate = undefined;
    let content = {
        title: "Crafting Station",
        wide: `${Macros.craftArmor} ${Macros.craftDroid}`,
        wide2: `${Macros.craftGadget} ${Macros.craftLightsaber}`,
        wide3: `${Macros.craftVehicle} ${Macros.craftWeapon}`,
        wide4: `${Macros.craftCybernetic}`,
    };
    sendPrivate(SpeakingAs, content);
};

// local exports
export {
    /**
     * Calculate difficulty and price for acquiring materials to craft an item
     *
     * @param rarity {number} the Rarity of the item being crafted
     * @param basePrice {number} the standard value of the item being crafted
     * @param region {Region} the Region where materials will be acquired
     * @param tradeProximity {Proximity} the proximity to a major trade route
     * @param population {Population} the population of the area
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    acquire,
    /**
     * Display difficulty and cost for constructing an item
     *
     * @param templateType {Template} the Template of the item being crafted
     *
     * @returns {void} outputs results to chat
     * @function
     */
    construct,
    /**
     * Display the primary crafting UI in chat
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    display as main,
    /**
     * Set the current Crafting Mode
     *
     * @param m {CraftingMode} the Mode to set
     *
     * @returns {void}
     *
     * @function
     */
    setMode as mode,
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
