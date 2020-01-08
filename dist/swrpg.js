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

  // Clamp a value between two others, inclusive
  const clamp = (min, max) => v => Math.max(Math.min(v, max), min);

  /**
   * Data structure for the predefined properties of the "Base" Roll Template
   *
   * @typedef {Object} BaseTemplate
   *
   * @property [title] {string}
   * @property [flavor] {string}
   * @property [wide] {string}
   * @property [roll] {string}
   * @property [results] {string}
   * @property [subtitle] {string}
   * @property [header] {string}
   * @property [item] {string}
   * @property [prewide] {string}
   * @property [wide] {string}
   * @property [wide2] {string}
   * @property [wide3] {string}
   * @property [wide4] {string}
   * @property [wide5] {string}
   */

  /**
   * The "Base" Roll Template's predefined properties
   *
   * @type {string[]}
   *
   * @private
   */
  const TemplateKeys = [
      "title",
      "flavor",
      "roll",
      "results",
      "subtitle",
      "header",
      "item",
      "prewide",
      "wide",
      "wide2",
      "wide3",
      "wide4",
      "wide5"
  ];

  /**
   * Whispers the GM a chat message with the given data using the "Base" Roll Template
   *
   * @param speakingAs {string} the sender of the chat message
   * @param data {BaseTemplate} the message data
   *
   * @return {void} sends output to Roll20 chat
   */
  const sendPrivate = (speakingAs, data) => {
      let msg = "/w gm &{template:base} " + parseMessage(data);
      sendChat(speakingAs, msg, null, {noarchive: true});
  };

  /**
   * Translates the given data into an appropriate message for the "Base" Roll Template
   *
   * @param data {BaseTemplate}
   *
   * @returns {string} the message content
   *
   * @private
   */
  const parseMessage = (data) => _.chain(data)
      .mapObject((v, k) => {
          let separator = TemplateKeys.includes(k) ? "=" : ": ";
          return `{{${k}${separator}${v}}}`
      })
      .values()
      .value()
      .join("");

  /**
   * Core logic for the Galactic Economy system
   *
   * @module swrpg/trade/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  /* Sender of chat messages */
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

  // Calculate trade values and display to GM
  const display = (rarity, region, tradeProximity, population, basePrice) => {
      let diff = difficulty(rarity, region, tradeProximity, population);
      let buy = purchasePrice(diff, basePrice);
      let sell = sellPrices(buy).join(" | ");
      let content = {
          title: "Trade Negotiations",
          Difficulty: diff,
          "Purchase Price": buy,
          "Sell Prices": sell
      };
      sendPrivate(speakingAs, content);
  };

  // Calculate the Difficulty of the Negotiation or Streetwise roll
  const difficulty = (rarity, region, tradeProximity, population) => clampDifficulty([
      rarityToDifficulty(rarity),
      RegionToModifier[region],
      ProximityToModifier[tradeProximity],
      PopulationToModifier[population]
  ].reduce((t, v) => t + v));

  // Calculate recommended Purchase Price
  const purchasePrice = (diff, basePrice) => clampModifier(diff) * basePrice;

  // Calculate recommended Sale Prices based on number of Successes
  const sellPrices = (purchasePrice) => [purchasePrice / 4, purchasePrice / 2, purchasePrice * 0.75];

  // Maps an item's Rarity to the appropriate Difficulty
  const rarityToDifficulty = (r = 0) => Math.floor(clampRarity(r) / 2);

  const clampDifficulty = clamp(0, 5);
  const clampModifier = clamp(1, 4);
  const clampRarity = clamp(0, 10);

  var Trade = /*#__PURE__*/Object.freeze({
    __proto__: null,
    difficulty: difficulty,
    item: display,
    purchasePrice: purchasePrice,
    sellPrices: sellPrices
  });

  /**
   * Core logic for item repair
   *
   * @module swrpg/repair/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  /* Sender of chat messages */
  const speakingAs$1 = "Repair Droid";

  /**
   * Enumeration of Item Conditions
   *
   * @enum {number}
   * @readonly
   */
  const Condition = {
      NEW: 0,
      MINOR: 1,
      MODERATE: 2,
      MAJOR: 3
  };

  /**
   * Maps an Item's Condition to its cost modifier
   *
   * @enum {number}
   * @readonly
   */
  const CostModifier = {
      [Condition.NEW]: 0,
      [Condition.MINOR]: 0.25,
      [Condition.MODERATE]: 0.50,
      [Condition.MAJOR]: 1,
  };

  // Calculate repair values and display to GM
  const display$1 = (condition, basePrice) => {
      let diff = difficulty$1(condition);
      let price = cost(condition, basePrice);
      let content = {
          title: "Item Repair",
          Difficulty: diff,
          "Repair Cost": price,
          "Adv or Thr": "modifies cost accordingly by 10% each for self repair"
      };
      sendPrivate(speakingAs$1, content);
  };

  // Calculate the Difficulty of the repair check
  const difficulty$1 = (condition) => condition;

  // Calculate the material cost of the repairs
  const cost = (condition, basePrice) => basePrice * CostModifier[condition];

  /**
   * Core logic for the Contact Networks system
   *
   * @module swrpg/contacts/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  /* Sender of chat messages */
  const speakingAs$2 = "Information Broker";

  // Calculate results for Contact Network and display
  const display$2 = (scope, expertise, obscurity, reputation, relevance) => {
      let ab = ability(scope);
      let pf = proficiency(expertise);
      let diff = difficulty$2(obscurity);
      let time = responseTime(obscurity, reputation, relevance);

      // FIXME How can I roll this in private?
      log(`[SWRPG] eote:${typeof eote}`);
      let msg = `!eed ${ab}g ${diff}p upgrade(ability|${pf}) upgrade(difficulty|${relevance-1})`;
      sendChat(speakingAs$2, msg, null, {noarchive: true});

      sendPrivate(speakingAs$2, {title: "Response Time", Days: time});
  };

  // Calculate the number of ability dice the Contact Network uses
  const ability = (scope) => clamp5(scope);

  // Calculate the Difficulty of the Contact Network's skill check
  const difficulty$2 = (obscurity) => clamp5(obscurity);

  // Calculate the number of ability upgrades the Contact Network receives
  const proficiency = (expertise) => clamp5(expertise);

  // Calculate the response time of the informant
  const responseTime = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

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
          "trade": undefined,
          "repair": display$1,
          "contact": display$2
      };

      if (!(routes[command] && (typeof routes[command] === "function"))) {
          return;
      }

      routes[command](...input);
  }

  on("chat:message", route);
  on("ready", () => log(`[SWRPG] v${version} loaded.`));

}());
