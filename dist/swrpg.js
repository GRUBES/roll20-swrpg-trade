(function () {
  'use strict';

  var version = "0.1.0";

  /**
   * Math utility module
   *
   * @module swrpg/util/math
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  const clamp = (min, max) => v => Math.max(Math.min(v, max), min);

  const speakingAs = "Trade Representative";

  const Proximity = {
      ON: 0,
      NEAR: 1,
      FAR: 2
  };

  const Population = {
      HIGH: 0,
      AVERAGE: 1,
      LOW: 2,
      NONE: 3
  };

  const Region = {
      CORE: 0,
      COLONIES: 1,
      INNER_RIM: 2,
      MID_RIM: 3,
      OUTER_RIM: 4,
      EXPANSION: 5,
      WILD: 6,
      UNKNOWN: 7
  };

  const PopulationToModifier = {
      [Population.HIGH]: -1,
      [Population.AVERAGE]: 0,
      [Population.LOW]: 1,
      [Population.NONE]: 4
  };

  const ProximityToModifier = {
      [Proximity.ON]: -1,
      [Proximity.NEAR]: 0,
      [Proximity.FAR]: 1
  };

  const RegionToModifier = {
      [Region.CORE]: -1,
      [Region.COLONIES]: 0,
      [Region.INNER_RIM]: 0,
      [Region.MID_RIM]: 1,
      [Region.OUTER_RIM]: 2,
      [Region.EXPANSION]: 2,
      [Region.WILD]: 3,
      [Region.UNKNOWN]: 4
  };

  /**
   * Mechanics for trading an item
   *
   * @param rarity {number} Rarity of the item being purchased
   * @param region {Region} The Region in which the item is being purchased
   * @param tradeProximity {Proximity} Current proximity to major trade route
   * @param population {Population} relative population of planet on which the item is being purchased
   * @param basePrice {number} the base price of the item being purchased
   *
   * @return {void} sends output to Roll20 chat
   */
  const item = (rarity, region, tradeProximity, population, basePrice) => {
      let diff = difficulty(rarity, region, tradeProximity, population);
      let purchasePrice = clampModifier(diff) * basePrice;
      let sellPrices = [purchasePrice / 4, purchasePrice / 2, purchasePrice * 0.75];

      let msg = [
          "/w gm &{template:base}",
          `{{title=Trade Negotiations}}`,
          `{{Difficulty: ${diff}}}`,
          `{{Purchase Price: ${purchasePrice}}}`,
          `{{Sell Prices:`,
          sellPrices.join(" | "),
          `}}`
      ].join(" ");
      sendChat(speakingAs, msg, null, {noarchive: true});
  };

  const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
          rarityToDifficulty(rarity),
          RegionToModifier[region],
          ProximityToModifier[tradeProximity],
          PopulationToModifier[population]
      ].reduce((t, v) => t + v));


  const rarityToDifficulty = (r = 0) => Math.floor(clampRarity(r) / 2);

  const clampDifficulty = clamp(0, 5);
  const clampModifier = clamp(1, 4);
  const clampRarity = clamp(0, 10);

  /**
   * Core logic for item repair
   *
   * @module swrpg/repair/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  const speakingAs$1 = "Repair Droid";

  const Condition = {
      NEW: 0,
      MINOR: 1,
      MODERATE: 2,
      MAJOR: 3
  };

  const CostModifier = {
      [Condition.NEW]: 0,
      [Condition.MINOR]: 0.25,
      [Condition.MODERATE]: 0.50,
      [Condition.MAJOR]: 1,
  };

  /**
   * Mechanics for repairing an item
   *
   * @param condition {Condition} the condition of the item
   * @param basePrice {number} the base price of the item
   *
   * @return {void} sends output to Roll20 chat
   */
  const item$1 = (condition, basePrice) => {
      let msg = [
          "/w gm &{template:base}",
          `{{title=Item Repair}}`,
          `{{Difficulty: ${condition}}}`,
          `{{Repair Cost: ${basePrice * CostModifier[condition]}}}`,
          `{{Advantage/Threat modifies cost by 10% for self repair}}`
      ].join(" ");
      sendChat(speakingAs$1, msg, null, {noarchive: true});
  };

  /**
   * Core logic for the Contact Networks system
   *
   * @module swrpg/contacts/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  const speakingAs$2 = "Information Broker";

  const investigate = (scope, expertise, obscurity, reputation, relevance) => {
      let ability = clamp5(scope);
      let proficiency = clamp5(expertise);
      let difficulty = clamp5(obscurity);
      let time = response(obscurity, reputation, relevance);

      let msg = `!eed ${ability}g ${difficulty}p upgrade(ability|${proficiency}) upgrade(difficulty|${relevance-1})`;
      sendChat(speakingAs$2, msg, null, {noarchive: true});

      msg = `/w gm &{template:base} {{title=Response Time}} {{${time} days}}`;
      sendChat(speakingAs$2, msg, null, {noarchive: true});
  };

  const response = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

  const clamp5 = clamp(0, 5);

  /**
   * Entry point module for the Galactic Economy system
   *
   * @module swrpg/trade/api
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  // API Command prefix
  const prefix = "swrpg-";

  // API Command prefix with !
  const commandPrefix = `!${prefix}`;

  /**
   * Handler method for chat messages
   *
   * @param msg {Object} Roll20 chat message data
   *
   * @returns {void}
   *
   * @private
   * @function route
   */
  function route(msg) {
      if (!isCommand(msg)) { return; }

      execute(parseCommand(msg), parseInput(msg));
  }

  /**
   * Determines whether the given chat message is an SW:Trade command
   *
   * @param msg {Object} Roll20 chat message data
   *
   * @returns {Boolean} true if the message is a trade command; false otherwise
   *
   * @private
   * @function isCommand
   */
  function isCommand(msg) {
      return (
          (msg.type === "api") &&
          msg.content.startsWith(commandPrefix)
      );
  }

  /**
   * Parses the API command out of the given Roll20 chat message
   *
   * @param msg {Object} Roll20 chat message data
   *
   * @returns {string} The name of the command to item
   *
   * @private
   * @function parseCommand
   */
  function parseCommand(msg) {
      return msg.content
          .split(" ")[0]
          .toLowerCase()
          .replace(commandPrefix, "");
  }

  /**
   * Strips the command out of the chat message and returns the rest of the input parameters as an Array
   *
   * @param msg {Object} Roll20 chat message
   *
   * @returns {String[]} List of input parameters provided in chat message
   *
   * @private
   * @function parseInput
   */
  function parseInput(msg) {
      // Dumb implementation; will break if e.g. needs to accept text strings with spaces in them
      return _.tail(msg.content.split(/\s+/));
  }

  /**
   * Invokes the given command with the given input on the corresponding route
   *
   * @param command {String} The command to item
   * @param input {String[]} The raw input parameters to pass to the command
   *
   * @returns {void}
   *
   * @private
   * @function item
   */
  function execute(command, input) {
      const routes = {
          "trade": item,
          "repair": item$1,
          "contact": investigate
      };

      if (!(routes[command] && (typeof routes[command] === "function"))) {
          return;
      }

      routes[command](...input);
  }

  on("chat:message", route);
  on("ready", () => log(`[SWRPG] v${version} loaded.`));

}());
