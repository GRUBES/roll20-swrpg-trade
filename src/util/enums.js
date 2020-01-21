/**
 * Common enumerations
 *
 * @module swrpg/util/enum
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

// Utilities for displaying dice
const replacer = function () { return this["replacer"]; };
const displayDice = (s) => (n) => _.times(n, replacer, s).join("");

export const CraftingMode = {
    NONE: -1,
    ARMOR: 0,
    DROID: 1,
    GADGET: 2,
    VEHICLE: 3,
    WEAPON: 4,
    LIGHTSABER: 5,
    CYBERNETIC: 6
};

// Dice graphics
const difficulty = displayDice(eote.defaults.graphics.SymbolicReplacement.difficulty);
export const Dice = {
    Boost: displayDice(eote.defaults.graphics.SymbolicReplacement.boost),
    Difficulty: {
        SIMPLE: " - ",
        EASY: difficulty(1),
        AVERAGE: difficulty(2),
        HARD: difficulty(3),
        DAUNTING: difficulty(4),
        FORMIDABLE: difficulty(5)
    },
    Setback: displayDice(eote.defaults.graphics.SymbolicReplacement.setback)
};

export const DifficultyToDice = [
    Dice.Difficulty.SIMPLE,
    Dice.Difficulty.EASY,
    Dice.Difficulty.AVERAGE,
    Dice.Difficulty.HARD,
    Dice.Difficulty.DAUNTING,
    Dice.Difficulty.FORMIDABLE
];

// HTML Entities
export const Entities = {
    ASTERISK: "&#42;"
};

// Commonly referenced macros
export const Macros = {
    tradeLocation: "#TradeLocation #TradeProximity #TradePopulation",
    craftingMain: "[Crafting Station](!swrpg-craft-ui)",
    craftArmor: `[Create Armor](!swrpg-craft-mode ${CraftingMode.ARMOR})`,
    craftCybernetic: `[Create Cybernetic](!swrpg-craft-mode ${CraftingMode.CYBERNETIC})`,
    craftDroid: `[Create Droid](!swrpg-craft-mode ${CraftingMode.DROID})`,
    craftGadget: `[Create Gadget](!swrpg-craft-mode ${CraftingMode.GADGET})`,
    craftLightsaber: `[Create Lightsaber](!swrpg-craft-mode ${CraftingMode.LIGHTSABER})`,
    craftVehicle: `[Create Vehicle](!swrpg-craft-mode ${CraftingMode.VEHICLE})`,
    craftWeapon: `[Create Weapon](!swrpg-craft-mode ${CraftingMode.WEAPON})`,
    sliceAccess: "[Access System](!swrpg-slice-access)",
    sliceActivate: "[Activate Security](!swrpg-slice-activate)",
    sliceDisable: "[Disable Security](!swrpg-slice-disable)",
    sliceDecrease: "[*Decrease*](!swrpg-slice-security-dec)",
    sliceEnact: `[${Entities.ASTERISK}Enact Command](!swrpg-slice-enact)`,
    sliceExpel: `[${Entities.ASTERISK}Expel User](!swrpg-slice-expel)`,
    sliceIncrease: "[*Increase*](!swrpg-slice-security-inc)",
    sliceLockdown: `[${Entities.ASTERISK}Lockdown](!swrpg-slice-lockdown)`,
    sliceReset: "[*Reset*](!swrpg-slice-security-reset)",
    sliceRestart: "[Restart System](!swrpg-slice-restart)",
    sliceTrace: `[${Entities.ASTERISK}Trace User](!swrpg-slice-trace)`
};
