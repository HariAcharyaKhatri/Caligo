# CALIGO × TORN CITY — MASTER FEATURE-COVERAGE AUDIT
**Audit Date:** 2026-10-27  
**Auditor:** Antigravity AI Engine  
**Target Codebase:** `d:\HARI KHATRI\Caligo`  
**Reference Document:** Torn City Consolidated Master Research Report (Batches 1–9, Version 3.0)  
**Save Version Compatibility:** v3 (with forward compatibility)

---

## 1. AUDIT METHODOLOGY & CLASSIFICATION CRITERIA

Each gameplay subsystem evaluated below is analyzed across five dimensions:
1. **Coverage Status:**
   - `FULLY IMPLEMENTED`: Exists in Caligo with equivalent depth, working mechanics, UI, and test coverage.
   - `PARTIALLY IMPLEMENTED`: Exists in Caligo with core functionality but lacks specific depths, formulas, sub-variants, or UI links.
   - `MISSING`: Present in Torn research but completely absent in Caligo codebase.
   - `CONFLICTING`: Caligo's design intentionally differs from Torn due to lore/single-player client-side mechanics.
   - `ARCHITECTURALLY DIFFERENT`: Handled via procedural local engines (e.g. 40 local NPC bots vs online MMO server).
2. **Research Evidence Tier:**
   - `[VERIFIED]`: Confirmed by official Torn wiki, developer announcements, or OpenAPI schemas.
   - `[COMMUNITY-REPORTED]`: Observed through community testing, player spreadsheets, or third-party tools (e.g. Torn Stats).
   - `[APPROXIMATE]`: Estimated empirically or bounded by ranges.
   - `[HISTORICAL]`: Previous mechanics deprecated or altered in recent patches.
   - `[UNVERIFIED / BLOCKED]`: Data missing or blocked by API limits.
3. **Exact Codebase Location:** Specific filenames and functions in `d:\HARI KHATRI\Caligo\`.
4. **Preservation Guarantee:** Exact measures taken to ensure existing Caligo lore, mechanics, and saves remain intact.
5. **Resolution / Integration Plan:** Actionable roadmap for upgrading without breaking regression tests.

---

## 2. COMPREHENSIVE 21-SYSTEM AUDIT MATRIX

| System ID | Subsystem Name | Coverage Status | Research Evidence | Caligo Codebase Location | Preservation & Caligo Flavor | Planned Resolution |
|---|---|---|---|---|---|---|
| **SYS-001** | Account & Identity | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/state.js`, `js/ui/sidebar.js`, `js/ui/screens/settings.js` | Caligo vertical city citizen identity, custom avatars, level/xp scaling | Maintain Caligo persona; integrate Merits spending button |
| **SYS-002** | Energy & Ticks | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/config.js` (`cfg.REGEN.energy`), `js/engine.js`, `js/state.js` | Standard 5 energy per tick cycle; max cap scales with level | Keep client-side engine tick; add merit bonus to energy refill |
| **SYS-003** | Nerve & Crime Exp | **PARTIALLY IMPLEMENTED** | `[VERIFIED]` | `js/config.js` (`cfg.HIDDEN_NERVE`), `js/state.js` (`S.calcMaxNerve`), `js/actions.js` | Hidden Crime Experience drives Natural Nerve Bar (NNB) tiers | Integrate explicit Merit +Nerve and Crimes 2.0 CE gains |
| **SYS-004** | Happiness & Living | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/config.js` (`cfg.REGEN.happiness`), `js/ui/screens/properties.js` | Caligo vertical city districts (Docks -> Spire Penthouses) cap happiness | Keep property tier happiness caps; add merit happiness perks |
| **SYS-005** | Life & Hospital | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/config.js` (`cfg.REGEN.life`), `js/actions.js`, `js/ui/screens/hospital.js` | City clinics, medical supplies (Bandages, First Aid, Morphine) | Retain Caligo clinics; add Education medical effectiveness |
| **SYS-006** | Gym & Battle Stats | **FULLY IMPLEMENTED** | `[VERIFIED]` / `[COMMUNITY]` | `js/config.js` (`cfg.GYM`), `js/actions.js` (`A.train`), `js/ui/screens/gym.js` | 5 stats (Strength, Defense, Speed, Dexterity, Intelligence) | Keep Intelligence (Caligo feature); adopt official stat weights |
| **SYS-007** | Crimes 2.0 (13 Families) | **PARTIALLY IMPLEMENTED** | `[VERIFIED]` | `js/data/crimes.js`, `js/actions.js` (`A.commitCrime`), `js/ui/screens/crimes.js` | Caligo currently has 13 linear crimes | Expand with Crime Enhancers, sub-targets, and Unique Outcomes |
| **SYS-008** | Missions & Contracts | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/missions.js`, `js/actions/missions.js`, `js/ui/screens/missions.js` | Duke-equivalent "The Handler" contracts + Story Missions | Maintain 3 active daily missions + story progression |
| **SYS-009** | Combat & Armor Formula | **PARTIALLY IMPLEMENTED** | `[VERIFIED]` | `js/actions/combat.js`, `js/data/targets.js`, `js/ui/screens/combat.js` | Turn-based moves (Strike, Heavy, Block, Dodge, Disarm, Escape) | Adopt official armor mitigation `D*(1 - A/100)` and crit calc |
| **SYS-010** | Items, Weapons & Armor | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/items.js`, `js/actions.js`, `js/ui/screens/armoury.js` | Equipment slots: Primary, Secondary, Melee, Head, Body, Legs | Add official crime enhancers (Flashlight, Razor, Drive, etc.) |
| **SYS-011** | Jobs & Companies | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/jobs.js`, `js/data/companies.js`, `js/actions/jobs.js`, `js/actions/companies.js` | 6 city starter jobs + 6 player-run companies with employee bots | Preserve Caligo company management and shift mechanics |
| **SYS-012** | Education (12 Tracks) | **PARTIALLY IMPLEMENTED** | `[VERIFIED]` | `js/data/education.js`, `js/actions/education.js`, `js/ui/screens/education.js` | 10 tracks in Caligo with prerequisite trees | Align tracks with 12 Torn tracks; apply mathematical passives |
| **SYS-013** | Economy & Banking | **PARTIALLY IMPLEMENTED** | `[VERIFIED]` | `js/data/tradeGoods.js`, `js/actions/economy.js`, `js/ui/screens/bank.js` | Caligo Bank (Savings, Fixed Notes, Loans) + Stock Ticker | Implement official 5% market sales tax + Merits APR boost |
| **SYS-014** | Travel & Smuggling | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/travel.js`, `js/data/tradeGoods.js`, `js/ui/screens/travel.js` | 5 vertical city platforms + 8 international cities | Keep vertical city platforms; enforce Level 15 international travel |
| **SYS-015** | Factions & Warfare | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/factions.js`, `js/data/territories.js`, `js/actions/factions.js` | 6 Caligo syndicates (Ironhides, Ledger, Vermilion, etc.) | Retain syndicate lore; add 8 branch upgrade progression |
| **SYS-016** | Casino & Mini-games | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/data/casino.js`, `js/actions/casino.js`, `js/ui/screens/casino.js` | Slots, Roulette, Blackjack with daily token rewards | Preserved completely with procedural Web Audio synthesis |
| **SYS-017** | Social, Mail & Events | **FULLY IMPLEMENTED** | `[VERIFIED]` | `js/ui/screens/mail.js`, `events.js`, `lists.js`, `forums.js`, `newspaper.js` | In-game simulated forums, city newspaper, bot mail | Preserved completely |
| **SYS-021** | Merits Upgrade System | **MISSING (SCREEN/LOGIC)** | `[VERIFIED]` | `js/ui/sidebar.js` (placeholder modal), `state.js` (counter only) | Merits accumulated but unusable | Implement full Merits Screen, 11 upgrade categories, reset logic |

---

## 3. DEEP GAP ANALYSIS & ACTION PLAN

### Gap 1: Merits Allocation System (SYS-021)
- **Current State:** `save.player.merits` tracks earned merit points, but clicking `[use]` on the sidebar renders a static placeholder alert: *"Available in Phase 4 update"*.
- **Torn Benchmark:** 11 categories:
  1. Sharpness (Speed bonus: +1% per level, max 10)
  2. Brawn (Strength bonus: +1% per level, max 10)
  3. Protection (Defense bonus: +1% per level, max 10)
  4. Evasion (Dexterity bonus: +1% per level, max 10)
  5. Critical Hit Rate (+1% crit chance per level, max 10)
  6. Nerve Bar (+1 max natural nerve per level, max 10)
  7. Crime Experience (+3% CE per level, max 10)
  8. Education Time (-2% duration per level, max 10)
  9. Bank Interest (+5% APR per level, max 10)
  10. Masterful Looting (+5% mug cash per level, max 10)
  11. Fortitude (+3% max life per level, max 10)
- **Resolution:**
  - Create `js/ui/screens/merits.js`.
  - Add `A.upgradeMerit(meritKey)` and `A.resetMerits()` in `js/actions.js`.
  - Wire `save.player.meritUpgrades = { sharpness: 0, ... }`.
  - Wire modifiers into `S.calcMaxNerve`, `S.calcMaxLife`, `S.playerPower`, `combat.js`, and `economy.js`.

### Gap 2: Crime Enhancers & Subcrimes Depth (SYS-007)
- **Current State:** 13 linear crimes in `js/data/crimes.js`. Each crime has a single fixed chance and cash reward.
- **Torn Benchmark:** Crimes 2.0 has specific tool enhancers (Flashlight, Razor, Drive, Duct Tape, Mountain Bike, Lighter) granting flat success bonuses, plus multi-location Burglary (Residential, Commercial, Industrial) and Unique Item Outcomes.
- **Resolution:**
  - Add Crime Enhancer items to `js/data/items.js` and shops/loot.
  - In `A.commitCrime`, detect if the required/optimal enhancer is in inventory and apply +10% bonus chance with custom flavour text.
  - Add Unique Outcomes table rewarding rare loot on critical success rolls.

### Gap 3: Market 5% Sales Tax & Trade Fees (SYS-013)
- **Current State:** Player and bot listings on `market.js` charge 0% commission.
- **Torn Benchmark:** 5% sales tax on market listings (verified 22 June 2025).
- **Resolution:**
  - In `A.buyMarketListing`, deduce 5% sales tax from seller proceeds, depositing 95% to seller and displaying transparent tax breakdown in UI.

### Gap 4: Combat Armor Mitigation & Hit Formulas (SYS-009)
- **Current State:** Soft defense curve `1 - def / (def + 800)`.
- **Torn Benchmark:** Armor percentage mitigation formula $D(A) = D(I) \times (1 - A/100)$.
- **Resolution:**
  - Update `playerAttack` and `botTurn` in `js/actions/combat.js` to incorporate equipped armor mitigation factor directly.
  - Factor Dexterity vs Speed and Critical Hit Rate merits into combat resolution.

---

## 4. PRESERVATION MANDATE
All existing Caligo features are strictly maintained:
1. Intelligence stat remains an active battle and hacking stat.
2. Vertical City platforms (Docks, Underbelly, Hollows, Exchange, Spire) remain the primary setting.
3. 40 autonomous NPC bots, item drift engine, and procedural Web Audio SFX remain 100% intact.
4. All existing unit tests (19 test suites) must pass without errors.
