# CALIGO — FULL CHANGELOG & IMPLEMENTATION LOG
**Project:** Caligo — Rise in the Vertical City  
**Latest Update:** 2026-10-27  
**Save Version:** 4  
**Test Suite:** 26/26 Suites Passing (100%)

---

## [Phase 4 & Research Parity Update] — 2026-10-27

### 1. Research Parity Corrections (Crimes 2.0)
- **Pickpocketing Nerve & Target Fix**: Corrected base Nerve cost from 1 to the researched **5**. Implemented all **22 researched Pickpocketing targets** (`D.pickpocketTargets`) with situational condition checks (e.g. Walking only, Loitering, Listening to music), difficulty modifiers, Cut-Throat Razor enhancer integration, and unique drops (e.g. Opium, Wire Cutters, Crocozade, Rare Stamp, Police Badge, Thong).
- **Shoplifting Nerve Correction**: Corrected base Nerve cost from 2 to **4**. Added Mountain Bike enhancer (+10% success odds).
- **Card Skimming Nerve Correction**: Corrected base Nerve cost from 4 to **6**. Added Reinforced Duct Tape enhancer.
- **Burglary 34 Locations**: Implemented all **34 researched Burglary locations** across Residential (12), Commercial (11), and Industrial (11) sectors. Enforced specific tool requirements (Jemmy, Lockpicks, Window Breaker, Skeleton Key, Rope, Credit Card) and Heavy Flashlight enhancer.
- **Search for Cash**: Added all **6 researched subcrimes** (Trash, Subway, Junkyard, Beach, Cemetery, Fountain) with 2 Nerve cost, Reading Glasses enhancer, and collectible outcomes.
- **Disposal Jobs & Methods**: Implemented **12 Disposal jobs** and **5 methods** (Abandon 6N, Bury 8N, Burn 10N, Sink 12N, Dissolve 14N). Enforced required tools/consumables (Shovel, Gasoline, Acid) and Latex Gloves enhancer.
- **Crime Families Complete Set**: Added full support for Cracking (7N brute-force / 5N crack, Office Chair enhancer), Forgery (0N start / 5N step, Magnifying Glass enhancer), Scamming (8N lead farm / 3N converse, Ergonomic Keyboard enhancer), and Arson (7-step sequence with Windproof Lighter enhancer).
- **Tool Enforcement & Item Breakage**: `A.attemptCrime` strictly checks that required tools are present in player luggage before allowing execution, and consumes consumables (Gasoline, Acid) upon use.

### 2. Real Estate & Property System
- **Catalogue (`js/data/properties.js`)**: Added all **14 residential tiers** from Shack ($0, cap 100) to Private Island ($500M, cap 5,025) with authentic happiness capacities and daily upkeep.
- **Dynamic Happiness Multiplier**: Connected player active residence to `S.maxHappiness`, directly scaling maximum happiness bars and multiplying gym stat progression.
- **Economy Actions (`js/actions/economy.js`)**:
  - `A.buyProperty(propId)`: Affordability check, ownership registration, automatic move-in, and happiness cap update.
  - `A.moveProperty(propId)`: Re-locates active primary residence among owned properties.
  - `A.sellProperty(propId)`: Refunds 75% market purchase value; automatically re-houses player into Shack if primary residence is sold.
- **Interactive UI (`js/ui/screens/properties.js`)**: Replaced placeholder modal with an active residence header, ownership status badges (`Active Home`, `Owned`, `For Sale`), and interactive Buy/Move In/Sell buttons.

### 3. Community Forums System
- **Interactive Board Navigation (`js/ui/screens/forums.js`)**: Replaced static toast placeholder with interactive board navigation across General Discussion, Questions & Answers, Tutorials & Guides, Trading Post, Faction Discussion, and Achievements.
- **Lore & Strategy Seed Threads**: Added authentic syndicate lore, mechanics guidance, and trade dispatches.
- **Player Dispatches & Replies**: Allowed player to publish new threads and submit replies, persisting dynamically into `save.forums`.

### 4. Merit System & Combat Mathematics
- **Merits Allocation (`js/ui/screens/merits.js`)**: Added full visual merit upgrades screen supporting 11 merit categories (Natural Nerve Bar, Sharpness, Brawn, Protection, Evasion, Critical Hit, Crime Experience, Education Speed, Bank APR, Mugging, Max Life) with free resets.
- **Combat Armor Mitigation**: Updated `combat.js` to apply $D(A) = D(I) \times (1 - A/100)$ damage mitigation based on equipped armor ratings.
- **Combat Critical Hits**: Applied `S.critChance` derived from baseline + merit upgrades in combat resolution.

### 5. Storage, Migration & Verification
- **Save Version Bump**: Version updated to 4. Automatic migration safely seeds property defaults (`property: 'shack'`, `propertiesOwned: ['shack']`), merits, and forums without resetting player progress.
- **Save Migration Suite (`scratch/test_save_migrations.js`)**: 24 dedicated test assertions verifying seamless migrations from v1, v2, and v3 saves to v4, plus repair safety. 100% pass rate.
- **Zero Syntax Errors**: All 72 JavaScript source files validated via Node VM compilation.

### 6. Final Browser QA & Responsive Viewport Polish
- **Real Google Chrome Headless QA (`scratch/browser_qa.js`)**: 130 browser assertions executed via native Chrome DevTools Protocol over WebSockets. Verified all 36 screens, character creation DOM lifecycle, real estate property purchases, forum dispatches, merit upgrades, all 13 crime families, tool edge cases, and localStorage reload retention with zero console errors or exceptions.
- **Mobile Responsive Layout**: Added `@media (max-width: 600px)` rules to `css/caligo.css` preventing horizontal overflow on 375px mobile viewports (condensed sticky header, hidden decorative sub-brand and status chips, clipped cloud skyline banners, and fluid boot screen container).
- **Crimes UI Target Inspect**: Allowed scoping and inspecting targets for any unlocked crime regardless of current nerve level; execution buttons dynamically indicate tool prerequisites, nerve required, or execute actions with exact cost feedback.
- **0-Nerve Falsy Ternary Fix**: Fixed JavaScript falsy bug on 0-cost crime actions (`target.nerveCost !== undefined`), ensuring scouting/inquiry actions remain free.
- **Property Happiness Synchronization**: Synchronized `player.maxHappiness` within `A.buyProperty` and `A.moveProperty`.
- **Item Metadata Alignment**: Aligned `high_drive` item metadata in `items.js` with `enhancerFor: 'bootlegging'`.
