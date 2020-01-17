/**
 * Common enumerations
 *
 * @module swrpg/util/enum
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

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
    craftWeapon: `[Create Weapon](!swrpg-craft-mode ${CraftingMode.WEAPON})`
};
