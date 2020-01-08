# Roll20 GM Utilities for FFG Star Wars RPG

Implements several helpful Roll20 macros for GMs of the
[Star Wars RPG](https://www.fantasyflightgames.com/en/products/#/universe/star-wars) by
[Fantasy Flight Games](https://www.fantasyflightgames.com/).

## Installation and Setup

1. [Add a new Script](https://wiki.roll20.net/API:Use_Guide) to your Roll20 game
1. Copy `dist/swrpg.js` and paste it into the contents of this new Script.
1. Name the new Script something like "SWRPG"
1. Save the new Script
1. If successful, you should see `"[SWRPG] vX.X.X loaded."` in the *API Output Console*
1. Launch your game
1. Create new macros exactly as defined in `dist/swrpg-macros.txt`
1. The primary top-level macros are:
    * `PartyLocation`: sends a GM chat message of the Party's Current Location, as defined
        [on the GM Sheet](https://wiki.roll20.net/SWRPG-API-Compatible#General_Info)
    * `TradeItem`: Prompts to help the GM assign a difficulty and prices for the sale/purchase of an Item
    * `RepairItem`: Prompts to help the GM assign a difficulty and prices for the repair of an Item  
    * `ContactInvestigate`: Prompts to help the GM roll and define a response time for the party's Contact Network, as
        defined in the [Endless Vigil](https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny/products/endless-vigil/)
        sourcebook.
        
Personally I put these four macros in my Macro Bar, then color code them for very quick access.

## API Commands

TODO
