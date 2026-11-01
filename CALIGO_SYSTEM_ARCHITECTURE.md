# CALIGO — SYSTEM ARCHITECTURE SPECIFICATION
**Version:** 4.0 (Deep Integration Edition)  
**Date:** 2026-10-27  
**Scope:** Client-Side Single-Page Vertical City RPG  
**Target Architecture:** Vanilla ES5/ES6 JavaScript (No Build Step, No Node.js Dependencies in Browser)

---

## 1. HIGH-LEVEL ARCHITECTURAL TOPOLOGY

Caligo is structured as a modular, event-driven client-side application executing completely within the browser sandbox with zero external server dependencies:

```mermaid
flowchart TD
    subgraph UI_Layer [Presentation & UI Layer]
        Router[Router #/hash]
        Sidebar[Sidebar HUD & Stats]
        Screens[35+ Screen Renderers]
        Audio[Web Audio Synthesizer]
        Toast[Notification & Toast System]
    end

    subgraph Action_Layer [Action & Controller Layer]
        ActionsCore[actions.js - Core Actions]
        CombatAction[actions/combat.js - Turn Combat]
        EconomyAction[actions/economy.js - Bank & Market]
        CrimeAction[actions.js - Crimes 2.0 Engine]
        JobAction[actions/jobs.js - Career & Shifts]
        EduAction[actions/education.js - Education]
        FacAction[actions/factions.js - Syndicates & Wars]
        MeritAction[actions.js - Merits Engine]
    end

    subgraph State_Layer [State & Persistence Layer]
        State[state.js - Reactive State & Getters]
        Storage[storage.js - localStorage & Migrations]
        Engine[engine.js - Game Loop & Tick Generator]
        Bots[bots.js - 40 NPC Autonomous Population]
    end

    subgraph Data_Layer [Static Game Data Tables]
        DataItems[data/items.js]
        DataCrimes[data/crimes.js]
        DataWorld[data/world.js & travel.js]
        DataFactions[data/factions.js & territories.js]
        DataEducation[data/education.js]
        DataJobs[data/jobs.js & companies.js]
        DataCasino[data/casino.js & missions.js]
    end

    Router --> Screens
    Screens --> ActionsCore & CombatAction & EconomyAction & MeritAction
    ActionsCore & CombatAction & EconomyAction & MeritAction --> State
    State --> Storage
    Engine --> State
    Engine --> Bots
    State --> Sidebar
    ActionsCore --> Audio
```

---

## 2. MODIFIER CASCADE & DERIVED STATS FLOW

Caligo's stat progression implements an un-bounded modifier stack derived from Base Stats, Equipment, Merits, Education, and Faction Perks:

```mermaid
flowchart LR
    BaseStats[Base Player Stats] --> ModStack[Modifier Cascade]
    Merits[Merit Upgrades] --> ModStack
    Edu[Completed Courses] --> ModStack
    Equip[Equipped Weapons/Armor] --> ModStack
    Faction[Faction Syndicate Perks] --> ModStack

    ModStack --> FinalStrength[Effective Strength]
    ModStack --> FinalDefense[Effective Defense]
    ModStack --> FinalSpeed[Effective Speed]
    ModStack --> FinalDexterity[Effective Dexterity]
    ModStack --> FinalMaxNerve[Natural Nerve Bar NNB]
    ModStack --> FinalMaxLife[Max Health]
    ModStack --> FinalCrit[Critical Strike Chance]
    ModStack --> FinalMitigation[Armor Mitigation %]
```

### Mathematical Specifications:

1. **Natural Nerve Bar (NNB):**
   $$\text{Max Nerve} = \text{Base Nerve} (15) + \lfloor\text{Level} / 2\rfloor + \text{HiddenTier}(\text{CE}) + \text{Merit}(\text{nerve\_bar})$$

2. **Official Armor Damage Mitigation:**
   $$D_{\text{mitigated}} = D_{\text{incoming}} \times \left(1 - \frac{\text{Armor Rating}}{100}\right)$$
   Where total armor rating is the sum of equipped Head, Body, and Leg defenses.

3. **Hit Probability (Speed vs Dexterity):**
   $$P(\text{hit}) = \text{clamp}\left(0.50 + \frac{\text{Speed}_{\text{attacker}} - \text{Dexterity}_{\text{defender}}}{\text{Speed}_{\text{attacker}} + \text{Dexterity}_{\text{defender}} + 100} + \text{Modifier}_{\text{move}}, 0.10, 0.95\right)$$

4. **Market Sales Tax:**
   $$\text{Seller Net Payout} = \text{Listing Price} \times 0.95$$
   A 5% sales tax is collected by the City Treasury, preserving economic balance.

---

## 3. CRIMES 2.0 SUBSYSTEM DESIGN

Crimes 2.0 integrates three layers of depth over standard RNG rolls:

```mermaid
flowchart TD
    TriggerCrime[Player Triggers Crime] --> CheckReq[Check Level, Nerve, Tools]
    CheckReq --> EnhancerCheck[Scan Inventory for Crime Enhancers]
    EnhancerCheck --> CalcSuccess[Compute Base + Skill + Enhancer Bonus]
    CalcSuccess --> RollRNG{Random 0.0 - 1.0}
    RollRNG -- Critical Success (<0.08) --> UniqueOutcome[Award Unique Outcome & Rare Loot]
    RollRNG -- Normal Success --> StandardReward[Award Cash + CE + Respect]
    RollRNG -- Fail (Normal) --> JailCheck[Arrest / Jail Time + Fine]
    RollRNG -- Critical Fail --> HospitalInjured[Hospitalized / Heavy Loss]
    StandardReward & UniqueOutcome --> AdvanceCE[Increment Hidden CE & Check NNB Promotion]
```

### Enhancer Item Mapping:
- **Burglary:** Flashlight (+10% success, avoids detection)
- **Pickpocketing:** Cut-Throat Razor (+10% success)
- **Hacking / Cybercrime:** High-Speed Drive / Laptop (+12% success)
- **Card Skimming:** Duct Tape (+8% success)
- **Shoplifting:** Mountain Bike (+10% quick getaway)
- **Arson:** Windproof Lighter (+10% success)

---

## 4. PERSISTENCE & SAVE MIGRATION ARCHITECTURE

The local storage payload is managed by `js/storage.js` with version-gated migration transforms:

- **v1:** Initial prototype state (Phase 1).
- **v2:** Added 40 NPC bots, stock market, travel platforms (Phase 2).
- **v3:** Added Torn-style sidebar, jobs, education, companies, factions, casino, missions (Phase 3).
- **v4 (Current):** Added Merits Allocation System (`meritUpgrades`), Crimes 2.0 Enhancers & Unique Loot tables, Market 5% Sales Tax, and official combat formulas.

Each migration is idempotent and non-destructive: existing attributes are preserved while new structures are initialized with defaults.
