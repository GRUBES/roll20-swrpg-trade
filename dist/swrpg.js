(function () {
  'use strict';

  var version = "0.9.0";

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

  const CraftingMode = {
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
  const Dice = {
      Advantage: displayDice(eote.defaults.graphics.SymbolicReplacement.advantage),
      Boost: displayDice(eote.defaults.graphics.SymbolicReplacement.boost),
      Despair: displayDice(eote.defaults.graphics.SymbolicReplacement.despair),
      Difficulty: {
          SIMPLE: " - ",
          EASY: difficulty(1),
          AVERAGE: difficulty(2),
          HARD: difficulty(3),
          DAUNTING: difficulty(4),
          FORMIDABLE: difficulty(5)
      },
      Setback: displayDice(eote.defaults.graphics.SymbolicReplacement.setback),
      Success: displayDice(eote.defaults.graphics.SymbolicReplacement.success),
      Threat: displayDice(eote.defaults.graphics.SymbolicReplacement.threat),
      Triumph: displayDice(eote.defaults.graphics.SymbolicReplacement.triumph)
  };

  const DifficultyToDice = [
      Dice.Difficulty.SIMPLE,
      Dice.Difficulty.EASY,
      Dice.Difficulty.AVERAGE,
      Dice.Difficulty.HARD,
      Dice.Difficulty.DAUNTING,
      Dice.Difficulty.FORMIDABLE
  ];

  // HTML Entities
  const Entities = {
      ASTERISK: "&#42;",
      CR: "&#13;"
  };

  // Commonly referenced macros
  const Macros = {
      contactInvestigate: `[Use Contact Network](!${Entities.CR}#ContactInvestigate)`,
      craftingMain: "[Crafting Station](!swrpg-craft-ui)",
      craftArmor: `[Create Armor](!swrpg-craft-mode ${CraftingMode.ARMOR})`,
      craftCybernetic: `[Create Cybernetic](!swrpg-craft-mode ${CraftingMode.CYBERNETIC})`,
      craftDroid: `[Create Droid](!swrpg-craft-mode ${CraftingMode.DROID})`,
      craftGadget: `[Create Gadget](!swrpg-craft-mode ${CraftingMode.GADGET})`,
      craftLightsaber: `[Create Lightsaber](!swrpg-craft-mode ${CraftingMode.LIGHTSABER})`,
      craftVehicle: `[Create Vehicle](!swrpg-craft-mode ${CraftingMode.VEHICLE})`,
      craftWeapon: `[Create Weapon](!swrpg-craft-mode ${CraftingMode.WEAPON})`,
      partyLocation: `[Current Location](!${Entities.CR}#PartyLocation)`,
      repairItem: `[Repair Item](!${Entities.CR}#RepairItem)`,
      sliceAccess: "[Access System](!swrpg-slice-access)",
      sliceActivate: "[Activate Security](!swrpg-slice-activate)",
      sliceDisable: "[Disable Security](!swrpg-slice-disable)",
      sliceDecrease: "[*Decrease*](!swrpg-slice-security-dec)",
      sliceEnact: `[${Entities.ASTERISK}Enact Command](!swrpg-slice-enact)`,
      sliceExpel: `[${Entities.ASTERISK}Expel User](!swrpg-slice-expel)`,
      sliceIncrease: "[*Increase*](!swrpg-slice-security-inc)",
      sliceLockdown: `[${Entities.ASTERISK}Lockdown](!swrpg-slice-lockdown)`,
      sliceMain: "[Slicing Encounter](!swrpg-slice)",
      sliceReset: "[*Reset*](!swrpg-slice-security-reset)",
      sliceRestart: "[Restart System](!swrpg-slice-restart)",
      sliceTrace: `[${Entities.ASTERISK}Trace User](!swrpg-slice-trace)`,
      socialCharm: "[Charm](!swrpg-social-charm)",
      socialCoercion: "[Coercion](!swrpg-social-coercion)",
      socialDeception: "[Deception](!swrpg-social-deception)",
      socialLeadership: "[Leadership](!swrpg-social-leadership)",
      socialMain: "[Social Encounter](!swrpg-social-ui)",
      socialNegotiation: "[Negotiation](!swrpg-social-negotiation)",
      tradeItem: `[Trade Item](!${Entities.CR}#TradeItem)`,
      tradeLocation: "#TradeLocation #TradeProximity #TradePopulation"

  };

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
  const display$1 = (scope, expertise, obscurity, reputation, relevance) => {
      let ab = ability(scope);
      let pf = proficiency(expertise);
      let diff = difficulty$1(obscurity);
      let time = responseTime(obscurity, reputation, relevance);

      // FIXME How can I roll this in private?
      eote.process.setup(`!eed ${ab}g ${diff}p upgrade(ability|${pf}) upgrade(difficulty|${relevance-1})`, speakingAs);

      sendPrivate(speakingAs, {title: "Response Time", Days: time});
  };

  // Calculate the number of ability dice the Contact Network uses
  const ability = (scope) => clamp5(scope);

  // Calculate the Difficulty of the Contact Network's skill check
  const difficulty$1 = (obscurity) => clamp5(obscurity);

  // Calculate the number of ability upgrades the Contact Network receives
  const proficiency = (expertise) => clamp5(expertise);

  // Calculate the response time of the informant
  const responseTime = (obscurity, reputation, relevance) => (obscurity * 3 * reputation * relevance);

  const clamp5 = clamp(0, 5);

  /**
   * Core logic for crafting armor
   *
   * @module swrpg/craft/armor
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /**
   * Crafting template for a armor
   *
   * @typedef {Object} ArmorTemplate
   *
   * @property defense {string} Defense modifier of the crafted armor
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property encumbrance {number} Encumbrance rating of the crafted armor
   * @property hardpoints {number} Customization Hard Points on the armor
   * @property isRestricted {boolean} whether the armor is Restricted
   * @property name {string} the name of the armor being crafted
   * @property price {number} base price of materials for crafting the armor
   * @property rarity {number} Rarity rating of the materials for the armor
   * @property skills {string[]} Skills that can be used to craft the armor
   * @property soak {string} Soak modifier of the crafted armor
   * @property time {string} the time required to craft the armor
   */

  /* Sender of chat messages */
  const SpeakingAs$1 = "Armorsmith Droid";

  /* Types of armor templates which can be crafted */
  const TemplateType = {
      CLOTHING: 1,
      LIGHT: 2,
      CUSTOMIZABLE: 3,
      DEFLECTIVE: 4,
      COMBAT: 5,
      SEGMENTED: 6,
      AUGMENTATIVE: 7
  };

  /* Maps a TemplateType to its Template */
  const Template = {
      /** @type {ArmorTemplate} */
      [TemplateType.CLOTHING]: {
          defense: "+0",
          difficulty: 2,
          encumbrance: 1,
          hardpoints: 0,
          isRestricted: false,
          name: "Reinforced Clothing",
          price: 25,
          rarity: 0,
          skills: ["Mechanics", "Survival"],
          soak: "+1",
          time: "6 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.LIGHT]: {
          defense: "+0",
          difficulty: 2,
          encumbrance: 2,
          hardpoints: 0,
          isRestricted: false,
          name: "Light Armor",
          price: 250,
          rarity: 0,
          skills: ["Mechanics"],
          soak: "+2",
          time: "12 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.CUSTOMIZABLE]: {
          defense: "+0",
          difficulty: 2,
          encumbrance: 4,
          hardpoints: 4,
          isRestricted: false,
          name: "Customizable Armor",
          price: 500,
          rarity: 4,
          skills: ["Mechanics"],
          soak: "+1",
          time: "16 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.DEFLECTIVE]: {
          defense: "+1",
          difficulty: 2,
          encumbrance: 2,
          hardpoints: 1,
          isRestricted: false,
          name: "Deflective Armor",
          price: 500,
          rarity: 5,
          skills: ["Mechanics"],
          soak: "+1",
          time: "24 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.COMBAT]: {
          defense: "+0",
          difficulty: 3,
          encumbrance: 4,
          hardpoints: 3,
          isRestricted: false,
          name: "Combat Armor",
          price: 1250,
          rarity: 4,
          skills: ["Mechanics"],
          soak: "+2",
          time: "48 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.SEGMENTED]: {
          defense: "+1",
          difficulty: 4,
          encumbrance: 6,
          hardpoints: 4,
          isRestricted: true,
          name: "Segmented Armor",
          price: 2500,
          rarity: 6,
          skills: ["Mechanics"],
          soak: "+2",
          time: "72 hours"
      },
      /** @type {ArmorTemplate} */
      [TemplateType.AUGMENTATIVE]: {
          defense: "+2",
          difficulty: 4,
          encumbrance: 6,
          hardpoints: 6,
          isRestricted: true,
          name: "Augmentative Armor",
          price: 4500,
          rarity: 8,
          skills: ["Mechanics"],
          soak: "+2",
          time: "120 hours"
      }
  };

  const construct = (templateType) => {
      let tmpl = Template[templateType] || {};
      let craftContent = {
          title: "Armor Construction",
          subtitle: tmpl.name,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
      };

      let itemContent = {
          title: tmpl.name,
          Encumbrance: tmpl.encumbrance,
          "Hard Points": tmpl.hardpoints,
          "Defense Increase": tmpl.defense,
          "Soak Increase": tmpl.soak
      };

      sendPrivate(SpeakingAs$1, craftContent);
      sendPrivate(SpeakingAs$1, itemContent);
  };

  const display$2 = (templateType) => {
      let tmpl = Template[templateType] || {};
      let content = {
          title: "Armor Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          "Step 1": "[Select a Template](!swrpg-craft-template #CraftArmorTemplate)",
          "Step 2": `[Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 3": `[Construct Armor](!swrpg-craft-construct ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(SpeakingAs$1, content);
  };

  var Armor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct,
    display: display$2
  });

  /**
   * Core logic for crafting cybernetics
   *
   * @module swrpg/craft/cybernetic
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /**
   * Crafting template for a cybernetic device
   *
   * @typedef {Object} CyberneticTemplate
   *
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property isRestricted {boolean} whether the cybernetic is Restricted
   * @property name {string} the name of the cybernetic being crafted
   * @property price {number} base price of materials for crafting the cybernetic
   * @property rarity {number} Rarity rating of the materials for the cybernetic
   * @property skills {string[]} Skills that can be used to craft the cybernetic
   * @property special {string} Qualities of the crafted cybernetic
   * @property time {string} the time required to craft the cybernetic
   */

  /* Sender of chat messages */
  const SpeakingAs$2 = "Cybernetics Droid";

  /* Types of cybernetic templates which can be crafted */
  const TemplateType$1 = {
      REPLACEMENT: 1,
      APPENDAGE: 2,
      IMPLANT: 3
  };

  /* Maps a TemplateType to its Template */
  const Template$1 = {
      /** @type {CyberneticTemplate} */
      [TemplateType$1.REPLACEMENT]: {
          difficulty: 3,
          isRestricted: false,
          name: "Prosthetic Replacement",
          price: 1000,
          rarity: 3,
          skills: ["Mechanics"],
          special: "Replace functionality of a lost limb or organ",
          time: "12 hours"
      },
      /** @type {CyberneticTemplate} */
      [TemplateType$1.APPENDAGE]: {
          difficulty: 4,
          isRestricted: false,
          name: "Cybernetic Appendage",
          price: 5000,
          rarity: 5,
          skills: ["Mechanics"],
          special: "Replaces a limb: +1 Brawn for an arm, +1 Agility for a leg; can only benefit from one arm and one leg modification",
          time: "48 hours"
      },
      /** @type {CyberneticTemplate} */
      [TemplateType$1.IMPLANT]: {
          difficulty: 4,
          isRestricted: false,
          name: "Cybernetic Implant",
          price: 1500,
          rarity: 6,
          skills: ["Mechanics"],
          special: "+1 Rank in a General Skill",
          time: "48 hours"
      }
  };

  const construct$1 = (templateType) => {
      let tmpl = Template$1[templateType] || {};
      let craftContent = {
          title: "Cybernetic Construction",
          subtitle: tmpl.name,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
          Effect: tmpl.special
      };

      let installContent = {
          title: "Cybernetic Installation",
          flavor: `Medicine (${Dice.Difficulty.HARD})`,
          prewide: "Time Required: 6 hours",
          wide: "Increase Difficulty twice if installing on self",
          wide2: "Failure: Cybernetic is not installed, suffers minor damage",
          wide3: "Threat: Inflict 3 strain or 1 wound",
          wide4: "Despair: Patient suffers Critical Injury"
      };

      sendPrivate(SpeakingAs$2, craftContent);
      sendPrivate(SpeakingAs$2, installContent);
  };

  const display$3 = (templateType) => {
      let tmpl = Template$1[templateType] || {};
      let content = {
          title: "Cybernetics Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          "Step 1": "[Select a Template](!swrpg-craft-template #CraftCyberneticTemplate)",
          "Step 2": `[Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 3": `[Construct Cybernetic](!swrpg-craft-construct ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(SpeakingAs$2, content);
  };

  var Cybernetic = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$1,
    display: display$3
  });

  /**
   * Core logic for crafting droids
   *
   * @module swrpg/craft/droid
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /**
   * Crafting template for a droid programming directive
   *
   * @typedef {Object} DirectiveTemplate
   *
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property name {string} the name of the directive
   * @property skills {string[]} Skills that can be used to program the directive
   * @property skillsGranted {string[]} Skills the droid gains from the directive
   * @property talentsGranted {string[]} Talents the droid gains from the directive
   * @property time {string} the time required to program the directive
   */

  /**
   * Crafting template for a droid
   *
   * @typedef {Object} DroidTemplate
   *
   * @property characteristics {number[]} list of characteristic ratings for the droid
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property isRestricted {boolean} whether the droid is Restricted
   * @property meleeDefense {number} Melee Defense rating of the crafted droid
   * @property name {string} the name of the droid chassis being crafted
   * @property price {number} base price of materials for crafting the droid
   * @property rangedDefense {number} Ranged Defense rating of the crafted droid
   * @property rank {string} Minion, Rival, or Nemesis
   * @property rarity {number} Rarity rating of the materials for the droid
   * @property skills {string[]} Skills that can be used to craft the droid
   * @property soak {number} Soak rating of the crafted droid
   * @property special {string} Qualities of the crafted droid
   * @property strain {number} Strain Threshold of the crafted droid
   * @property time {string} the time required to craft the droid
   * @property wounds {number} Wound Threshold of the crafted droid
   */

  /* Sender of chat messages */
  const speakingAs$1 = "Droid Mechanic";

  /* Types of droid templates which can be crafted */
  const TemplateType$2 = {
      Droid: {
          MONOTASK: 1,
          LABOR: 2,
          COMBAT: 3,
          SPECIALIST: 4,
          ADVANCED_COMBAT: 5
      },
      Directive: {
          LABOR: 6,
          COMBAT: 7,
          TRANSLATION: 8,
          REPAIR: 9,
          NAVIGATION: 10,
          HEALING: 11,
          ELIMINATION: 12
      }
  };

  /* Maps a TemplateType to its Template */
  const Template$2 = {
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.LABOR]: {
          difficulty: 1,
          name: "Labor Directive",
          skills: ["Computers"],
          skillsGranted: ["1 General Skill +2 ranks"],
          talentsGranted: [],
          time: "8 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.COMBAT]: {
          difficulty: 2,
          name: "Combat Directive",
          skills: ["Computers"],
          skillsGranted: ["3 Combat Skills +1 rank"],
          talentsGranted: ["Body Guard 1"],
          time: "16 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.TRANSLATION]: {
          difficulty: 3,
          name: "Translation Directive",
          skills: ["Computers"],
          skillsGranted: ["3 Knowledge Skills +1 rank", "Charm 1"],
          talentsGranted: ["Convincing Demeanor 1", "Kill with Kindness 1"],
          time: "24 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.REPAIR]: {
          difficulty: 3,
          name: "Repair Directive",
          skills: ["Computers"],
          skillsGranted: ["Computers 1", "Mechanics 2"],
          talentsGranted: ["Gearhead 1", "Solid Repairs 1"],
          time: "24 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.NAVIGATION]: {
          difficulty: 3,
          name: "Navigation Directive",
          skills: ["Computers"],
          skillsGranted: ["Astrogation 2", "Computers 1", "Piloting (Space) 1"],
          talentsGranted: ["Galaxy Mapper 1", "Technical Aptitude 1"],
          time: "72 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.HEALING]: {
          difficulty: 4,
          name: "Healing Directive",
          skills: ["Computers"],
          skillsGranted: ["Xenology 1", "Medicine 2"],
          talentsGranted: ["Bacta Specialist 1", "Surgeon 1"],
          time: "72 hours"
      },
      /** @type {DirectiveTemplate} */
      [TemplateType$2.Directive.ELIMINATION]: {
          difficulty: 5,
          name: "Elimination Directive",
          skills: ["Computers"],
          skillsGranted: [
              "Nemesis; gain Strain Threshold equal to Wound Threshold",
              "4 ranks in each of 3 Combat Skills",
              "Cool 2",
              "Xenology 1",
              "Mechanics 2",
              "Stealth 2"
          ],
          talentsGranted: ["Adversary 2", "Lethal Blows 3"],
          time: "168 hours"
      },
      /** @type {DroidTemplate} */
      [TemplateType$2.Droid.MONOTASK]: {
          characteristics: [1, 1, 1, 1, 1, 1],
          difficulty: 2,
          isRestricted: false,
          meleeDefense: 0,
          name: "Monotask Chassis",
          price: 600,
          rangedDefense: 0,
          rank: "Minion",
          rarity: 2,
          skills: ["Mechanics"],
          soak: 2,
          special: "Silhouette 0",
          strain: 0,
          time: "24 hours",
          wounds: 3
      },
      /** @type {DroidTemplate} */
      [TemplateType$2.Droid.LABOR]: {
          characteristics: [3, 1, 2, 1, 1, 1],
          difficulty: 2,
          isRestricted: false,
          meleeDefense: 0,
          name: "Labor Chassis",
          price: 3500,
          rangedDefense: 0,
          rank: "Minion",
          rarity: 3,
          skills: ["Mechanics"],
          soak: 4,
          special: "Silhouette 1",
          strain: 0,
          time: "48 hours",
          wounds: 7
      },
      /** @type {DroidTemplate} */
      [TemplateType$2.Droid.COMBAT]: {
          characteristics: [2, 2, 1, 1, 1, 1],
          difficulty: 3,
          isRestricted: true,
          meleeDefense: 0,
          name: "Combat Chassis",
          price: 3250,
          rank: "Minion",
          rangedDefense: 0,
          rarity: 2,
          skills: ["Mechanics"],
          soak: 2,
          special: "Silhouette 1",
          strain: 0,
          time: "48 hours",
          wounds: 4
      },
      /** @type {DroidTemplate} */
      [TemplateType$2.Droid.SPECIALIST]: {
          characteristics: [1, 1, 2, 2, 2, 2],
          difficulty: 4,
          isRestricted: false,
          meleeDefense: 0,
          name: "Specialist Chassis",
          price: 4500,
          rangedDefense: 0,
          rank: "Rival",
          rarity: 3,
          skills: ["Mechanics"],
          soak: 3,
          special: "Silhouette 1",
          strain: 0,
          time: "56 hours",
          wounds: 11
      },
      /** @type {DroidTemplate} */
      [TemplateType$2.Droid.ADVANCED_COMBAT]: {
          characteristics: [4, 3, 3, 3, 1, 1],
          difficulty: 5,
          isRestricted: true,
          meleeDefense: 0,
          name: "Advanced Combat Chassis",
          price: 32500,
          rangedDefense: 1,
          rank: "Nemesis",
          rarity: 7,
          skills: ["Mechanics"],
          soak: 7,
          special: "Silhouette 1",
          strain: 10,
          time: "240 hours",
          wounds: 19
      }
  };

  const construct$2 = (templateType) => {
      let tmpl = Template$2[templateType];
      if (!tmpl) {
          return;
      }
      let content = {
          title: "Droid Chassis Construction",
          subtitle: `${tmpl.name} (${tmpl.rank})`,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
          Characteristics: tmpl.characteristics.join("/"),
          Defense: `${tmpl.rangedDefense} | ${tmpl.meleeDefense}`,
          Soak: tmpl.soak,
          Qualities: tmpl.special,
          "Wound Threshold": tmpl.wounds,
          "Strain Threshold": tmpl.strain
      };
      sendPrivate(speakingAs$1, content);
  };

  const display$4 = (templateType) => {
      let tmpl = Template$2[templateType] || {};
      let content = {
          title: "Droid Construction",
          flavor: `Current Chassis/Directive: ${tmpl.name || "- None -"}`,
          wide: "Step 1: [Select a Chassis](!swrpg-craft-template #CraftDroidTemplate)",
          wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          wide3: `Step 3: [Construct Chassis](!swrpg-craft-construct ${templateType})`,
          wide4: `Step 4: [Program Directives](!swrpg-craft-program #CraftDirectiveTemplate)`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(speakingAs$1, content);
  };

  const program = (templateType) => {
      let tmpl = Template$2[templateType] || {};
      let content = {
          title: "Droid Directive Programming",
          subtitle: tmpl.name,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
          Skills: tmpl.skillsGranted.join("; "),
          Talents: tmpl.talentsGranted.join("; ")
      };
      sendPrivate(speakingAs$1, content);
  };

  var Droid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$2,
    display: display$4,
    program: program
  });

  /**
   * Core logic for crafting tools and gadgets
   *
   * @module swrpg/craft/gadget
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
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

  // Sender of chat messages
  const SpeakingAs$3 = "Engineering Droid";

  // Types of templates which can be crafted
  const TemplateType$3 = {
      SIMPLE: 1,
      SPECIALIST: 2,
      PRECISION: 3
  };

  // Maps a TemplateType to its Template
  const Template$3 = {
      /** @type {GadgetTemplate} */
      [TemplateType$3.SIMPLE]: {
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
      [TemplateType$3.SPECIALIST]: {
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
      [TemplateType$3.PRECISION]: {
          difficulty: 3,
          encumbrance: 5,
          isRestricted: false,
          name: "Precision Tool",
          price: 150,
          rarity: 3,
          skills: ["Mechanics"],
          special: "Remove 2blk from checks with chosen skill",
          time: "16 hours"
      }
  };

  const construct$3 = (templateType) => {
      let tmpl = Template$3[templateType] || {};
      let content = {
          title: "Gadget Construction",
          subtitle: tmpl.name,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`,
          Effect: tmpl.special,
          Encumbrance: tmpl.encumbrance
      };
      sendPrivate(SpeakingAs$3, content);
  };

  const display$5 = (templateType) => {
      let tmpl = Template$3[templateType] || {};
      let content = {
          title: "Gadget Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          wide: "Step 1: [Select a Template](!swrpg-craft-template #CraftGadgetTemplate)",
          wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          wide3: `Step 3: [Construct Gadget](!swrpg-craft-construct ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(SpeakingAs$3, content);
  };

  var Gadget = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$3,
    display: display$5
  });

  /**
   * Core logic for crafting lightsabers
   *
   * @module swrpg/craft/lightsaber
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /**
   * Crafting template for a lightsaber
   *
   * @typedef {Object} HiltTemplate
   *
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property encumbrance {number} Encumbrance of the crafted lightsaber
   * @property hands {string} Hands necessary to wield the lightsaber
   * @property hardpoints {number} Customization Hard Points on the lightsaber
   * @property isRestricted {boolean} whether the lightsaber is Restricted
   * @property name {string} the name of the lightsaber being crafted
   * @property price {number} base price of materials for crafting the lightsaber
   * @property rarity {number} Rarity rating of the materials for the lightsaber
   * @property skills {string[]} Skills that can be used to craft the lightsaber
   * @property special {string} Qualities of the crafted lightsaber
   * @property time {string} the time required to craft the lightsaber
   */

  /* Sender of chat messages */
  const SpeakingAs$4 = "The Living Force";

  /* Types of lightsaber templates which can be crafted */
  const TemplateType$4 = {
      STANDARD: 1,
      PRECISION: 2,
      DEFENSIVE: 3,
      DOUBLE: 4,
      PIKE: 5
  };

  /* Maps a TemplateType to its Template */
  const Template$4 = {
      /** @type {HiltTemplate} */
      [TemplateType$4.STANDARD]: {
          difficulty: 2,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 5,
          isRestricted: false,
          name: "Standard Hilt",
          price: 100,
          rarity: 4,
          skills: ["Mechanics", "Lore"],
          special: "None",
          time: "6 hours"
      },
      /** @type {HiltTemplate} */
      [TemplateType$4.PRECISION]: {
          difficulty: 2,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 3,
          isRestricted: false,
          name: "Precision Hilt",
          price: 150,
          rarity: 5,
          skills: ["Mechanics", "Lore"],
          special: "Accurate 1; Damage -1",
          time: "12 hours"
      },
      /** @type {HiltTemplate} */
      [TemplateType$4.DEFENSIVE]: {
          difficulty: 3,
          encumbrance: 1,
          hands: "One-handed",
          hardpoints: 3,
          isRestricted: false,
          name: "Defensive Hilt",
          price: 300,
          rarity: 6,
          skills: ["Mechanics", "Lore"],
          special: "Defensive 1; Damage -1",
          time: "12 hours"
      },
      /** @type {HiltTemplate} */
      [TemplateType$4.DOUBLE]: {
          difficulty: 3,
          encumbrance: 2,
          hands: "Two-handed",
          hardpoints: 4,
          isRestricted: false,
          name: "Double-bladed Hilt",
          price: 300,
          rarity: 5,
          skills: ["Mechanics", "Lore"],
          special: "Unwieldy 3; Linked 1; Attachments and Crystals cost double",
          time: "12 hours"
      },
      /** @type {HiltTemplate} */
      [TemplateType$4.PIKE]: {
          difficulty: 3,
          encumbrance: 2,
          hands: "Two-handed",
          hardpoints: 4,
          isRestricted: false,
          name: "Pole Hilt",
          price: 150,
          rarity: 5,
          skills: ["Mechanics", "Lore"],
          special: "Cumbersome 3; Defensive 1",
          time: "12 hours"
      }
  };

  const construct$4 = (templateType) => {
      let tmpl = Template$4[templateType] || {};
      let craftContent = {
          title: "Lightsaber Construction",
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
      };

      let itemContent = {
          title: tmpl.name,
          Qualities: tmpl.special,
          "Hands Required": tmpl.hands,
          Encumbrance: tmpl.encumbrance,
          "Hard Points": tmpl.hardpoints
      };

      sendPrivate(SpeakingAs$4, craftContent);
      sendPrivate(SpeakingAs$4, itemContent);
  };

  const display$6 = (templateType) => {
      let tmpl = Template$4[templateType] || {};
      let content = {
          title: "Lightsaber Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          "Step 1": "[Select a Hilt](!swrpg-craft-template #CraftHiltTemplate)",
          "Step 2": `[Acquire Hilt Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 3": `[Construct Hilt](!swrpg-craft-construct ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(SpeakingAs$4, content);
  };

  var Lightsaber = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$4,
    display: display$6
  });

  /**
   * Core logic for crafting vehicles. Based on the Nubian Design Collective's Whole Vehicle Crafting
   * Handbook
   *
   * @module swrpg/craft/vehicle
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   *
   * @see https://community.fantasyflightgames.com/topic/272869-the-nubian-design-collectives-whole-vehicle-crafting-handbook/
   */

  /**
   * Crafting template for a vehicle frame
   *
   * @typedef {Object} FrameTemplate
   *
   * @property altitude {number} Maximum altitude of the vehicle, in meters
   * @property assemblyCost {number} Cost for supplies needed to assemble the vehicle
   * @property assemblyCrew {number} Number of crew needed to assemble the vehicle
   * @property assemblyDifficulty {number} Difficulty of check to assemble the vehicle
   * @property assemblyTime {string} Time required to assemble the vehicle
   * @property crew {string} Description of vehicle crew complement
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property encumbrance {number} Encumbrance capacity of the vehicle
   * @property hardpoints {number} Customization Hard Points on the vehicle
   * @property hull {number} Hull Trauma Threshold of the vehicle
   * @property isRestricted {boolean} whether the vehicle is Restricted
   * @property name {string} the name of the vehicle being crafted
   * @property passenger {number} Passenger capacity of the vehicle
   * @property price {number} base price of materials for crafting the vehicle
   * @property rarity {number} Rarity rating of the materials for the vehicle
   * @property silhouette {number} Vehicle Silhouette
   * @property skills {string[]} Skills that can be used to craft the vehicle
   * @property special {string} Qualities of the crafted vehicle
   * @property speed {number} Maximum speed of the vehicle
   * @property time {string} the time required to craft the vehicle
   * @property type {string} the type of vehicle
   * @property vsl {number} Vehicle Scaling Law
   */

  /**
   * Crafting template for an engine
   *
   * @typedef {Object} EngineTemplate
   *
   * @property defense {string} Defense Ratings of the vehicle upon installing this Engine
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property hardpoints {number} Hard Point cost of installing this Engine
   * @property name {string} the name of the engine being crafted
   * @property price {number} base price of materials for crafting the engine
   * @property rarity {number} Rarity rating of the materials for the engine
   * @property skills {string[]} Skills that can be used to craft the engine
   * @property speed {number} the Max Speed of the vehicle upon installing this Engine
   * @property strain {string} System Strain Threshold of the vehicle upon installing this Engine
   * @property time {string} the time required to craft the engine
   */

  /**
   * Crafting template for a hull
   *
   * @typedef {Object} HullTemplate
   *
   * @property armor {number} Armor of the vehicle upon installing this Hull
   * @property difficulty {number} Difficulty of the crafting check for the template
   * @property handling {number} Handling of the vehicle upon installing this Hull
   * @property hardpoints {number} Hard Point change upon installing this Hull
   * @property hull {string} Hull Trauma Threshold change upon installing this Hull
   * @property name {string} the name of the Hull being crafted
   * @property price {number} base price of materials for crafting the Hull
   * @property rarity {number} Rarity rating of the materials for the Hull
   * @property skills {string[]} Skills that can be used to craft the Hull
   * @property special {string} special effects upon installing this Hull
   * @property speed {number} the Max Speed change upon installing this Hull
   * @property strain {string} System Strain Threshold change upon installing this Hull
   * @property time {string} the time required to craft the Hull
   */

  /* Sender of chat messages */
  const SpeakingAs$5 = "Mechanics Droid";

  /* Types of vehicle templates which can be crafted */
  const TemplateType$5 = {
      Frame: {
          BIKE: 30,
          LANDSPEEDER: 1,
          AIRSPEEDER: 2,
          WALKER: 3,
          STARFIGHTER: 4,
          TRANSPORT: 5,
          CORVETTE: 6,
          PATROL_SHIP: 7,
          CARRIER: 8,
          FRIGATE: 9,
          HEAVY_CRUISER: 10,
          DESTROYER: 11,
          SMALL_STATION: 12,
          MEDIUM_STATION: 13,
          LARGE_STATION: 14,
          MASSIVE_STATION: 15,
          SMALL_MOON: 16
      },
      Engine: {
          SINGLE_COIL: 17,
          BAFFLED: 18,
          ION_TURBINE: 19,
          FUSIAL: 20,
          REPULSOR: 21,
          DRIVE_ARRAY: 22
      },
      Hull: {
          BASIC: 23,
          RACE: 24,
          BULK: 25,
          TRANSPORT: 26,
          SCOUT: 27,
          GUNSHIP: 28,
          LINE: 29
      }
  };

  /* Maps a TemplateType to its Template */
  const Template$5 = {
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.BIKE]: {
          altitude: 15,
          assemblyCost: 1000,
          assemblyCrew: 1,
          assemblyDifficulty: 3,
          assemblyTime: "48 hours",
          crew: "One pilot",
          difficulty: 2,
          encumbrance: 1,
          hardpoints: 4,
          hull: 2,
          isRestricted: false,
          name: "Speeder Bike",
          passenger: 0,
          price: 250,
          rarity: 1,
          silhouette: 2,
          skills: ["Mechanics"],
          special: "",
          speed: 4,
          time: "12 hours",
          vsl: 5
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.LANDSPEEDER]: {
          altitude: 20,
          assemblyCost: 1000,
          assemblyCrew: 1,
          assemblyDifficulty: 3,
          assemblyTime: "48 hours",
          crew: "One pilot",
          difficulty: 2,
          encumbrance: 5,
          hardpoints: 5,
          hull: 7,
          isRestricted: false,
          name: "Landspeeder",
          passenger: 2,
          price: 500,
          rarity: 1,
          silhouette: 2,
          skills: ["Mechanics"],
          special: "",
          speed: 4,
          time: "24 hours",
          vsl: 5
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.AIRSPEEDER]: {
          altitude: 100000,
          assemblyCost: 1000,
          assemblyCrew: 1,
          assemblyDifficulty: 3,
          assemblyTime: "48 hours",
          crew: "One pilot",
          difficulty: 3,
          encumbrance: 5,
          hardpoints: 6,
          hull: 5,
          isRestricted: false,
          name: "Airspeeder",
          passenger: 2,
          price: 1000,
          rarity: 2,
          silhouette: 2,
          skills: ["Mechanics"],
          special: "Can receive 'Larger Scope' upgrade twice",
          speed: 4,
          time: "24 hours",
          vsl: 5
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.WALKER]: {
          altitude: 0,
          assemblyCost: 10000,
          assemblyCrew: 1,
          assemblyDifficulty: 3,
          assemblyTime: "120 hours",
          crew: "One pilot",
          difficulty: 3,
          encumbrance: 5,
          hardpoints: 8,
          hull: 10,
          isRestricted: false,
          name: "Walker",
          passenger: 0,
          price: 5000,
          rarity: 2,
          silhouette: 3,
          skills: ["Mechanics"],
          special: "All-Terrain Legs (SM65); Race Hull has base speed 3",
          speed: 5,
          time: "72 hours",
          vsl: 10
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.STARFIGHTER]: {
          altitude: -1,
          assemblyCost: 10000,
          assemblyCrew: 1,
          assemblyDifficulty: 3,
          assemblyTime: "120 hours",
          crew: "One pilot",
          difficulty: 3,
          encumbrance: 5,
          hardpoints: 11,
          hull: 10,
          isRestricted: false,
          name: "Starfighter",
          passenger: 0,
          price: 10000,
          rarity: 4,
          silhouette: 3,
          skills: ["Mechanics"],
          special: "",
          speed: 5,
          time: "72 hours",
          vsl: 10
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.TRANSPORT]: {
          altitude: -1,
          assemblyCost: 25000,
          assemblyCrew: 5,
          assemblyDifficulty: 3,
          assemblyTime: "240 hours",
          crew: "One pilot, one co-pilot",
          difficulty: 3,
          encumbrance: 20,
          hardpoints: 17,
          hull: 20,
          isRestricted: false,
          name: "Transport",
          passenger: 4,
          price: 75000,
          rarity: 3,
          silhouette: 4,
          skills: ["Mechanics"],
          special: "Cargo Bays and Passenger Berths cost -1HP; can receive 'Integrated Improvements' twice",
          speed: 4,
          time: "240 hours",
          vsl: 15
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.CORVETTE]: {
          altitude: -1,
          assemblyCost: 125000,
          assemblyCrew: 100,
          assemblyDifficulty: 4,
          assemblyTime: "1200 hours",
          crew: "80 officers, pilots, and crew",
          difficulty: 4,
          encumbrance: 215,
          hardpoints: 33,
          hull: 50,
          isRestricted: false,
          name: "Corvette",
          passenger: 160,
          price: 500000,
          rarity: 4,
          silhouette: 5,
          skills: ["Mechanics"],
          special: "Can receive 'Integrated Improvements' twice",
          speed: 3,
          time: "480 hours",
          vsl: 25
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.PATROL_SHIP]: {
          altitude: -1,
          assemblyCost: 125000,
          assemblyCrew: 100,
          assemblyDifficulty: 4,
          assemblyTime: "1200 hours",
          crew: 8,
          difficulty: 4,
          encumbrance: 20,
          hardpoints: 27,
          hull: 40,
          isRestricted: false,
          name: "Patrol Ship",
          passenger: 10,
          price: 500000,
          rarity: 4,
          silhouette: 5,
          skills: ["Mechanics"],
          special: "Can receive 'Integrated Improvements' twice; spend Triumph during crafting to gain 'Unusually Agile'",
          speed: 4,
          time: "480 hours",
          vsl: 25
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.CARRIER]: {
          altitude: -1,
          assemblyCost: 125000,
          assemblyCrew: 100,
          assemblyDifficulty: 4,
          assemblyTime: "1200 hours",
          crew: 800,
          difficulty: 4,
          encumbrance: 100,
          hardpoints: 37,
          hull: 60,
          isRestricted: true,
          name: "Carrier",
          passenger: 250,
          price: 1000000,
          rarity: 4,
          silhouette: 6,
          skills: ["Mechanics"],
          special: "Hangar and Repair Bays cost -1HP; can receive 'Larger Scope' and 'Integrated Improvements' twice",
          speed: 3,
          time: "480 hours",
          vsl: 35
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.FRIGATE]: {
          altitude: -1,
          assemblyCost: 125000,
          assemblyCrew: 100,
          assemblyDifficulty: 4,
          assemblyTime: "1200 hours",
          crew: 1000,
          difficulty: 4,
          encumbrance: 0,
          hardpoints: 47,
          hull: 80,
          isRestricted: true,
          name: "Frigate",
          passenger: 0,
          price: 1000000,
          rarity: 4,
          silhouette: 6,
          skills: ["Mechanics"],
          special: "Medical Bays cost 1HP",
          speed: 3,
          time: "480 hours",
          vsl: 35
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.HEAVY_CRUISER]: {
          altitude: -1,
          assemblyCost: 1250000,
          assemblyCrew: 5000,
          assemblyDifficulty: 5,
          assemblyTime: "2400 hours",
          crew: 3000,
          difficulty: 4,
          encumbrance: 0,
          hardpoints: 65,
          hull: 95,
          isRestricted: true,
          name: "Heavy Cruiser",
          passenger: 0,
          price: 2500000,
          rarity: 5,
          silhouette: 7,
          skills: ["Mechanics"],
          special: "Medical Bays and Weapon Banks cost 1HP",
          speed: 3,
          time: "1200 hours",
          vsl: 50
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.DESTROYER]: {
          altitude: -1,
          assemblyCost: 1250000,
          assemblyCrew: 5000,
          assemblyDifficulty: 5,
          assemblyTime: "2400 hours",
          crew: 8000,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 85,
          hull: 125,
          isRestricted: true,
          name: "Destroyer",
          passenger: 0,
          price: 10000000,
          rarity: 6,
          silhouette: 8,
          skills: ["Mechanics"],
          special: "Medical Bays and Weapon Banks cost 1HP; Cargo Bays, Hangar Bays, Repair Bays, Passenger Berths cost -1HP",
          speed: 2,
          time: "1200 hours",
          vsl: 65
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.SMALL_STATION]: {
          altitude: -1,
          assemblyCost: 125000,
          assemblyCrew: 100,
          assemblyDifficulty: 4,
          assemblyTime: "1200 hours",
          crew: 0,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 90,
          hull: 150,
          isRestricted: false,
          name: "Small Station",
          passenger: 0,
          price: 750000,
          rarity: 5,
          silhouette: 6,
          skills: ["Mechanics"],
          special: "Crafting Rules p5",
          speed: 0,
          time: "2400 hours",
          vsl: 35
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.MEDIUM_STATION]: {
          altitude: -1,
          assemblyCost: 1250000,
          assemblyCrew: 5000,
          assemblyDifficulty: 5,
          assemblyTime: "2400 hours",
          crew: 0,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 90,
          hull: 150,
          isRestricted: false,
          name: "Medium Station",
          passenger: 0,
          price: 2000000,
          rarity: 5,
          silhouette: 7,
          skills: ["Mechanics"],
          special: "Crafting Rules p5",
          speed: 0,
          time: "2400 hours",
          vsl: 50
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.LARGE_STATION]: {
          altitude: -1,
          assemblyCost: 3250000,
          assemblyCrew: 5000,
          assemblyDifficulty: 5,
          assemblyTime: "2400 hours",
          crew: 0,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 90,
          hull: 150,
          isRestricted: false,
          name: "Large Station",
          passenger: 0,
          price: 7500000,
          rarity: 5,
          silhouette: 8,
          skills: ["Mechanics"],
          special: "Crafting Rules p5",
          speed: 0,
          time: "2400 hours",
          vsl: 65
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.MASSIVE_STATION]: {
          altitude: -1,
          assemblyCost: 4000000,
          assemblyCrew: 5000,
          assemblyDifficulty: 5,
          assemblyTime: "2400 hours",
          crew: 0,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 90,
          hull: 150,
          isRestricted: false,
          name: "Massive Station",
          passenger: 0,
          price: 20000000,
          rarity: 5,
          silhouette: 9,
          skills: ["Mechanics"],
          special: "Crafting Rules p5",
          speed: 0,
          time: "2400 hours",
          vsl: 80
      },
      /** @type {FrameTemplate} */
      [TemplateType$5.Frame.SMALL_MOON]: {
          altitude: -1,
          assemblyCost: 10000000,
          assemblyCrew: 50000,
          assemblyDifficulty: 5,
          assemblyTime: "6000 hours",
          crew: 0,
          difficulty: 5,
          encumbrance: 0,
          hardpoints: 90,
          hull: 150,
          isRestricted: false,
          name: "That's no Moon...",
          passenger: 0,
          price: 75000000,
          rarity: 5,
          silhouette: 10,
          skills: ["Mechanics"],
          special: "Crafting Rules p5",
          speed: 0,
          time: "2400 hours",
          vsl: 100
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.SINGLE_COIL]: {
          defense: "0/0/0/0",
          difficulty: 1,
          hardpoints: 2,
          name: "Single Ion Coil",
          price: 500,
          rarity: 2,
          skills: ["Mechanics"],
          speed: 1,
          strain: "2*Silhouette",
          time: "24 hours"
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.BAFFLED]: {
          defense: "0/0/0/2",
          difficulty: 2,
          hardpoints: 4,
          name: "Electron Baffle",
          price: 1000,
          rarity: 3,
          skills: ["Mechanics"],
          speed: 2,
          strain: "4*Silhouette",
          time: "48 hours"
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.ION_TURBINE]: {
          defense: "1/0/0/0",
          difficulty: 2,
          hardpoints: 3,
          name: "Ion Turbine",
          price: 2000,
          rarity: 2,
          skills: ["Mechanics"],
          speed: 1,
          strain: "1xVSL",
          time: "48 hours"
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.FUSIAL]: {
          defense: "1/0/0/0",
          difficulty: 3,
          hardpoints: 3,
          name: "Fusial Thrust",
          price: 2500,
          rarity: 4,
          skills: ["Mechanics"],
          speed: 3,
          strain: "4*Silhouette",
          time: "60 hours"
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.REPULSOR]: {
          defense: "1/1/1/1",
          difficulty: 3,
          hardpoints: 4,
          name: "Repulsor Cluster",
          price: 3000,
          rarity: 4,
          skills: ["Mechanics"],
          speed: 4,
          strain: "4*Silhouette",
          time: "120 hours"
      },
      /** @type {EngineTemplate} */
      [TemplateType$5.Engine.DRIVE_ARRAY]: {
          defense: "0/0/0/0",
          difficulty: 4,
          hardpoints: 4,
          name: "Ion Drive Array",
          price: 5250,
          rarity: 5,
          skills: ["Mechanics"],
          speed: 4,
          strain: "2*Silhouette",
          time: "120 hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.BASIC]: {
          armor: 1,
          difficulty: 2,
          handling: -2,
          hardpoints: "No change",
          hull: "No change",
          name: "Basic Hull",
          price: 500,
          rarity: 2,
          skills: ["Mechanics"],
          special: "None",
          speed: "No change",
          strain: "No change",
          time: "48*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.RACE]: {
          armor: 1,
          difficulty: 2,
          handling: 1,
          hardpoints: -1,
          hull: "-1*Silhouette",
          name: "Race Ship",
          price: 500,
          rarity: 2,
          skills: ["Mechanics"],
          special: "None",
          speed: "+1 regardless of Silhouette",
          strain: "-1*Silhouette",
          time: "48*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.BULK]: {
          armor: 1,
          difficulty: 3,
          handling: -4,
          hardpoints: "No change",
          hull: "No change",
          name: "Bulk Freighter",
          price: 1000,
          rarity: 3,
          skills: ["Mechanics"],
          special: "Cargo Bays have higher capacity",
          speed: "No change",
          strain: "No change",
          time: "72*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.TRANSPORT]: {
          armor: 1,
          difficulty: 3,
          handling: -2,
          hardpoints: "No change",
          hull: "No change",
          name: "Transport",
          price: 1000,
          rarity: 3,
          skills: ["Mechanics"],
          special: "Cargo Bays, Hangar Bays, Passenger Berths, and Repair Bays cost -1HP",
          speed: "No change",
          strain: "No change",
          time: "72*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.SCOUT]: {
          armor: 2,
          difficulty: 3,
          handling: 1,
          hardpoints: "No change",
          hull: "No change",
          name: "Scout Ship",
          price: 1000,
          rarity: 5,
          skills: ["Mechanics"],
          special: "Repair Bays cost -1HP",
          speed: "No change",
          strain: "No change",
          time: "72*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.GUNSHIP]: {
          armor: 3,
          difficulty: 4,
          handling: -2,
          hardpoints: "No change",
          hull: "No change",
          name: "Gunship",
          price: 2000,
          rarity: 5,
          skills: ["Mechanics"],
          special: "Can mount 1 Oversized Weapon",
          speed: "No change",
          strain: "No change",
          time: "96*Silhouette hours"
      },
      /** @type {HullTemplate} */
      [TemplateType$5.Hull.LINE]: {
          armor: 5,
          difficulty: 4,
          handling: -2,
          hardpoints: "No change",
          hull: "No change",
          name: "Gunship",
          price: 3000,
          rarity: 7,
          skills: ["Mechanics"],
          special: "Can mount Weapon Banks; maximum Armor rating Silhouette+2; Medical Bays cost 1HP",
          speed: "No change",
          strain: "No change",
          time: "96*Silhouette hours"
      }
  };

  const construct$5 = (templateType) => {
      let tmpl = Template$5[templateType] || {};
      let content = {
          title: "Vehicle Construction",
          subtitle: tmpl.name,
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2xVSL hours for each additional success`,
          Effect: tmpl.special || "None"
      };
      sendPrivate(SpeakingAs$5, content);
  };

  const display$7 = (templateType) => {
      let tmpl = Template$5[templateType] || {};
      let content = {
          title: "Vehicle Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          "Step 1": "[Select a Frame](!swrpg-craft-template #CraftFrameTemplate)",
          "Step 2": `[Acquire Frame Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 3": `[Construct Frame](!swrpg-craft-construct ${templateType})`,
          "Step 4": "[Select an Engine](!swrpg-craft-template #CraftEngineTemplate)",
          "Step 5": `[Acquire Engine Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 6": `[Construct Engine](!swrpg-craft-construct ${templateType})`,
          "Step 7": "[Select a Hull](!swrpg-craft-template #CraftHullTemplate)",
          "Step 8": `[Acquire Hull Materials (xVSL)](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          "Step 9": `[Construct Hull](!swrpg-craft-construct ${templateType})`,
          "Step 10": `[Assemble Vehicle](!swrpg-craft-assemble ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(SpeakingAs$5, content);
  };

  const assemble = (templateType) => {
      let tmpl = Template$5[templateType] || {};

      // FIXME This won't work without selecting the Frame template again before Assembling
      let assembleContent = {
          title: "Vehicle Assembly",
          flavor: `${tmpl.skills.join(", ")} (${tmpl.assemblyDifficulty})`,
          prewide: `Time Required: ${tmpl.assemblyTime}, -5xVSL hours per additional success`,
          wide: `Crew Required: ${tmpl.assemblyCrew}`,
          wide2: `Supply Cost: ${tmpl.assemblyCost}`
      };
      sendPrivate(SpeakingAs$5, assembleContent);
  };

  var Vehicle = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$5,
    display: display$7,
    assemble: assemble
  });

  /**
   * Core logic for crafting weapons
   *
   * @module swrpg/craft/weapon
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

  /* Sender of chat messages */
  const speakingAs$2 = "Weaponsmith Droid";

  /* Types of weapon templates which can be crafted */
  const TemplateType$6 = {
      FIST: 16,
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
  };

  /* Maps a TemplateType to its Template */
  const Template$6 = {
      /** @type {WeaponTemplate} */
      [TemplateType$6.FIST]: {
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
      [TemplateType$6.BLUNT]: {
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
      [TemplateType$6.SHIELD]: {
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
      [TemplateType$6.BLADED]: {
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
      [TemplateType$6.VIBRO]: {
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
      [TemplateType$6.POWERED]: {
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
      [TemplateType$6.SIMPLE]: {
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
      [TemplateType$6.SOLID_PISTOL]: {
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
      [TemplateType$6.SOLID_RIFLE]: {
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
      [TemplateType$6.ENERGY_PISTOL]: {
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
      [TemplateType$6.ENERGY_RIFLE]: {
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
      [TemplateType$6.HEAVY_RIFLE]: {
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
      [TemplateType$6.LAUNCHER]: {
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
      [TemplateType$6.MISSILE]: {
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
      [TemplateType$6.GRENADE]: {
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
      [TemplateType$6.MINE]: {
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

  const construct$6 = (templateType) => {
      let tmpl = Template$6[templateType] || {};
      let craftContent = {
          title: "Weapon Construction",
          flavor: `${tmpl.skills.join(", ")} (${DifficultyToDice[tmpl.difficulty]})`,
          prewide: `Time Required: ${tmpl.time}, -2 hours for each additional success`
      };

      let itemContent = {
          title: tmpl.name,
          subtitle: tmpl.type,
          Damage: tmpl.damage,
          Critical: tmpl.critical,
          Qualities: tmpl.special,
          Range: tmpl.range,
          "Hands Required": tmpl.hands,
          Encumbrance: tmpl.encumbrance,
          "Hard Points": tmpl.hardpoints
      };

      sendPrivate(speakingAs$2, craftContent);
      sendPrivate(speakingAs$2, itemContent);
  };

  const display$8 = (templateType) => {
      let tmpl = Template$6[templateType] || {};
      let content = {
          title: "Weapon Construction",
          flavor: `Current Template: ${tmpl.name || "- None -"}`,
          wide: "Step 1: [Select a Template](!swrpg-craft-template #CraftWeaponTemplate)",
          wide2: `Step 2: [Acquire Materials](!swrpg-craft-acquire ${tmpl.rarity} ${tmpl.price} ${Macros.tradeLocation})`,
          wide3: `Step 3: [Construct Weapon](!swrpg-craft-construct ${templateType})`,
          "Back to": Macros.craftingMain
      };
      sendPrivate(speakingAs$2, content);
  };

  var Weapon = /*#__PURE__*/Object.freeze({
    __proto__: null,
    construct: construct$6,
    display: display$8
  });

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
  const speakingAs$3 = "Trade Representative";

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
  const display$9 = (rarity, region, tradeProximity, population, basePrice) => {
      let diff = difficulty$2(rarity, region, tradeProximity, population);
      let buy = Math.ceil(purchasePrice(diff, basePrice));
      let sellList = sellPrices(buy).map(Math.ceil);
      let content = {
          title: "Trade Negotiations",
          flavor: `Negotiation or Streetwise (${DifficultyToDice[diff]})`,
          prewide: `Purchase Price: ${buy}`,
          header: "Sell Prices",
          wide: `${Dice.Success(1)} ${sellList[0]}`,
          wide2: `${Dice.Success(2)} ${sellList[1]}`,
          wide3: `${Dice.Success(3)} ${sellList[2]}`
      };
      sendPrivate(speakingAs$3, content);
  };

  // Calculate the Difficulty of the Negotiation or Streetwise roll
  const difficulty$2 = (rarity, region, tradeProximity, population) => clampDifficulty([
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

  /* Sender of chat messages */
  const SpeakingAs$6 = "Crafting Droid";

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
      ModeToModule[currentMode] ? ModeToModule[currentMode].display(currentTemplate) : display$a();
  };

  /**
   * Cache of the currently selected TemplateType
   * @type {TemplateType}
   */
  let currentTemplate;
  const setTemplate = (t) => {
      currentTemplate = t;
      ModeToModule[currentMode] ? ModeToModule[currentMode].display(currentTemplate) : display$a();
  };

  // Step 2: Acquire Materials
  const acquire = (rarity, basePrice, region, tradeProximity, population) => {
      let diff = difficulty$2(rarity, region, tradeProximity, population);
      let buy = purchasePrice(diff, basePrice);
      let content = {
          title: "Acquiring Materials",
          Difficulty: diff,
          "Purchase Price": buy
      };
      sendPrivate(SpeakingAs$6, content);
  };

  // Step 3: Construct
  const construct$7 = () => {
      (currentTemplate && ModeToModule[currentMode]) ?
          ModeToModule[currentMode].construct(currentTemplate) :
          display$a();
  };

  // Render the entry point chat UI for the crafting system
  const display$a = () => {
      currentMode = CraftingMode.NONE;
      currentTemplate = undefined;
      let content = {
          title: "Crafting Station",
          wide: `${Macros.craftArmor} ${Macros.craftDroid}`,
          wide2: `${Macros.craftGadget} ${Macros.craftLightsaber}`,
          wide3: `${Macros.craftVehicle} ${Macros.craftWeapon}`,
          wide4: `${Macros.craftCybernetic}`
      };
      sendPrivate(SpeakingAs$6, content);
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
  const speakingAs$4 = "Repair Droid";

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
  const display$b = (condition, basePrice) => {
      let diff = difficulty$3(condition);
      let price = cost(condition, basePrice);
      let content = {
          title: "Item Repair",
          Difficulty: diff,
          "Repair Cost": price,
          wide: `${Dice.Advantage(1)} or ${Dice.Threat(1)} modifies cost by 10% each`
      };
      sendPrivate(speakingAs$4, content);
  };

  // Calculate the Difficulty of the repair check
  const difficulty$3 = (condition) => condition;

  // Calculate the material cost of the repairs
  const cost = (condition, basePrice) => basePrice * CostModifier[condition];

  /**
   * Core logic for slicing encounters
   *
   * @module swrpg/slice/core
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /* Sender of chat messages */
  const SpeakingAs$7 = "H4-x0r";

  /* Tracks number of security programs currently running */
  let SecurityPrograms = 0;
  const decreaseSecurity = () => {
      SecurityPrograms = Math.max(SecurityPrograms-1, 0);
      display$c();
  };
  const increaseSecurity = () => {
      SecurityPrograms++;
      display$c();
  };
  const resetSecurity = () => {
      SecurityPrograms = 0;
      display$c();
  };

  const access = () => {
      let content = {
          title: "Access Difficulties",
          flavor: "Computers (INT)",
          prewide: `**Defensive Slicing** adds ${Dice.Setback(1)} per Rank
            **Improved Defensive Slicing** upgrades difficulty per Rank`,
          wide: `*Cantina Terminal, Datapad*: ${Dice.Difficulty.EASY}`,
          wide2: `*Common Vehicle Computer*: ${Dice.Difficulty.AVERAGE}`,
          wide3: `*Local HoloNet, Military system*: ${Dice.Difficulty.HARD}`,
          wide4: `*Regional HoloNet, Imperial Datavault*: ${Dice.Difficulty.DAUNTING}`,
          wide5: `*Ancient Archive*: ${Dice.Difficulty.FORMIDABLE}`
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const activateSecurity = () => {
      let content = {
          title: "Activate a Security Program",
          flavor: `Computers (${Dice.Difficulty.AVERAGE})`
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const backdoor = () => {
      let content = {
          title: "Create or Locate Backdoor",
          flavor: `Computers (${Dice.Difficulty.HARD})`
      };
      sendPrivate(SpeakingAs$7, content);
  };

  // Disabling a Security Program has same difficulties as System Access check
  const disableSecurity = access;

  const display$c = () => {
      let content = {
          title: "Slicing Encounter",
          flavor: "Actions with * may only be executed by an Intruder when no Security Programs are active.",
          prewide: `*Active Security Programs: ${SecurityPrograms}*
              ${Macros.sliceIncrease} ${Macros.sliceDecrease} ${Macros.sliceReset}`,
          wide: Macros.sliceAccess,
          wide2: `${Macros.sliceActivate} ${Macros.sliceDisable}`,
          wide3: `${Macros.sliceEnact} ${Macros.sliceLockdown}`,
          wide4: `${Macros.sliceExpel} ${Macros.sliceTrace}`
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const enact = () => {
      let content = {
          title: "Enact Command",
          flavor: "Computers",
          wide: "Difficulty is set by similarity of command to the intended function of the system"
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const expel = () => {
      let content = {
          title: "Expel User",
          flavor: "Opposed Computers",
          prewide: `Add ${Dice.Boost(1)} per known Signature fragment`,
          wide: "If expelled, upgrade the difficulty of further Access System checks by two"
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const lockdown = () => {
      let content = {
          title: "Lockdown",
          flavor: `Computers (${Dice.Difficulty.HARD})`,
          wide: "Character must have physical access to restart the system"
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const restart = () => {
      let content = {
          title: "Restart System",
          flavor: `Computers (${Dice.Difficulty.AVERAGE})`,
          wide: "Must have physical access",
          wide2: "Takes one hour"
      };
      sendPrivate(SpeakingAs$7, content);
  };

  const trace = () => {
      let content = {
          title: "Trace User",
          flavor: "Opposed Computers",
          prewide: `Add ${Dice.Boost(1)} per known Signature fragment`,
          header: "On Success, learn one of:",
          wide: "Target's physical location",
          wide2: "One segment of target's Signature",
          wide3: "Full list of actions target has taken in system this encounter"
      };
      sendPrivate(SpeakingAs$7, content);
  };

  /**
   * Core logic for social encounters
   *
   * @module swrpg/social/core
   *
   * @author Draico Dorath
   * @copyright 2020
   * @license MIT
   */

  /* Sender of chat messages */
  const SpeakingAs$8 = "C-4D4";

  const charm = () => {
      let content = {
          title: "Charm (Presence)",
          subtitle: "Opposed by: Cool",
          flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
          wide: "Charming a crowd has a fixed difficulty instead of being opposed",
          wide2: `Extra ${Dice.Success(1)} extends support for additional scenes
            ${Dice.Advantage(1)} affects unexpected subjects beyond target
            ${Dice.Triumph(1)} may be used to have target become minor recurring ally`,
          wide4: `${Dice.Threat(1)} reduces the number of affected people
            ${Dice.Despair(1)} turns the NPC into a minor recurring adversary`
      };
      sendPrivate(SpeakingAs$8, content);
  };

  const coercion = () => {
      let content = {
          title: "Coercion (Willpower)",
          subtitle: "Opposed by: Discipline",
          flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
          wide: "Intimidating a crowd has a fixed difficulty instead of being opposed",
          wide2: `${Dice.Success(2)} inflicts 1 strain on the target
            ${Dice.Advantage(2)} affects unexpected subjects beyond target
            ${Dice.Triumph(1)} may be used to have target become subjugated, if flighty`,
          wide3: `${Dice.Threat(1)} builds resentment towards coercer
            ${Dice.Despair(1)} reveals too much information to target`
      };
      sendPrivate(SpeakingAs$8, content);
  };

  const deception = () => {
      let content = {
          title: "Deception (Cunning)",
          subtitle: "Opposed by: Discipline",
          flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
          wide: `Extra ${Dice.Success(1)} extends the life of the lie
            ${Dice.Advantage(1)} increases the value of goods/services provided
            ${Dice.Triumph(1)} fools target into believing the liar is trustworthy`,
          wide2: `${Dice.Threat(1)} increases suspicion
            ${Dice.Despair(1)} increases hostility and harms reputation`
      };
      sendPrivate(SpeakingAs$8, content);
  };

  const leadership = () => {
      let content = {
          title: "Leadership (Presence)",
          subtitle: "Opposed by: Discipline",
          flavor: "Modify Difficulty based on complexity of orders and intelligence/professionalism of targets",
          wide: `Extra ${Dice.Success(1)} extends duration of obedience or increases target effectiveness
            ${Dice.Advantage(1)} affects bystanders as well
            ${Dice.Triumph(1)} may be used to have target become minor recurring ally`,
          wide2: `${Dice.Threat(1)} decreases effectiveness of targets
            ${Dice.Despair(1)} undermines authority`
      };
      sendPrivate(SpeakingAs$8, content);
  };

  const negotation = () => {
      let content = {
          title: "Negotiation (Presence)",
          subtitle: "Opposed by: Cool or Negotiation",
          wide: `Extra ${Dice.Success(1)} increases acting character's profit by 5% each or improves scope of agreement
            ${Dice.Advantage(1)} grants concessions on a failed check or extra perks on success
            ${Dice.Triumph(1)} target may become regular client or specialist vendor, may offer specific goods or referrals`,
          wide2: `${Dice.Threat(1)} decreases acting character's profit by 5% each or reduces scope of deal
            ${Dice.Despair(1)} seriously sabotages deal or relationship`
      };
      sendPrivate(SpeakingAs$8, content);
  };

  const display$d = () => {
      let content = {
          title: "Social Encounter",
          flavor: `Prior relationship may add ${Dice.Boost(1)} / ${Dice.Setback(1)} as appropriate`,
          wide: `${Macros.socialCharm} ${Macros.socialCoercion}`,
          wide2: `${Macros.socialDeception} ${Macros.socialLeadership}`,
          wide3: Macros.socialNegotiation
      };
      sendPrivate(SpeakingAs$8, content);
  };

  /**
   * Primary API entry point containing command router and Roll20 Event listeners
   *
   * @module swrpg/api
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
   * @function execute
   */
  function execute(command, input) {
      const routes = {
          "contact": display$1,
          "craft-acquire": acquire,
          "craft-assemble": assemble,
          "craft-construct": construct$7,
          "craft-mode": setMode,
          "craft-program": program,
          "craft-template": setTemplate,
          "craft-ui": display$a,
          "repair": display$b,
          "slice-access": access,
          "slice-activate": activateSecurity,
          "slice-backdoor": backdoor,
          "slice-disable": disableSecurity,
          "slice-enact": enact,
          "slice-expel": expel,
          "slice-lockdown": lockdown,
          "slice-restart": restart,
          "slice-security-dec": decreaseSecurity,
          "slice-security-inc": increaseSecurity,
          "slice-security-reset": resetSecurity,
          "slice-trace": trace,
          "slice-ui": display$c,
          "social-ui": display$d,
          "social-charm": charm,
          "social-coercion": coercion,
          "social-deception": deception,
          "social-leadership": leadership,
          "social-negotiation": negotation,
          "trade": display$9,
          "ui": display
      };

      if (!(routes[command] && (typeof routes[command] === "function"))) {
          return;
      }

      routes[command](...input);
  }

  on("chat:message", route);
  on("ready", () => {
      log(`[SWRPG] v${version} loaded.`);
  });

}());
