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
   * Core logic for the Contact Networks system
   *
   * @module swrpg/contacts/core
   *
   * @author Draico Dorath
   * @copyright 2019
   * @license MIT
   */

  /* Sender of chat messages */
  const speakingAs = "Information Broker";

  // Calculate results for Contact Network and display
  const display = (scope, expertise, obscurity, reputation, relevance) => {
      let ab = ability(scope);
      let pf = proficiency(expertise);
      let diff = difficulty(obscurity);
      let time = responseTime(obscurity, reputation, relevance);

      // FIXME How can I roll this in private?
      eote.process.setup(`!eed ${ab}g ${diff}p upgrade(ability|${pf}) upgrade(difficulty|${relevance-1})`, speakingAs);

      sendPrivate(speakingAs, {title: "Response Time", Days: time});
  };

  // Calculate the number of ability dice the Contact Network uses
  const ability = (scope) => clamp5(scope);

  // Calculate the Difficulty of the Contact Network's skill check
  const difficulty = (obscurity) => clamp5(obscurity);

  // Calculate the number of ability upgrades the Contact Network receives
  const proficiency = (expertise) => clamp5(expertise);

  // Calculate the response time of the informant
  const responseTime = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

  const clamp5 = clamp(0, 5);

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
  const speakingAs$1 = "Trade Representative";

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
  const display$1 = (rarity, region, tradeProximity, population, basePrice) => {
      let diff = difficulty$1(rarity, region, tradeProximity, population);
      let buy = purchasePrice(diff, basePrice);
      let sell = sellPrices(buy).join(" | ");
      let content = {
          title: "Trade Negotiations",
          Difficulty: diff,
          "Purchase Price": buy,
          "Sell Prices": sell
      };
      sendPrivate(speakingAs$1, content);
  };

  // Calculate the Difficulty of the Negotiation or Streetwise roll
  const difficulty$1 = (rarity, region, tradeProximity, population) => clampDifficulty([
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

  /**
   * Core logic for the Crafting system
   *
   * @module swrpg/craft/core
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /**
   * Crafting template for a weapon
   *
   * @typedef {Object} WeaponTemplate
   *
   * @property critical {number} Critical Rating of the weapon
   * @property damage {string|number} Damage of the weapon. Number for Ranged weapons; string for Melee
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property encumbrance {number} Encumbrance rating of the weapon
   * @property hands {string} Description of hands needed to wield the weapon
   * @property hardpoints {number} Customization Hard Points on the weapon
   * @property isRestricted {boolean} whether the weapon is Restricted
   * @property name {string} the name of the weapon being crafted
   * @property price {number} base price of materials for crafting the weapon
   * @property range {string} Range Band of the weapon
   * @property rarity {number} Rarity rating of the materials for the weapon
   * @property skills {string[]} Skills that can be used to craft the weapon
   * @property special {string} Qualities of the crafted weapon
   * @property time {string} the time required to craft the weapon
   * @property type {string} the type of weapon
   */

  /**
   * Crafting template for a gadget
   *
   * @typedef {Object} GadgetTemplate
   *
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property encumbrance {number} Encumbrance rating of the gadget
   * @property isRestricted {boolean} whether the gadget is Restricted
   * @property name {string} the name of the gadget being crafted
   * @property price {number} base price of materials for crafting the gadget
   * @property rarity {number} Rarity rating of the materials for the gadget
   * @property skills {string[]} Skills that can be used to craft the gadget
   * @property special {string} Qualities of the crafted gadget
   * @property time {string} the time required to craft the gadget
   */

  /* Sender of chat messages */
  const speakingAs$2 = "Crafting Droid";

  /* Types of templates which can be crafted */
  const TemplateType = {
      Weapon: {
          FIST: 0,
          BLUNT: 1,
          SHIELD: 2,
          BLADED: 3,
          VIBRO: 4,
          POWERED: 5,
          SIMPLE: 6,
          SOLID_PISTOL: 7,
          SOLID_RIFLE: 8,
          ENERGY_PISTOL: 9,
          ENERGY_RIFLE: 10,
          HEAVY_RIFLE: 11,
          LAUNCHER: 12,
          MISSILE: 13,
          GRENADE: 14,
          MINE: 15
      },
      Gadget: {
          SIMPLE: 16,
          SPECIALIST: 17,
          PRECISION: 18
      }
  };

  /* Step 1: Select Template. Maps a TemplateType to its Template */
  const Template = {
      /** @type {GadgetTemplate} */
      [TemplateType.Gadget.SIMPLE]: {
          difficulty: 1,
          encumbrance: 4,
          isRestricted: false,
          name: "Simple Tool",
          price: 50,
          rarity: 1,
          skills: ["Mechanics"],
          special: "Allows characters to make checks with chosen skill with the right tool",
          time: "2 hours"
      },
      /** @type {GadgetTemplate} */
      [TemplateType.Gadget.SPECIALIST]: {
          difficulty: 2,
          encumbrance: 8,
          isRestricted: false,
          name: "Specialist Tool",
          price: 400,
          rarity: 4,
          skills: ["Mechanics"],
          special: "Add automatic success to checks with chosen skill",
          time: "10 hours"
      },
      /** @type {GadgetTemplate} */
      [TemplateType.Gadget.PRECISION]: {
          difficulty: 3,
          encumbrance: 5,
          isRestricted: false,
          name: "Precision Tool",
          price: 150,
          rarity: 3,
          skills: ["Mechanics"],
          special: "Remove 2blk from checks with chosen skill",
          time: "16 hours"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.FIST]: {
          critical: 4,
          damage: "+1",
          difficulty: 2,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Fist Weapon",
          price: 10,
          range: "Engaged",
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          special: "Disorient 3",
          time: "4 hours",
          type: "Brawl"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.BLUNT]: {
          critical: 5,
          damage: "+2",
          difficulty: 1,
          encumbrance: 3,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Blunt Weapon",
          price: 5,
          range: "Engaged",
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          special: "Disorient 2",
          time: "6 hours",
          type: "Melee"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.SHIELD]: {
          critical: 5,
          damage: "+0",
          difficulty: 2,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Shield",
          price: 10,
          range: "Engaged",
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          special: "Defensive 1",
          time: "8 hours",
          type: "Melee"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.BLADED]: {
          critical: 3,
          damage: "+1",
          difficulty: 2,
          encumbrance: 2,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Bladed Weapon",
          price: 10,
          range: "Engaged",
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          special: "",
          time: "16 hours",
          type: "Melee"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.VIBRO]: {
          critical: 2,
          damage: "+1",
          difficulty: 3,
          encumbrance: 2,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Vibro Weapon",
          price: 200,
          range: "Engaged",
          rarity: 3,
          skills: ["Mechanics"],
          special: "Pierce 2; Vicious 1",
          time: "24 hours",
          type: "Melee"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.POWERED]: {
          critical: 3,
          damage: "+2",
          difficulty: 4,
          encumbrance: 3,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Powered Weapon",
          price: 400,
          range: "Engaged",
          rarity: 4,
          skills: ["Mechanics"],
          special: "Stun 3",
          time: "48 hours",
          type: "Melee"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.SIMPLE]: {
          critical: 5,
          damage: 4,
          difficulty: 2,
          encumbrance: 3,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Simple Projectile",
          price: 10,
          range: "Short",
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          special: "Limited Ammo 1",
          time: "4 hours",
          type: "Ranged (Light)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.SOLID_PISTOL]: {
          critical: 5,
          damage: 4,
          difficulty: 2,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Projectile Pistol",
          price: 50,
          range: "Short",
          rarity: 2,
          skills: ["Mechanics"],
          special: "",
          time: "8 hours",
          type: "Ranged (Light)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.SOLID_RIFLE]: {
          critical: 5,
          damage: 7,
          difficulty: 3,
          encumbrance: 5,
          hands: "One-handed",
          hardpoints: 1,
          isRestricted: false,
          name: "Projectile Rifle",
          price: 125,
          range: "Medium",
          rarity: 2,
          skills: ["Mechanics"],
          special: "Cumbersome 2",
          time: "8 hours",
          type: "Ranged (Heavy)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.ENERGY_PISTOL]: {
          critical: 3,
          damage: 6,
          difficulty: 3,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 3,
          isRestricted: false,
          name: "Energy Pistol",
          price: 200,
          range: "Medium",
          rarity: 3,
          skills: ["Mechanics"],
          special: "",
          time: "12 hours",
          type: "Ranged (Light)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.ENERGY_RIFLE]: {
          critical: 3,
          damage: 9,
          difficulty: 3,
          encumbrance: 4,
          hands: "One-handed",
          hardpoints: 4,
          isRestricted: false,
          name: "Energy Rifle",
          price: 450,
          range: "Long",
          rarity: 4,
          skills: ["Mechanics"],
          special: "",
          time: "16 hours",
          type: "Ranged (Heavy)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.HEAVY_RIFLE]: {
          critical: 3,
          damage: 10,
          difficulty: 4,
          encumbrance: 6,
          hands: "One-handed",
          hardpoints: 4,
          isRestricted: true,
          name: "Heavy Rifle",
          price: 1000,
          range: "Long",
          rarity: 6,
          skills: ["Mechanics"],
          special: "Cumbersome 3",
          time: "24 hours",
          type: "Gunnery"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.LAUNCHER]: {
          critical: 0,
          damage: 0,
          difficulty: 4,
          encumbrance: "",
          hands: "One-handed",
          hardpoints: "",
          isRestricted: true,
          name: "Launcher",
          price: 4000,
          range: "",
          rarity: 7,
          skills: ["Mechanics"],
          special: "",
          time: "16 hours",
          type: "Gunnery"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.MISSILE]: {
          critical: 2,
          damage: 20,
          difficulty: 3,
          encumbrance: 7,
          hands: "One-handed",
          hardpoints: 4,
          isRestricted: true,
          name: "Missile",
          price: 1100,
          range: "Extreme",
          rarity: 3,
          skills: ["Mechanics"],
          special: "Blast 10; Breach 1; Cumbersome 3; Guided 3; Prepare 1; Limited Ammo 1",
          time: "4 hours",
          type: "Gunnery"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.GRENADE]: {
          critical: 4,
          damage: 8,
          difficulty: 3,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 0,
          isRestricted: false,
          name: "Grenade",
          price: 35,
          range: "Short",
          rarity: 4,
          skills: ["Mechanics"],
          special: "Blast 6; Limited Ammo 1",
          time: "2 hours",
          type: "Ranged (Light)"
      },
      /** @type {WeaponTemplate} */
      [TemplateType.Weapon.MINE]: {
          critical: 3,
          damage: 12,
          difficulty: 3,
          encumbrance: 3,
          hands: "Two-handed",
          hardpoints: 0,
          isRestricted: true,
          name: "Mine",
          price: 425,
          range: "Engaged",
          rarity: 5,
          skills: ["Mechanics"],
          special: "Blast 4; Limited Ammo 1",
          time: "4 hours",
          type: "Mechanics"
      }
  };

  /* Step 2: Acquire Materials */
  const acquireMaterials = (templateType, region, tradeProximity, population) => {
      let diff = difficulty$1(Template[templateType].rarity, region, tradeProximity, population);
      let buy = purchasePrice(diff, Template[templateType].price);
      let content = {
          title: "Acquiring Materials",
          Difficulty: diff,
          "Purchase Price": buy
      };
      sendPrivate(speakingAs$2, content);
  };

  /* Step 3: Construction */
  const constructGadget = (templateType) => {
      let tmpl = Template[templateType];
      let content = {
          title: "Gadget Construction",
          subtitle: tmpl.name,
          Difficulty: tmpl.difficulty,
          Skills: tmpl.skills.join(", "),
          "Time Required": `${tmpl.time}, -2 hours for each additional success`,
          Effect: tmpl.special
      };
      sendPrivate(speakingAs$2, content);
  };

  /* Step 3: Construction */
  const constructWeapon = (templateType) => {
      let tmpl = Template[templateType];
      let content = {
          title: "Weapon Construction",
          subtitle: `${tmpl.name} - ${tmpl.type}`,
          Difficulty: tmpl.difficulty,
          Skills: tmpl.skills.join(", "),
          "Time Required": `${tmpl.time}, -2 hours for each additional success`,
          Damage: tmpl.damage,
          Critical: tmpl.critical,
          Qualities: tmpl.special,
          Range: tmpl.range,
          "Hands Required": tmpl.hands,
          Encumbrance: tmpl.encumbrance,
          "Hard Points": tmpl.hardpoints
      };
      sendPrivate(speakingAs$2, content);
  };

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
  const speakingAs$3 = "Repair Droid";

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
  const display$2 = (condition, basePrice) => {
      let diff = difficulty$2(condition);
      let price = cost(condition, basePrice);
      let content = {
          title: "Item Repair",
          Difficulty: diff,
          "Repair Cost": price,
          "Adv or Thr": "modifies cost accordingly by 10% each for self repair"
      };
      sendPrivate(speakingAs$3, content);
  };

  // Calculate the Difficulty of the repair check
  const difficulty$2 = (condition) => condition;

  // Calculate the material cost of the repairs
  const cost = (condition, basePrice) => basePrice * CostModifier[condition];

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
          "trade": display$1,
          "repair": display$2,
          "contact": display,
          "craft-acquire": acquireMaterials,
          "craft-gadget": constructGadget,
          "craft-weapon": constructWeapon
      };

      if (!(routes[command] && (typeof routes[command] === "function"))) {
          return;
      }

      routes[command](...input);
  }

  on("chat:message", route);
  on("ready", () => log(`[SWRPG] v${version} loaded.`));

}());
