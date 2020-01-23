
/**
 * Entry point chat UI for the GM
 *
 * @module swrpg/ui
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Macros} from "./util/enums";
import {sendPrivate} from "./util/chat";

/* Sender of chat messages */
const SpeakingAs = "The Dark Side";

// Render the entry point chat UI for the crafting system
const display = () => {
    let content = {
        title: "GM Tools",
        wide: `${Macros.partyLocation} ${Macros.craftingMain}`,
        wide2: `${Macros.sliceMain} ${Macros.socialMain}`,
        wide3: `${Macros.repairItem} ${Macros.tradeItem}`,
        wide4: `${Macros.contactInvestigate}`
    };
    sendPrivate(SpeakingAs, content);
};

export {
    /**
     * Display the primary GM UI in chat
     *
     * @returns {void} outputs results to chat
     *
     * @function
     */
    display as main
}
