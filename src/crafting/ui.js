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


/**
 * Cache of the currently selected TemplateType
 * @type {TemplateType}
 */
let currentTemplate;
const setTemplate = (t) => {
    currentTemplate = t;
    displayGadget();
};

const displayMain = () => {
    let content = {
        title: "Crafting Station",
        // wide: "[Create Armor](!&#13;#CraftArmor)",
        // wide2: "[Create Droid](!&#13;#CraftDroid)",
        wide3: "[Create Gadget](!swrpg-ui-gadget)",
        // wide4: "[Create Vehicle](!&#13;#CraftVehicle)",
        wide5: "[Create Weapon](!swrpg-ui-weapon)"
    };
    sendPrivate(speakingAs, content);
};

const displayGadget = () => {
    let content = {
        title: "Gadget Construction",
        flavor: `Current Template: ${Craft.Template[currentTemplate] ?
            Craft.Template[currentTemplate].name : "- None -"}`,
        wide: "Step 1: [Select a Template](!swrpg-ui-set-template #CraftGadgetTemplate)",
        wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${currentTemplate} #TradeLocation #TradeProximity #TradePopulation)`,
        wide3: `Step 3: [Create Gadget](!swrpg-craft-gadget ${currentTemplate})`
    };
    sendPrivate(speakingAs, content);
};

const displayWeapon = () => {};

export {
    displayGadget as gadget,
    displayMain as main,
    displayWeapon as weapon,
    setTemplate as template
};
