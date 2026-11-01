# CALIGO × TORN CITY — RESEARCH IMPLEMENTATION MATRIX
**Version:** 8.0 (Final Browser QA, Regression Audit & Release Readiness)  
**Date:** 2026-10-27  
**Auditor / Implementer:** Lead Game Architect, Gameplay Systems Engineer & QA  
**Reference Document:** Torn City Consolidated Master Research Report (Batches 1–9, Version 3.0)  
**Release Verdict:** **RELEASE READY** (100% Automated Test Pass, 100% Real Browser QA Pass)  
**Status Legend:**
- `MATCHES_RESEARCH`: Current implementation matches research specification exactly.
- `MISMATCH_FOUND`: Code contradicts verified research rule or value.
- `MISSING`: Researched feature is entirely absent from the codebase.
- `PARTIAL`: Core idea present but missing actions, targets, subcrimes, or outcomes.
- `PLACEHOLDER`: Visual mockup or modal alert only; no underlying logic or state.
- `FIXED_AND_TESTED`: Identified mismatch or gap resolved and covered by automated tests.
- `CALIGO_SPECIFIC`: Intentional design difference preserving Caligo identity/lore.
- `BLOCKED_BY_RESEARCH`: Underlying data unavailable or conflicting in research.

---

## 1. CRIMES 2.0 (13 CRIME FAMILIES) DEEP VERIFICATION & PROOF

| Family # | Crime Family Name | Research Base Nerve | Documented Structure / Targets | Enhancer | Research Status | Implementation Status | Exact Verified Mechanics & Tests |
|---|---|---|---|---|---|---|---|
| **1** | **Search for Cash** | 2 | 6 subcrimes (Trash, Subway, Junkyard, Beach, Cemetery, Fountain); 34 unique outcomes | Glasses | `[VERIFIED]` | `FIXED_AND_TESTED` | All 6 subcrimes implemented in `D.searchCashSubcrimes`; exact 2 Nerve deduction verified in Test Suites 23 & 27; Reading Glasses enhancer (+10% odds) verified. |
| **2** | **Bootlegging** | 2 / 5 | Copy DVDs (2 nerve), Sell DVDs (5 nerve), Online Store (CS 50) | High-Speed Drive | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.bootlegActions` defines Copy (2N, produces `dvd`) & Sell (5N, consumes `dvd`, requires `dvd` in inventory); High-Speed Drive enhancer (+10%); verified in Test Suite 27. |
| **3** | **Graffiti** | 3 | 7 districts (East, West, North, Residential, Red-Light, Financial, City Centre) | Paint Mask | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.graffitiDistricts` defines all 7 districts; 3 Nerve deduction verified; requires `spray_can` in inventory (enforced in `A.attemptCrime`); Paint Mask enhancer (+10%); verified in Test Suite 27. |
| **4** | **Shoplifting** | 4 | 8 shops (Sally's, Bits 'n' Bobs, TC Clothing, Supermarket, Pharmacy, Jewellery, Bookshop, Electronics Depot) | Mountain Bike | `[VERIFIED]` | `FIXED_AND_TESTED` | Base nerve corrected to 4; `D.shopliftShops` defines all 8 shops with store-specific loot drops (candy, lockpicks, jackets, coffee, morphine, jewelry, blueprints, burner phones); Mountain Bike enhancer (+10%); verified in Test Suite 27. |
| **5** | **Card Skimming** | 6 / 2 | Install on ATM (6N), Harvest Data (2N), Sell Dump Batch (6N) | Reinforced Duct Tape | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.cardSkimmingTargets` defines 5 ATM operations; 6 Nerve Install & 2 Nerve Harvest verified; enforces `skimmer` tool in luggage for install; Duct Tape enhancer (+10%); verified in Test Suite 27. |
| **6** | **Burglary** | 3 / 2 / 6 / 9 | Scout (3n), Case (2n), Burglarize (6n), Focused Scout (9n); 34 locations | Heavy Flashlight | `[VERIFIED]` | `FIXED_AND_TESTED` | All 34 locations across Residential (12), Commercial (11), Industrial (11) in `D.burglaryLocations`; tool requirements enforced (`lockpick_set`, `jemmy`, `window_breaker`, `skeleton_key`, `rope`, `credit_card`); 6N deduction verified in Test Suites 24 & 27; Flashlight enhancer (+10%). |
| **7** | **Pickpocketing** | 5 | 22 targets with situational conditions (Walking, Cycling, Loitering, Music, Phone, Stumbling, Distracted, Soliciting, Any) | Cut-Throat Razor | `[COMPLETE]` | `FIXED_AND_TESTED` | **Base nerve verified at 5** (corrected from 1); all 22 targets present in `D.pickpocketTargets`; Cut-Throat Razor enhancer (+10%); exact 5 Nerve deduction verified in Test Suites 23, 24 & 27. |
| **8** | **Hustling** | 4 | Gather Crowd (4N), Three-Card Monte (4N), Shell Game (4N), Street Dice (4N), Find The Lady (4N) | Megaphone | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.hustlingGames` defines all 5 street games; 4 Nerve deduction verified; Megaphone enhancer (+10%); verified in Test Suite 27. |
| **9** | **Disposal** | 6–14 | 12 jobs (Appliance, Bio Waste, Body Part, Debris, Body, Docs, Guns, General, Industrial, Weapon, Furniture, Vehicle); 5 methods | Latex Gloves | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.disposalJobs` (12 jobs) and `D.disposalMethods` (Abandon 6N, Bury 8N [requires `shovel`], Burn 10N [consumes `gas_can`], Sink 12N, Dissolve 14N [consumes `acid`]); Latex Gloves enhancer (+10%); verified in Test Suites 23 & 27. |
| **10** | **Cracking** | 7 / 5 | Brute-force Hash (7N), Crack Encryption Vault (5N) | Office Chair | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.crackingActions` defines both vectors; 7N and 5N deductions verified; Ergonomic Office Chair enhancer (+10%); verified in Test Suite 27. |
| **11** | **Forgery** | 5 | 5 High-Value Document Projects (Driver's License, Customs Manifest, Transit Pass, Diplomatic Passport, Bearer Bond) | Magnifying Glass | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.forgeryProjects` defines project types; 5N deduction verified; Jeweler Magnifying Glass enhancer (+10%); verified in Test Suite 27. |
| **12** | **Scamming** | 8 / 8 / 3 | Farm Leads (8N), Phishing Spam (8N), Converse with Mark (3N) | Ergonomic Keyboard | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.scammingActions` defines all 3 phases; 8N and 3N deductions verified; Split Ergonomic Keyboard enhancer (+10%); verified in Test Suite 27. |
| **13** | **Arson** | 0/3/5/5/5/5/2 | 7-step sequence: Inquire (0N), Breach (3N), Place Fuel (5N), Ignite (5N), Stoke (5N), Dampen (5N), Collect (2N) | Windproof Lighter | `[VERIFIED]` | `FIXED_AND_TESTED` | `D.arsonStages` defines all 7 steps; 0N Inquiry verified; 5N Place Fuel verified with `gas_can` consumption (exactly 1 can consumed); 2N Collect verified; Windproof Lighter enhancer (+10%); verified in Test Suite 27. |

---

## 2. RESOURCE & STATS SYSTEMS MATRIX

| System | Researched Rule / Formula | Evidence Tier | Caligo Implementation | Implementation Status | Resolution & Verification |
|---|---|---|---|---|---|
| **Energy Regen** | +5 / 15m (cap 100); donator +5 / 10m (cap 150) | `[VERIFIED]` | Second-based tick engine with offline catch-up up to 8 hours | `MATCHES_RESEARCH` (adapted) | Caligo level-scaling energy cap preserved; verified in Test Suite 2. |
| **Nerve & NNB** | +1 / 5m; NNB +5 per CE threshold | `[VERIFIED]` | `cfg.HIDDEN_NERVE` step 5; `S.maxNerve` | `MATCHES_RESEARCH` | Factored `meritUpgrades.nerve_bar` into `S.maxNerve`; verified in Test Suite 20. |
| **Happiness Caps** | Shack 100 up to ~5,025 for Private Island | `[VERIFIED]` | Active property lookup: `D.propertyById[p.property].happyCap` | `FIXED_AND_TESTED` | Full 14-tier property ownership, real estate purchases, moving, and resale with 75% refund; verified in Test Suite 25. |
| **Battle Stats** | Strength, Defense, Speed, Dexterity | `[VERIFIED]` | 5 stats (Str, Def, Spd, Dex, Intelligence) | `CALIGO_SPECIFIC` | Preserved Intelligence as Caligo's signature stat; factored 4 core stats into combat engine; verified in Test Suite 5. |
| **Combat Armor** | $D(A) = D(I) \times (1 - A/100)$ | `[VERIFIED]` | Armor mitigation formula applied in `combat.js` | `FIXED_AND_TESTED` | Verified in combat simulation; test suite 5. |
| **Combat Criticals** | Base ~5% + Merits + Bio Anatomy | `[VERIFIED]` | `S.critChance` applied in `combat.js` | `FIXED_AND_TESTED` | Verified in combat simulation; test suite 5. |

---

## 3. ECONOMY, PROPERTIES & HOUSING MATRIX

| System | Researched Rule / Formula | Evidence Tier | Caligo Implementation | Implementation Status | Resolution & Verification |
|---|---|---|---|---|---|
| **Market Sales Tax** | 5% sales tax (since 22 June 2025) | `[VERIFIED]` | `cfg.MARKET.salesTax = 0.05` deducted on sale | `FIXED_AND_TESTED` | Verified in Test Suite 21. |
| **Banking APR** | 7d/30d/90d notes + savings APR | `[VERIFIED]` | 3 note tiers + savings + Merit APR (+5%/tier) | `FIXED_AND_TESTED` | Verified in Test Suite 6. |
| **Properties** | 14 tiers (Shack to Private Island), happiness caps 100 -> 5,025 | `[VERIFIED]` | `js/data/properties.js`, `A.buyProperty`, `A.moveProperty`, `A.sellProperty` | `FIXED_AND_TESTED` | Replaced placeholder modal with full interactive UI and state persistence; verified in Test Suite 25. |

---

## 4. COMMUNITY & SOCIAL SYSTEMS

| System | Researched Rule / Description | Evidence Tier | Caligo Implementation | Implementation Status | Resolution & Verification |
|---|---|---|---|---|---|
| **Community Forums** | Category boards, dispatches, thread posting & replies | `[VERIFIED]` | `js/ui/screens/forums.js`, `save.forums` | `FIXED_AND_TESTED` | Replaced static toast placeholder with interactive board navigation, OP viewing, player thread publishing, and reply submissions; verified in Test Suite 26. |
| **Social Lists** | Friends, Enemies, Target lists | `[VERIFIED]` | `save.lists.friends`, `save.lists.enemies`, `save.lists.targets` | `MATCHES_RESEARCH` | Verified in Test Suite 18. |
| **Mail & Events** | Personal inbox, system alerts, combat logs | `[VERIFIED]` | `save.mail`, `save.events` | `MATCHES_RESEARCH` | Verified in Test Suite 18. |

---

## 5. AUTOMATED TEST SUITE & BROWSER QA SUMMARY

- **Automated Test Runners Executed:**
  - `scratch/browser_qa.js`: **130 of 130 Browser Assertions Passed (100%)** via Google Chrome Headless over Chrome DevTools Protocol (CDP).
  - `scratch/simulate.js`: **27 of 27 Full Game E2E Suites Passed (100%)**.
  - `scratch/test_13_families.js`: **56 of 56 Crimes 2.0 Family Assertions Passed (100%)**.
  - `scratch/test_save_migrations.js`: **24 of 24 Save Migration Assertions Passed (100%)**.
- **Syntax Validation:** 100% (all 72 JavaScript source files cleanly validated via Node VM compiler)
- **Real Browser Verification:**
  - Initial screen renders without blank pages or uncaught exceptions.
  - Character creation flow completed through DOM interaction.
  - All 36 screen controllers mount active DOM nodes.
  - Responsive viewports verified: Desktop (1280×800) and Mobile (375×667 without horizontal scrollbar).
  - Browser LocalStorage save, reload, and state recovery fully verified.
- **Key Regressions Prevented:**
  - Zero loss of Caligo's 40 NPC bots or automated market generation.
  - Zero loss of Intelligence stat or Web Audio synthesizer.
  - Zero loss of 36 screens or vertical city lore.
  - Backwards-compatible save migrations for versions 1, 2, 3, and 4.
