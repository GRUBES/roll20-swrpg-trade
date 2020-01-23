# Roll20 GM Utilities for FFG Star Wars RPG

Implements several helpful Roll20 macros for GMs of the
[Star Wars RPG](https://www.fantasyflightgames.com/en/products/#/universe/star-wars) by
[Fantasy Flight Games](https://www.fantasyflightgames.com/).

## Installation and Setup

1. [Add a new Script](https://wiki.roll20.net/API:Use_Guide) to your Roll20 game
1. Copy [`dist/swrpg.js`](dist/swrpg.js) and paste it into the contents of this new Script.
1. Name the new Script something like "SWRPG"
1. Save the new Script
1. If successful, you should see `"[SWRPG] vX.X.X loaded."` in the *API Output Console*
1. Launch your game
1. Create new Macros exactly as defined in [`dist/swrpg-macros.txt`](dist/swrpg-macros.txt)
        
Personally I put these four macros in my Macro Bar, then color code them for very quick access.

## GM Macros

This section describes the Macros used by this script and available for GMs to reuse.

See [swrpg-macros.txt](dist/swrpg-macros.txt) for all Macros.
 
### General Utility Macros

#### `PartyLocation`

Whispers to the GM the party's current location as defined in `-DicePool sheet > Player Group Sheet > Current Location`.

### Item Repair Macros

The Repair module of the script follows the rules for repairing equipment as defined in the Core Rulebook.

#### `RepairCondition`

Prompts the GM to select the Condition of an Item. Used by the Repair Item module.

#### `RepairItem`

Prompts the GM for the Condition and Base Price of an Item, then whispers the GM with the Difficulty and Material Cost
of repairing said Item.

### Trade Macros

The Trade module of the script follows the Galactic Economy rules as defined in the Core Rulebook.

#### `TradeItem`

Prompts the GM for all values necessary to conduct the purchase or sale of an Item, then whispers the GM with the
Difficulty of the check, the suggested purchase price, and suggested sale prices.

#### `TradeLocation`

Prompts the GM for the party's current location (Region). Regions further from the Core are more difficult and
more expensive (or lucrative) to trade in.

#### `TradePopulation`

Prompts the GM for the population level of the party's current location. Lower population areas make it more difficult
and more expensive to trade.

#### `TradeProximity`

Prompts the GM for how close the party currently is to a major hyperspace trade route. Locations further from trade
routes are more difficult and more expensive to trade in.

#### `TradeRarity`

Prompts the GM for the Rarity of the Item being traded.

### Contact Network Macros

The Contact Network module of the script follows the rules for managing party contact networks as defined in
the [Endless Vigil](https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny/products/endless-vigil/)
sourcebook.

#### `ContactInvestigate`

Prompts the GM for all information necessary for a Contact Network to conduct an investigation on behalf of the party,
then whispers the GM with the results of the roll and a suggested response timeframe.

Known issue: Currently the Network's investigation roll is public; the character sheet does not allow for privately
rolled dice.

#### `ContactScope`

Prompts the GM for the Contact Network's current Scope rating. This generally sets the base Ability of the subsequent
investigation roll.

#### `ContactExpertise`

Prompts the GM for the Contact Network's current Expertise rating. This determines how many Ability upgrades the pool
will receive.

#### `ContactObscurity`

Prompts the GM for the obscurity of the information requested. More obscure information is more difficult and takes
longer to find.

#### `ContactReputation`

Prompts the GM for the party's current Reputation with this Contact Network. Higher reputations reduce response time.

#### `ContactRelevance`

Prompts the GM for how relevant the requested information is to the Contact Network's Expertise. More relevant
information is easier and faster to find.

### Crafting Macros

The Crafting module of the script follows the detailed crafting rules defined in the Core Rulebook, the
[Endless Vigil](https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny/products/endless-vigil/)
sourcebook, the
[Special Modifications](https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire/products/special-modifications/)
sourcebook, and the
[Fully Operational](https://www.fantasyflightgames.com/en/products/star-wars-age-of-rebellion/products/fully-operational/)
sourcebook.

#### `CraftItem`

Whispers the main crafting UI to the GM. The Crafting process is a series of steps that can be followed by clicking
the appropriate button in the chat UI. Results and recommendations will then be whispered to the GM.

#### `Craft*Template`

Selecting a Template is the first step in the Crafting process. There is a Template selection Macro for every
type of crafting that may be performed (weapons, vehicles, etc).

Each Macro will prompt the GM for the appropriate Template.

A Template must be selected before continuing the subsequent steps in the Crafting process.

### Slicing Macros

The Slicing module of the script follows the detailed slicing rules defined in the
[Special Modifications](https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire/products/special-modifications/)
sourcebook.

#### `SliceSystem`

Whispers the main Slicing UI to the GM that will aid in running a Slicing encounter. This chat UI displays a
button for each type of Action that may be undertaken by an Intruder or Defender during the encounter, as well
as a system for tracking how many Security Programs are active in the system being sliced.

Clicking the appropriate button in the chat UI will whisper the GM with advice on setting the Difficulty of the
corresponding Action.

### Social Modules

The Social module of the script provides advice for the GM on running social encounters as defined in the Core Rulebook.

#### `SocialEncounter`

Whispers the main Social UI to the GM that will aid in running a Social encounter. This chat UI displays a
button for each type of social skill that might be leveraged during the encounter.

Clicking on a particular Skill button will whisper to the GM advice on setting the Difficulty of the check, on which
skill opposes the selected skill, and on spending Advantages, Triumphs, Threats, and Despairs for the check.

## API Commands

TODO
