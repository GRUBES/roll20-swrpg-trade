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

  /**
   * Enumeration of proximity to major trade route
   *
   * @enum {number}
   * @readonly
   */
  const Proximity = {
      ON: 0,
      NEAR: 1,
      FAR: 2
  };

  /**
   * Enumeration of population values for the trade location
   *
   * @enum {number}
   * @readonly
   */
  const Population = {
      HIGH: 0,
      AVERAGE: 1,
      LOW: 2,
      NONE: 3
  };

  /**
   * Enumeration of the Regions of the Galaxy
   *
   * @enum {number}
   * @readonly
   */
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

  /**
   * Maps a population value to its rarity modifier
   *
   * @enum {number}
   * @readonly
   */
  const PopulationToModifier = {
      [Population.HIGH]: -1,
      [Population.AVERAGE]: 0,
      [Population.LOW]: 1,
      [Population.NONE]: 4
  };

  /**
   * Maps a trade route proximity value to its rarity modifier
   *
   * @enum {number}
   * @readonly
   */
  const ProximityToModifier = {
      [Proximity.ON]: -1,
      [Proximity.NEAR]: 0,
      [Proximity.FAR]: 1
  };

  /**
   * Maps a galactic Region to its rarity modifier
   *
   * @enum {number}
   * @readonly
   */
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
   * Calculates and displays results for trading an display to the GM
   *
   * @param rarity {number} Rarity of the display being purchased
   * @param region {Region} The Region in which the display is being purchased
   * @param tradeProximity {Proximity} Current proximity to major trade route
   * @param population {Population} relative population of planet on which the display is being purchased
   * @param basePrice {number} the base price of the display being purchased
   *
   * @return {void} sends output to Roll20 chat
   */
  const display = (rarity, region, tradeProximity, population, basePrice) => {
      let data = calculate(rarity, region, tradeProximity, population, basePrice);
      let msg = [
          "/w gm &{template:base}",
          `{{title=Trade Negotiations}}`,
          `{{Difficulty: ${data.difficulty}}}`,
          `{{Purchase Price: ${data.purchasePrice}}}`,
          `{{Sell Prices: ${data.sellPrices.join(" | ")}}}`
      ].join(" ");
      sendChat(speakingAs, msg, null, {noarchive: true});
  };

  /**
   * Mechanics for trading an display
   *
   * @param rarity {number} Rarity of the display being purchased
   * @param region {Region} The Region in which the display is being purchased
   * @param tradeProximity {Proximity} Current proximity to major trade route
   * @param population {Population} relative population of planet on which the display is being purchased
   * @param basePrice {number} the base price of the display being purchased
   *
   * @return {{difficulty: number, purchasePrice: number, sellPrices: number[]}}
   */
  const calculate = (rarity, region, tradeProximity, population, basePrice) => {
      let diff = difficulty(rarity, region, tradeProximity, population);
      let buy = purchasePrice(diff, basePrice);
      let sell = sellPrices(buy);

      return {difficulty: diff, purchasePrice: buy, sellPrices: sell};
  };

  /**
   * Calculates the Difficulty of the Negotiation or Streetwise check needed to locate a buyer or
   * seller for the desired display
   *
   * @param rarity {number} the Rarity of the desired display
   * @param region {Region} the Region where the trade is taking place
   * @param tradeProximity {Proximity} the proximity to major trade route(s)
   * @param population {Population} the population of the location of the trade
   *
   * @returns {number} the Difficulty of the required check
   */
  const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
      rarityToDifficulty(rarity),
      RegionToModifier[region],
      ProximityToModifier[tradeProximity],
      PopulationToModifier[population]
  ].reduce((t, v) => t + v));

  /**
   * Calculates the recommended Purchase Price of the display for this trade
   *
   * @param diff {number} the Difficulty of the trade check
   * @param basePrice {number} the standard value of the display
   *
   * @returns {number} the modified value of the display for this trade
   */
  const purchasePrice = (diff, basePrice) => clampModifier(diff) * basePrice;

  /**
   * Calculates the recommended Sale Prices of the display.
   *
   * @param purchasePrice
   *
   * @returns {number[]} list of recommended Sale Prices. The first element is the base Sale Price,
   *  the second is for two successes in the sale check, and the third is for three or more successes.
   */
  const sellPrices = (purchasePrice) => [purchasePrice / 4, purchasePrice / 2, purchasePrice * 0.75];

  /**
   * Maps an display's Rarity to the appropriate Difficulty
   *
   * @param r {number} the Rarity
   *
   * @returns {number} the base Difficulty of the check
   *
   * @private
   */
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
  const item = (condition, basePrice) => {
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
   * @returns {string} The name of the command to display
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
   * @param command {String} The command to display
   * @param input {String[]} The raw input parameters to pass to the command
   *
   * @returns {void}
   *
   * @private
   * @function display
   */
  function execute(command, input) {
      const routes = {
          "trade": display,
          "repair": item,
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
