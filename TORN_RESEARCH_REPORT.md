<USER_REQUEST>
@[d:\HARI KHATRI\Caligo] # TORN CITY — CONSOLIDATED MASTER RESEARCH REPORT
## (Batches 1–9 ka Complete Compilation)

**Report Version:** 3.0 (Consolidated)  
**Date:** 2026-10-27  
**Status:** Stage A — In Progress (API parse blocked; items partial)  
**Total Batches Completed:** 9

---

## 1. EXECUTIVE SUMMARY

Torn City ek persistent, text-based, crime-themed browser MMORPG hai jo 2004 se chal raha hai. Iska core design **multi-resource, multi-track progression** par based hai:

- **Energy** → Gym training, combat, hunting, reviving
- **Nerve** → Crimes, busting, organized crimes
- **Happiness** → Gym gain multiplier, crime success
- **Life** → Combat survival, hospital time

Progression effectively **unbounded** hai — battle stats exponentially grow hote hain, Crime Experience (CE) hidden hai aur Natural Nerve Bar (NNB) ko badhata hai, aur education/factions/companies/properties/merits sab permanent modifiers dete hain.

**Key structural facts:**
- Crimes 2.0 mein **13 crime families** hain (Arson 13th, 30 Sept 2025 release)
- Har crime family ke apne nerve costs, subcrimes, enhancers, unique outcomes hain
- Item Market par **5% sales tax** (22 June 2025 se) + **10% anonymous fee**
- Travel level 15 par unlock; weapons/armor flights par allowed (21 Oct 2026 se)
- API v2 **read-only** hai, sirf GET endpoints

---

## 2. MASTER SYSTEM INDEX

| ID | System | Status | Key Facts |
|---|---|---|---|
| SYS-001 | Account & Identity | Partial | Level, rank, awards, merits |
| SYS-002 | Energy | Complete | +5/15min (cap 100); donator +5/10min (cap 150) |
| SYS-003 | Nerve | Complete | +1/5min; NNB +5 per CE threshold |
| SYS-004 | Happiness | Complete | +5/15min; property cap ~5,025 |
| SYS-005 | Life & Hospital | Partial | Combat loss; medical items restore |
| SYS-006 | Gym & Battle Stats | Substantially Complete | 4 stats; official weights verified |
| SYS-007 | Crimes 2.0 (13 families) | Substantially Complete | Full catalogues below |
| SYS-008 | Missions (Duke) | Substantially Complete | 3 active, 5 with 3★ Logistics |
| SYS-009 | Combat | Substantially Complete | Armor formula verified |
| SYS-010 | Items & Inventory | Partial | Enhancers complete; effects partial |
| SYS-011 | Jobs & Companies | Partial | Military career; company specials |
| SYS-012 | Education (12 tracks) | Complete | All totals and effects verified |
| SYS-013 | Economy & Finance | Substantially Complete | Market fees, bank, travel profit |
| SYS-014 | Travel | Substantially Complete | Destinations, variance ±3% |
| SYS-015 | Properties | Substantially Complete | Happy cap, upkeep |
| SYS-016 | Factions | Substantially Complete | 8 branches, per-upgrade rates |
| SYS-017 | Jail | Partial | Entry, duration, escape |
| SYS-018 | Merits & Awards | Substantially Complete | Core effects verified |
| SYS-019 | UI/UX | Not Researched | — |
| SYS-020 | API | Partial / BLOCKED | Metadata verified; full matrix blocked |
| SYS-021 | Backend Architecture | Proposed | Original game design only |

---

## 3. CRIMES 2.0 — COMPLETE FAMILY CATALOGUE

### 3.1 Master Crime Table (13 families)

| # | Crime Family | Category | Base Nerve | Subcrimes / Structure | Enhancer | Unique Outcomes | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Search for Cash** | Theft | 2 | Trash, Subway, Junkyard, Beach, Cemetery, Fountain | Glasses | **34** | VERIFIED |
| 2 | **Bootlegging** | Counterfeiting | 2/5 | Copy DVDs, Sell DVDs, Online Store (CS 50) | High-Speed Drive | Yes (skill-gated) | VERIFIED |
| 3 | **Graffiti** | Vandalism | 3 | East/West/North Side, Residential, Red-Light, Financial (crew), City Centre (crew) | Paint Mask | **41** (COMMUNITY) | VERIFIED (structure) |
| 4 | **Shoplifting** | Theft | 4 | 8 shops (Sally's, Bits 'n' Bobs, TC Clothing, etc.) | Mountain Bike | Per-shop | VERIFIED |
| 5 | **Card Skimming** | Fraud | 6 | Install (6), Sell (6), Recover | Duct Tape | **0** | VERIFIED |
| 6 | **Burglary** | Theft | 3/2/6/9 | Scout (3), Case (2), Burglarize (6), Focused Scout (9) | Flashlight | **34** | VERIFIED |
| 7 | **Pickpocketing** | Theft | 5 | No subcrimes; 22 targets | Cut-Throat Razor | **22** | COMPLETE |
| 8 | **Hustling** | Fraud | 4+ | Gather (4), Cornhole, Snail Racing, Find The Lady, Shell Game, Shill (CS 60), Pickpocket (CS 80) | Megaphone | **0** | VERIFIED |
| 9 | **Disposal** | Illicit Services | 6–14 | 12 job types; 5 methods | Latex Gloves | **11** | CONFLICTING (8 vs 12) |
| 10 | **Cracking** | Cybercrime | 5/7 | Brute-force (7), Crack (5); 26? targets | Office Chair | **0** (later revision) | VERIFIED |
| 11 | **Forgery** | Counterfeiting | 0 to start; 5/step | 12 project types; max 100 active | Magnifying Glass | **0** | VERIFIED |
| 12 | **Scamming** | Fraud | 8/3 | Farm (8), Spam (8), Converse (3/reply) | Ergonomic Keyboard | Unknown | VERIFIED (structure) |
| 13 | **Arson** | Vandalism | 0/3/5/5/5/2 | Inquire, Breach, Place, Ignite, Stoke, Dampen, Collect | Windproof Lighter | **16** | VERIFIED |

---

### 3.2 BURGLARY — 34/34 Locations (COMPLETE)

**Source:** Community `UNIQUE_CATALOG` + official wiki residential section

| # | Location | District | Skill Req. | Required Item | Unique Outcome | Status |
|---|---|---|---|---|---|---|
| 1 | **Apartment** | Residential | 14 | Credit Card | Personal Computer + High-Speed Drive + Blank DVDs | VERIFIED |
| 2 | **Beach Hut** | Residential | 1 | Jemmy | $127,000–399,200 cash | VERIFIED |
| 3 | **Bungalow** | Residential | 1 | Window Breaker | Soap on a Rope + Xanax + Vitamins + Toothbrush | VERIFIED |
| 4 | **Cottage** | Residential | 3(?) | Window Breaker | Jacket + Lawyer Business Card | VERIFIED |
| 5 | **Farmhouse** | Residential | 38 | Window Breaker | Turkey Baster + Bull Semen | VERIFIED |
| 6 | **Lake House** | Residential | 46 | Jemmy | 2× Box of Medical Supplies | VERIFIED |
| 7 | **Luxury Villa** | Residential | 69(?) | Window Breaker | Persian Rug | VERIFIED |
| 8 | **Manor House** | Residential | 100 | Lockpicks | Chandelier | VERIFIED |
| 9 | **Mobile Home** | Residential | 1 | Rope | Claymore Mine + Luger + WWII Helmet | VERIFIED |
| 10 | **Secluded Cabin** | Residential | 30 | Jemmy | Cuban Cigars + Windproof Lighter + Cigar Cutter | VERIFIED |
| 11 | **Suburban Home** | Residential | — | Window Breaker | Lottery Voucher | VERIFIED |
| 12 | **Tool Shed** | Residential | — | Lockpicks | Flashlight | VERIFIED |
| 13 | **Advertising Agency** | Commercial | 25+ | Skeleton Key | 2× Can of Damp Valley | VERIFIED |
| 14 | **Barbershop** | Commercial | 25+ | Lockpicks | $13,783–19,887 cash | VERIFIED |
| 15 | **Chiropractors** | Commercial | 25+ | Window Breaker | 3× Xanax | VERIFIED |
| 16 | **Cleaning Agency** | Commercial | 25+ | Jemmy | Tumble Dryer | VERIFIED |
| 17 | **Dentists Office** | Commercial | 25+ | Credit Card | Latex Gloves + 6× Gold Tooth | VERIFIED |
| 18 | **Funeral Directors** | Commercial | 25+ | Lockpicks | Empty Blood Bag + Bone Saw + Bone + Cassock | VERIFIED |
| 19 | **Liquor Store** | Commercial | 25+ | Skeleton Key | Six Pack of Alcohol | VERIFIED |
| 20 | **Market** | Commercial | 25+ | Jemmy | Fanny Pack | VERIFIED |
| 21 | **Postal Office** | Commercial | 25+ | Credit Card | Stamp Collection | VERIFIED |
| 22 | **Recruitment Agency** | Commercial | 25+ | Window Breaker | Jade Buddha + Bowling Trophy | VERIFIED |
| 23 | **Self-Storage Facility** | Commercial | 25+ | Skeleton Key | 4× Opium | VERIFIED |
| 24 | **Brewery** | Industrial | 50+ | Rope | Empty Box + 6× Bottle of Stinky Swamp Punch | VERIFIED |
| 25 | **Dockside Warehouse** | Industrial | 50+ | Lockpicks | Erotic DVD | VERIFIED |
| 26 | **Farm Storage Unit** | Industrial | 50+ | Jemmy | Cattle Prod | VERIFIED |
| 27 | **Fertilizer Plant** | Industrial | 50+ | Lockpicks | Truck Nuts | VERIFIED |
| 28 | **Foundry** | Industrial | 50+ | Jemmy | Yasukuni Sword | VERIFIED |
| 29 | **Old Factory** | Industrial | 50+ | Window Breaker | Empty Box + Small Explosive Device | VERIFIED |
| 30 | **Paper Mill** | Industrial | 50+ | Skeleton Key | $224,000 cash | VERIFIED |
| 31 | **Printing Works** | Industrial | 50+ | Window Breaker | Hot Foil Stamper | VERIFIED |
| 32 | **Shipyard** | Industrial | 50+ | Jemmy | Anchor | VERIFIED |
| 33 | **Slaughterhouse** | Industrial | 50+ | Credit Card | Bloody Apron | VERIFIED |
| 34 | **Truckyard** | Industrial | 50+ | Skeleton Key | Can of Munster | VERIFIED |

**Status:** COMPLETE (34/34). Skill requirements for 23 locations are district-level only (PARTIAL).

---

### 3.3 PICKPOCKETING — 22/22 Targets (COMPLETE)

**Source:** Official Pickpocketing wiki revision

| # | Target | Difficulty | Unique Condition | Unique Outcome |
|---|---|---|---|---|
| 1 | **Businessman** | Moderate | Any | Two Speed |
| 2 | **Businesswoman** | Moderate | Any | Glasses |
| 3 | **Classy Lady** | More difficult | Must be on phone | Pair of High Heels |
| 4 | **Cyclist** | More difficult | Cycling only | Mountain Bike (CTR needed) |
| 5 | **Drunk Man** | Easier | Any | Six Bottles of Beer (CTR needed) |
| 6 | **Drunk Woman** | Easier | Any | Two Bottles of Pumpkin Brew (CTR) |
| 7 | **Elderly Man** | Easier | Walking only | Bag of Tootsie Rolls (CTR) |
| 8 | **Elderly Woman** | Easier | Walking only | Opium |
| 9 | **Gang Member** | More difficult | Loitering only | Spray Can + Wire Cutters (CTR) |
| 10 | **Homeless Person** | Easier | Any | 4× Morphine + Soap on a Rope + 3× Bricks + Toothbrush |
| 11 | **Jogger** | Moderate | Walking only | Can of Crocozade (CTR) |
| 12 | **Junkie** | Easier | Stumbling only | Ecstasy + LSD + PCP + Speed |
| 13 | **Laborer** | Moderate | Walking only | Megaphone |
| 14 | **Mobster** | Very difficult | Walking only | $561,000–$772,000 (CTR) |
| 15 | **Police Officer** | Very difficult | Running only | Police Badge |
| 16 | **Postal Worker** | Moderate | Distracted only | Lottery Voucher |
| 17 | **Rich Kid** | More difficult | Listening to music only | Six Pack of Alcohol (CTR) |
| 18 | **Sex Worker** | More difficult | Soliciting only | Thong |
| 19 | **Student** | Moderate | Any | Laptop + Cannabis + Coin Purse + Cell Phone (CTR) |
| 20 | **Thug** | Moderate | Loitering, male only | PCP + Cut-Throat Razor + Billfold |
| 21 | **Young Man** | Less difficult | Any | Ketamine |
| 22 | **Young Woman** | Less difficult | Any | Ecstasy |

**Status:** COMPLETE (22/22)

---

### 3.4 SEARCH FOR CASH — 34 Unique Outcomes (COMPLETE)

**Source:** Official wiki rev 23496

| Subcrime | Count | Outcomes |
|---|---|---|
| **Search the Trash** | 2 | 4× Bag of Candy Kisses (L1); 10× Morphine (L25) |
| **Search the Subway** | 7 | Glasses (rush hour, L1); Empty Box + 10× Card Skimmer (L1, Lost & Found Key); Torn City Times + Zip Wallet (≤23% ridership); 3× Ecstasy + 2× LSD (rush hour, L30); Laptop (L50); 3× Vicodin + Xanax (≤23% ridership, L60); Lost & Found Office Key (L85) |
| **Search the Junkyard** | 7 | Mountain Bike (≤49% crushing, L5); Metal Detector (L30); 4× Black + 3× Red + 3× White Spray Can (≤75% crushing, L30); Kevlar Gloves (≥50% crushing, L40); Stash Box (≥75% crushing, L40); High-Speed Drive (≤23% crushing, L60); Cash $50,620–79,820 (50–75% crushing, L80) |
| **Search the Beach** | 9 | Fishing Rod + Trout (≥60% tide, L10); 6× Beer + 5× Sports Shades + 4× Proda Sunglasses + Blanket (≥60% tide, L10); 2× First Aid Kit (≥60% tide, L20); Cemetery Key (L50); Coconut Bra (≤40% tide, L50); Cork Hat (L50); Snorkel + Flippers + Wetsuit + Diving Gloves (≤40% tide, L66); Sextant (≥40% tide, L90); Silver Bead (≤40% tide, L95) |
| **Search the Cemetery** | 4 | 3× Speed (groundskeeping NOT active, L80); Golden Wreath (groundskeeping active, L80); WWII Helmet (groundskeeping NOT active, L90); Cash $100,884–197,978 (L100) |
| **Search the Fountain** | 5 | 4× Cannabis (L75); Lucky Quarter (L80); PCP (≥25% collections, L85); Spray Cans (L90); 2× Ecstasy (≥50% collections, L100) |
| **TOTAL** | **34** | **REPRODUCED** |

**Note:** Official wiki contains both “29” and “34” statements. The 34 is REPRODUCIBLE from the six subcrime tables. The 29 is HISTORICAL/STALE.

---

### 3.5 DISPOSAL — 12 Job Types (CONFLICTING)

**Source:** Official Disposal page

| # | Job Type | Methods | Consumable | Reward Range |
|---|---|---|---|---|
| 1 | **Broken Appliance** | Abandon, Bury, Sink, Dissolve | None | $3,000–6,500 |
| 2 | **Biological Waste** | Abandon, Bury, Burn, Sink | Disposable Mask | $24,200–30,800 |
| 3 | **Body Part** | Abandon, Bury, Burn, Sink, Dissolve | None | $56,100–86,300 |
| 4 | **Building Debris** | Abandon, Bury, Sink | Wheelbarrow | $7,000–13,000 |
| 5 | **Dead Body** | Abandon, Burn, Bury, Sink, Dissolve | None | $101,300–157,800 |
| 6 | **Documents** | Abandon, Bury, Sink, Dissolve | None | $6,500–12,340 |
| 7 | **Firearms** | Abandon, Bury, Sink, Dissolve | None | $31,900–44,300 |
| 8 | **General Waste** | Abandon, Bury, Burn, Sink, Dissolve | None | $1,000–3,000 |
| 9 | **Industrial Waste** | Abandon, Bury, Sink | None | $18,100–30,000 |
| 10 | **Murder Weapon** | Abandon, Bury, Sink, Dissolve | None | $30,300–39,400 |
| 11 | **Old Furniture** | Abandon, Bury, Burn, Sink, Dissolve | None | Not extracted |
| 12 | **Vehicle** | Abandon, Burn, Bury, Sink | None | Not extracted |

**Method Nerve Costs:**
- Abandon: 6 nerve
- Bury: 8 nerve (requires Shovel)
- Burn: 10 nerve (consumes Gas Can)
- Sink: 12 nerve
- Dissolve: 14 nerve (consumes Hydrochloric Acid)

**CONFLICTING:** Official page states both “eight known different potential types of jobs” AND “There are 12 different types of jobs” in the same article. The “eight” sentence is confirmed unchanged since page creation (21 Nov 2023). **Inference:** “eight” is stale prose; 12 is operationally correct. **Status:** CONFLICTING (not formally resolved).

---

### 3.6 CRACKING — Complete Mechanics

**Source:** Official Cracking wiki revision (19 Feb 2024)

| Field | Value | Status |
|---|---|---|
| **Actions** | Brute-force (7 nerve), Crack (5 nerve) | VERIFIED |
| **Targets** | “26?” potential types (official text uses question mark) | APPROXIMATE |
| **Jobs per day** | 7–23? (approximate) | APPROXIMATE |
| **Password length** | 4–10 characters | VERIFIED |
| **Encryption layers** | 1–9 | VERIFIED |
| **Incorrect guesses** | 3 before lockout | VERIFIED |
| **Rigs** | Default strength 1; additional chassis at skill 25, 50, 75 | VERIFIED |
| **Rig components** | CPU (70W, 30,000 MIPS), eCPU (30W, 25,000 MIPS), HPCPU (150W, 50,000 MIPS), Computer Fan, Water Cooling | VERIFIED |
| **Enhancer** | Office Chair | VERIFIED |
| **Unique outcomes** | **0** (later revision) | VERIFIED (current); earlier revision said 1 (HISTORICAL) |
| **Heat mechanics** | 50% heat blocks removal; 100% heat disables; natural decay 1%/60s | VERIFIED |

---

### 3.7 ARSON — Complete Action Sequence

**Source:** Official Arson wiki + community helpers

| Action | Nerve Cost | Notes |
|---|---|---|
| **Inquire** | 0 | Locks target |
| **Breach** | 3 | — |
| **Place** | 5 | Plant evidence |
| **Ignite** | 5 | — |
| **Stoke** | 5 | — |
| **Dampen** | 5 | (NOT Plant Evidence) |
| **Collect** | 2 | — |

- **Enhancer:** Windproof Lighter
- **Category:** Vandalism (not Fraud)
- **Unique outcomes:** 16
- **Rewards:** $600–160,000 (normal); $1,200–320,000 (unique)

---

## 4. EDUCATION — ALL 12 TRACKS (COMPLETE)

**Source:** Official Education wiki revision `oldid=2205`

### 4.1 Track Totals (VERIFIED)

| Track | Total Energy | Total Cost | Total Weeks |
|---|---|---|---|
| **Biology** | 235 | **$22,650** | **28 weeks** |
| **Business Management** | 270 | **$12,800** | **37 weeks** |
| **Combat Training** | 235 | **$29,950** | **26 weeks** |
| **Computer Science** | 245 | **$20,150** | **31 weeks** |
| **General Studies** | 240 | **$19,010** | **28 weeks** |
| **Health & Fitness** | 250 | **$16,450** | **23 weeks** |
| **History** | 200 | **$10,150** | **25 weeks** |
| **Law** | 355 | **$28,745** | **38 weeks** |
| **Mathematics** | 230 | **$14,080** | **35 weeks** |
| **Psychology** | 170 | **$12,180** | **24 weeks** |
| **Self Defence** | 245 | **$17,500** | **22 weeks** |
| **Sports Science** | 270 | **$18,830** | **29 weeks** |

### 4.2 Key Course Effects (VERIFIED)

| Track | Course | Code | Effect |
|---|---|---|---|
| **Biology** | Evolution | BIO2350 | +1% weapon damage |
| | Intermediate Biochemistry | BIO2360 | +10% medical effectiveness |
| | Fundamentals of Neurobiology | BIO2380 | +10% neck damage |
| | Forensic Science | BIO2400 | −25% opponent stealth |
| | Anatomy | BIO2410 | +5% crit chance |
| | Bachelor | BIO3420 | Equip life/stat boosters; unlock Pharmacy |
| **Combat Training** | Military Psychology | **CBT2790** | **+1% increased hit rate** (CORRECTED) |
| **Health & Fitness** | Intro to Sports Science | HAF2104 | +1% Dexterity |
| | Cardio | HAF2105 | +1% Speed |
| | Weight Training | HAF2106 | +1% Strength |
| | Advanced Weight Training | HAF2107 | +2% Strength |
| | Yoga | HAF2108 | +1% Dexterity |
| | Advanced Yoga | HAF2109 | +3% Speed |
| | **Bachelor** | **HAF3111** | **“50% decrease in chance of opponent running away”** (CORRECTED) |
| **Mathematics** | Discrete Mathematics | MTH2310 | +5% ammo conservation |
| | Bachelor | MTH3330 | **+30% ammo management** (CORRECTED) |
| **Psychology** | Cognition | PSY2640 | +1% Dexterity |
| | Advanced Cognition | PSY2650 | +2% Dexterity |
| | Advanced Cognition II | PSY2660 | +4% Dexterity |
| | Advanced Cognition III | PSY2670 | +8% Dexterity |
| | **Bachelor** | **PSY3690** | **+10% crime success** |
| **Self Defence** | Judo | DEF2710 | +1% Defense |
| | Kick Boxing | DEF2730 | +1% Defense |
| | Krav Maga | DEF2740 | +3% Defense |
| | Tae Kwon Do | DEF2750 | +2% Speed |
| | Muay Thai | DEF2760 | +3% Speed |
| | **Bachelor** | **DEF3770** | **+100% fist damage** |
| **Sports Science** | Sports Medicine | SPT2480 | +10% booster effectiveness |
| | Nutritional Science | SPT2490 | +2% Speed/Strength |
| | Analysis and Performance | SPT2500 | +2% Defense/Dexterity |
| | **Bachelor** | **SPT3510** | **+1% all gym gains** |
| **Computer Science** | Networking | CMT2540 | Access to hacking crimes |
| | Computer Security and Defense | CMT2610 | +10% hacking success |
| | Fundamentals of Computer Architecture | CMT2570 | −25% rig heat |
| **General Studies** | Survival Skills | GEN2120 | +15% hunting skill |
| **Law** | — | LAW2990 | Self-bust from jail |
| **Business Management** | Statistics | BUS2200 | +2% productivity |
| | Communication | BUS2300 | +5% employee effectiveness |
| | Corporate Strategy | BUS2600 | +7% employee effectiveness |
| | Bachelor | BUS3130 | +9% productivity, +12% employee effectiveness |

### 4.3 Resolved Contradictions

| Contradiction | Previous | Corrected | Evidence |
|---|---|---|---|
| **CBT2790** | “+1% passive Speed” vs “+1% hit rate” | **+1% increased hit rate** | Education wiki |
| **HAF3111** | “+25%” vs “−25%” escape speed | **“50% decrease in chance of opponent running away”** | Education wiki |
| **BIO2360 duplicate** | Two courses claimed BIO2360 | **BIO1340 = Introduction; BIO2360 = Intermediate** | Chinese wiki cross-reference |

---

## 5. FACTION PERKS — 8 BRANCHES (SUBSTANTIALLY COMPLETE)

**Source:** Torn Stats faction guide

| Branch | Main Effect | Per Upgrade | Max | Secondary/Tertiary Effects | Total Respect |
|---|---|---|---|---|---|
| **Toleration** | Reduce drug addiction **up to 50%** | **2%** | 25 | Overdose chance −30% (3%/upg); passive negatives −30% (3%/upg) | 254,884 |
| **Steadfast** | Gym gains: Speed/Str/Def/Dex **each up to 10%** | **1%** | 10 per stat | +5% extra on chosen stats | 553,744 |
| **Criminality** | Crime skill & exp **up to 25%** | **1%** | 25 | Jail time −30% (2%/upg); **max nerve +40** (1/upg); bust skill +50%; bust nerve cost −3 | 593,993 |
| **Fortitude** | Hospital time **−25%** | **1%** | 25 | Life regen +4%; revive cost **25 energy** (5/upg); med cooldown +12h; **medical effectiveness +30%** | 526,142 |
| **Aggression** | Speed & Strength **+20% passively** | **1%** | 20 | Accuracy +10%; outgoing hosp +25%; **all damage +10%** | 563,249 |
| **Suppression** | Defence & Dexterity **+20% passively** | **1%** | 20 | Runaway chance +30%; **max life +20%** | 500,004 |
| **Voracity** | **Booster cooldown +24h** | **1h** | 24 | Nerve from alcohol +50%; happy from candy +50%; energy from cans +50% | 275,581 |
| **Excursion** | **Travel capacity +10** | **1** | 10 | Travel fees −75%; **hunting income +30%**; rehab cost −20%; **Cayman interest multiplier +25%** | 320,921 |

### Additional Verified Perks

| Perk | Effect |
|---|---|
| **Salutary** | Reviving energy cost **25 vs. standard 75** |
| **Cumber** | Travel items **up to 10** overseas |
| **Adept** | Education time **−2.5% per grade** (max −12.5%) |
| **Hermetic** | Drug addiction gain **up to −50%** |

---

## 6. GYM, COMBAT, AND BATTLE STATS

### 6.1 Official Battle Stat Weights (VERIFIED)

**Speed vs 10,000,000 Dexterity:**
| Speed | Hit Chance |
|---|---|
| 156,250 | **0%** |
| 500,000 | 5.63% |
| 1,000,000 | 10.93% |
| 2,000,000 | 18.41% |
| 5,000,000 | 33.26% |
| 10,000,000 | **50.00%** |
| 20,000,000 | 66.74% |
| 50,000,000 | 81.59% |
| 100,000,000 | 89.07% |

**Defense vs 10,000,000 Strength:**
| Defense | Damage Mitigation |
|---|---|
| 312,500 | **0%** |
| 625,000 | 10.00% |
| 1,250,000 | 20.00% |
| 2,500,000 | 30.00% |
| 5,000,000 | 40.00% |
| 10,000,000 | **50.00%** |
| 20,000,000 | 63.14% |
| 50,000,000 | 80.49% |
| 100,000,000 | 93.63% |

### 6.2 Official Formulas (VERIFIED)

| Formula | Expression | Source |
|---|---|---|
| **Armor mitigation** | \(D(A) = D(I) \times (1 - A/100)\) | Official Armor page |
| **Weapon damage** | Linear multiplier; fists = 10, weapon 50 = 5× damage | Official Weapon Stat page |
| **Displayed accuracy** | \(50\% + \text{modifier}\) | Official |
| **Gym structure** | 10 bars per stat; Premier Fitness: $10 unlock, 5 energy/train, 45 trains to next | Official Gym page |

### 6.3 Community Formulas (NOT OFFICIAL)

| Formula | Expression | Status |
|---|---|---|
| **Gym gain (Vladar)** | \(dS = S_p \times (1/200000) \times G \times E \times \prod(1+P_i)\) | COMMUNITY-REPORTED |
| **Hit chance approximation** | \([(\text{accuracy}-50)/50 + 100\%] \times \min(\text{base hit}, \text{enemy dodge})\) | COMMUNITY-REPORTED |
| **Defense zero-damage** | Defense ≈ 14× opponent Strength can reduce damage to 0 | COMMUNITY-REPORTED |

---

## 7. ECONOMY AND FINANCE

### 7.1 Item Market (VERIFIED)

| Rule | Value | Since |
|---|---|---|
| **Sales tax** | **5%** | 22 June 2025 |
| **Anonymous listing fee** | **10%** | — |
| **Anonymous fee waiver** | 5★ Car Dealership / 5★ Property Broker | — |
| **Listing limit** | **None** (previously 250) | — |
| **Filter options** | Weapon type, bonus, price (logarithmic), accuracy, damage | — |

### 7.2 Banking & Stocks

| Feature | Value | Evidence |
|---|---|---|
| **Bank interest merits** | **+5% APR per merit**, **10 merits max** | VERIFIED (historical) |
| **Stock benefits** | 7-day holding for item benefits; 31-day for cash benefits | COMMUNITY-REPORTED |
| **TCI dividend** | +10% of bank interest rate | COMMUNITY-REPORTED |

### 7.3 Travel Profit Formula (COMMUNITY)

\[
\text{profit/trip} = \sum(qty \times (home\_price \times 0.95 - abroad\_price))
\]

\[
\text{profit/hour} = \frac{\text{profit/trip}}{\text{round-trip hours}}
\]

---

## 8. TRAVEL

### 8.1 Verified Rules

| Rule | Value | Source |
|---|---|---|
| **Unlock level** | **15** | Official Travel page |
| **Weapons/armor on flights** | **Allowed since 21 October 2026** | Official Travel page |
| **Travel slots** | Each item uses a slot; worn clothing does not | Official |
| **Flight time variance** | **±3%** | Official |
| **Arrival grace period** | **15 seconds** | Official |
| **Hiding out threshold** | **168 hours** inactivity abroad | Official |
| **Inventory abroad** | Inaccessible without laptop/PC | Official |

### 8.2 Standard Destinations

| Destination | Time | Cost |
|---|---|---|
| **Mexico (Ciudad Juárez)** | ~24 min | $6,500 |
| **Cayman Islands (George Town)** | ~33–35 min | $10,000 |
| Canada | ~35 min | — |
| United Kingdom | ~40 min | — |
| Japan | — | — |
| China | — | — |
| UAE | — | — |
| South Africa | — | — |

---

## 9. MISSIONS (DUKE CONTRACTS)

### 9.1 Verified Rules

| Rule | Value | Source |
|---|---|---|
| **Starting contracts** | **3** | Official wiki |
| **New contract** | **1 per day at 00:00 TCT** | Official |
| **Max active** | **3** (or **5** with 3★+ Logistics Company) | Official |
| **Introduction: Duke** | Complete **10 contracts**; minimum **7 days** | Official |

### 9.2 Objective Types

| Type | Example Mission | Objective |
|---|---|---|
| Attack (non-defeat) | Show Some Muscle | Attack 1 named player |
| Attack streak | Battering Ram | Attack same player 3 times |
| Defeat any | New Kid on the Block | Defeat 5 players |
| Defeat named | Against the Odds | Defeat 2 named players |
| Killstreak | A Good Day to Get Hard | Killstreak of 10 |
| Weapon-restricted | A Kimpossible Task | Defeat with melee/temp weapons only |
| No-gun | An Honorary Degree | Defeat without guns |
| Mask-restricted | Army of One | Attack with 2 different masks |
| Special weapon | A Thor Loser | Use Duke's Hammer |
| Bounty | — | Claim bounties |
| Compound | — | 10 contracts + defeat named player + spouse |

---

## 10. MERITS

| Merit Category | Effect | Evidence |
|---|---|---|
| **Sharpness** | Passive Speed bonus | VERIFIED |
| **Brawn** | Passive Strength bonus | VERIFIED |
| **Protection** | Passive Defense bonus | VERIFIED |
| **Evasion** | Passive Dexterity bonus | VERIFIED |
| **Critical Hit Rate** | +1% crit (base ~5%) | VERIFIED |
| **Nerve Bar** | +1 nerve per upgrade, max +10 | VERIFIED |
| **Crime Experience** | +3% CE per merit | VERIFIED |
| **Education Time** | −2% per upgrade, max −20% | VERIFIED |
| **Bank Interest** | +5% APR per merit, max +50% | VERIFIED |
| **Masterful Looting** | Up to 50% mug increase | COMMUNITY |
| **Addiction Mitigation** | Reduces drug addiction | COMMUNITY |

---

## 11. API v2

### 11.1 Metadata (VERIFIED)

| Field | Value |
|---|---|
| **OpenAPI version** | **3.1.0** |
| **API version** | **6.14.0** |
| **Base URL** | `https://api.torn.com/v2` |
| **Security** | `api_key` query parameter |
| **Read-only** | **GET only** |
| **Tag groups** | **8** (User, Faction, Market, Racing, Forum, Property, Key, Torn) |
| **Rate limit** | **100 requests/minute per user** |

### 11.2 Community-Reported Counts (NOT OFFICIAL)

| Metric | Value | Status |
|---|---|---|
| Endpoints | 187 | COMMUNITY-REPORTED |
| Operations | 234 | COMMUNITY-REPORTED |

### 11.3 Verified Paths (Partial)

`/user/ammo`, `/user/attacks`, `/user/attacksfull`, `/user/bars`, `/user/basic`, `/user/battlestats`, `/user/bounties`, `/user/calendar`, `/user/cooldowns`, `/user/education`, `/user/equipment`, `/user/events`, `/faction/applications`, `/faction/attacks`, `/faction/basic`, `/faction/hof`, `/forum/categories`

**Status:** BLOCKED for full matrix — single-line JSON truncation.

---

## 12. CORRECTION LOG (Batches 1–9)

| ID | Previous Claim | Corrected Value | Batch |
|---|---|---|---|
| C-01 | Search for Cash uniques = 29 | **34** (reproduced) | 7 |
| C-02 | Cracking uniques = 1 | **0** (later revision) | 5 |
| C-03 | Forgery projects = 14 | **12 current** | 2 |
| C-04 | Scamming enhancer = unknown | **Ergonomic Keyboard** | 2 |
| C-05 | Arson category = Fraud | **Vandalism** | 2 |
| C-06 | Arson enhancer = unknown | **Windproof Lighter** | 2 |
| C-07 | Arson includes “Plant Evidence” | **Dampen (5 nerve)** | 5 |
| C-08 | Crime count = 12 | **13** (Arson is 13th) | 2 |
| C-09 | Graffiti uniques = unknown | **41** (COMMUNITY) | 2 |
| C-10 | Pickpocketing targets = 20/22 | **22/22 COMPLETE** | 4 |
| C-11 | Disposal jobs = 8–12 conflicting | **12 named; “eight” stale** | 4 |
| C-12 | Burglary locations = 18/34 | **34/34 COMPLETE** | 9 |
| C-13 | CBT2790 = “+1% passive Speed” | **+1% increased hit rate** | 9 |
| C-14 | HAF3111 = ambiguous sign | **“50% decrease in opponent escape chance”** | 9 |
| C-15 | BIO2360 duplicate unresolved | **BIO1340 intro / BIO2360 intermediate** | 9 |
| C-16 | Duke contract limits UNVERIFIED | **3 active, 5 with Logistics, 1/day 00:00 TCT** | 2 |
| C-17 | Bank merits medium confidence | **VERIFIED: +5% per merit, 10 max** | 2 |
| C-18 | Old Factory unique = Yasukuni Sword | **Empty Box + Small Explosive Device** | 7 |
| C-19 | Shipyard unique = Skeleton Key/C4/Xanax | **Anchor** | 7 |
| C-20 | API version 5.6.1 vs 6.14.0 conflict | **Not a conflict; raw = 6.14.0** | 7 |

---

## 13. RESEARCH GAP REGISTER (Final Status)

| Gap ID | System | Status | Detail |
|---|---|---|---|
| GAP-001 | Burglary 34 locations | **COMPLETE** | 34/34; skill PARTIAL for 23 |
| GAP-002 | Pickpocketing 22 targets | **COMPLETE** | 22/22 |
| GAP-003 | Disposal jobs | **CONFLICTING** | 12 named; “eight” stale (INFERRED) |
| GAP-004 | Search for Cash uniques | **COMPLETE (34)** | 29 is stale |
| GAP-005 | Cracking uniques | **RESOLVED (0)** | Later revision |
| GAP-006 | Cracking targets | **APPROXIMATE (“26?”)** | Official text uses “?” |
| GAP-007 | Education 12 tracks | **COMPLETE** | All totals and effects |
| GAP-008 | API full matrix | **BLOCKED** | Single-line truncation |
| GAP-009 | Item effects | **PARTIAL** | Enhancers complete; medical/drugs/boosters deferred |
| GAP-010 | Faction perk values | **SUBSTANTIALLY COMPLETE** | 8 branches + 4 cross-perks |

---

## 14. STAGE A READINESS ASSESSMENT

### ✅ COMPLETE Systems
- Pickpocketing (22/22)
- Burglary (34/34 names, items, uniques)
- Search for Cash (34/34)
- Education (12/12 tracks with totals and effects)
- Faction Perks (8 branches with per-upgrade rates)
- Gym/Combat (official stat weights, armor formula)
- Travel (rules, destinations, variance)
- Item Market (fees, limits)
- Duke Missions (contract limits, objective types)
- Merits (core effects)

### ⚠️ PARTIAL Systems
- **Disposal** — 12 jobs documented; “eight” stale prose (CONFLICTING)
- **Cracking** — Targets “26?” (APPROXIMATE)
- **Items** — Enhancers complete; medical/drugs/boosters not extracted
- **Burglary skills** — 23 locations lack individual skill requirement
- **API** — Metadata verified; full path matrix BLOCKED

### 🚫 BLOCKED Systems
- **API full matrix** — Single-line JSON truncation; needs external parser

### Stage A Verdict
**Stage A CANNOT PASS yet.** The only hard blocker is the **API full matrix** (tooling limitation, not source limitation). Items remain PARTIAL but are secondary.

---

## 15. NEXT STEPS (Batch 10)

1. **API:** External parse (`curl -A "research-bot" https://www.torn.com/swagger/openapi.json -o openapi.json && jq '.paths | length'`)
2. **Items:** Extract medical/drug/booster effects from item pages
3. **Burglary skills:** Retrieve commercial/industrial sections via `&section=N`
4. **Disposal:** Accept as CONFLICTING if no patch note found

---

**Report Ends**

*Yeh complete consolidated research report hai. Stage B (original game design) abhi bhi blocked hai jab tak API parse complete nahi hota.*

# MASTER DEVELOPMENT PROMPT — CALIGO × TORN CITY RESEARCH INTEGRATION

## 1. YOUR ROLE

Act as a senior game architect, full-stack game developer, gameplay systems designer, database engineer, UI/UX designer, and QA engineer.

Your task is to upgrade my **already-existing game, Caligo**, by using the complete Torn City research report and all previously supplied research material as a reference for gameplay systems, progression, mechanics, economy, activities, balancing, and long-term engagement.

**This is an upgrade of my existing game, not a new project and not a complete rewrite.**

You must work directly inside the existing Caligo repository/workspace. Inspect the actual implementation, understand how the game works, identify its current features, and build on top of it.

Do not assume that a feature is missing just because it is not mentioned in the research report. Inspect the actual code first.

## 2. THE MOST IMPORTANT RULE: PRESERVE EVERYTHING THAT ALREADY EXISTS

Before changing anything, create a complete inventory of the existing Caligo project.

Identify:

- Every playable feature and gameplay mechanic.
- Every game mode, activity, mission, event, and progression system.
- All existing characters, enemies, objects, items, abilities, upgrades, and rewards.
- All menus, screens, panels, navigation, settings, and user controls.
- Existing maps, locations, environments, animations, visual effects, and assets.
- Existing player data, progression, currency, inventory, achievements, and save systems.
- Existing frontend, backend, APIs, database, authentication, and hosting configuration.
- Existing sound, music, responsive layouts, keyboard controls, and mobile interactions.
- Any unfinished, hidden, experimental, or partially implemented features.
- All additional features that are unique to Caligo and are not present in Torn City.

### Non-negotiable preservation requirements

1. **Do not delete existing Caligo features merely because they do not exist in Torn City.**
2. Do not remove a feature just because you think another design would be better.
3. Do not replace the existing game with a generic crime RPG template.
4. Do not discard existing characters, assets, maps, content, save data, UI components, or game mechanics.
5. Do not overwrite working systems with placeholder implementations.
6. Do not remove existing routes, pages, controls, settings, or supported device functionality.
7. Do not break existing URLs, deployment configuration, or GitHub Pages compatibility unless a necessary architectural change is carefully implemented and documented.
8. Do not rewrite the application from scratch when extending the current architecture is possible.
9. Existing features that overlap with Torn City should be extended or adapted where useful, not duplicated unnecessarily.
10. Existing Caligo-only features must remain part of the final game and should integrate naturally with new systems.

**The final game must contain the original Caligo features PLUS the appropriate new systems derived from the Torn City research. Never trade away existing features simply to make room for new ones.**

If a major change is genuinely required, inspect dependencies, find a backward-compatible approach, and preserve the original behavior wherever possible.

## 3. READ AND USE THE COMPLETE TORN CITY RESEARCH

Use the complete consolidated Torn City research report from Batches 1–9, its tables, corrections, source references, formulas, system index, and gap register that have been supplied in this project/conversation/workspace.

Search the available workspace for the research files before starting. If the report exists as a file, read the actual contents instead of relying on a short summary. If only the pasted report is available, use that material.

The research is a design reference for understanding how complex, persistent, long-running browser games can work. Do not treat every Torn mechanic as automatically verified or ready for implementation.

Preserve the source status of research findings:

- VERIFIED
- CALCULATED
- COMMUNITY-REPORTED
- INFERRED
- CONFLICTING
- UNVERIFIED
- PARTIAL
- BLOCKED
- HISTORICAL
- APPROXIMATE

Do not silently convert uncertain information into confirmed game rules.

If two research sources contradict each other, record the conflict and choose an explicit, configurable design decision for Caligo when implementation needs to proceed. Keep the original source evidence and the reason for the chosen implementation in the documentation.

Do not invent missing numerical formulas, item effects, prices, requirements, rewards, or probability values and present them as verified research. Where exact data is unavailable, design balanced configurable values and label them as Caligo-specific design decisions.

## 4. BUILD A COMPLETE FEATURE-COVERAGE AUDIT

Before implementing major changes, compare the actual Caligo codebase against the Torn City research systems below.

Create a persistent document named `CALIGO_FEATURE_AUDIT.md`.

For each system, record:

- Whether Caligo already implements it.
- The actual files and components involved.
- Whether it works correctly, partially works, or is only a placeholder.
- Whether Torn research suggests useful improvements.
- What needs to be preserved.
- What needs to be extended.
- What needs to be newly implemented.
- Dependencies, risks, and testing requirements.
- Its implementation status after changes.

Use these categories:

- **EXISTING — PRESERVE:** A working Caligo feature that must remain.
- **EXISTING — UPGRADE:** A working feature that can be expanded.
- **PARTIAL — COMPLETE:** A feature that already exists but is incomplete.
- **MISSING — ADD:** A useful system that does not yet exist.
- **CALIGO-UNIQUE:** An original feature that must remain even if Torn has nothing similar.
- **RESEARCH-GAP:** An area for which the supplied research is incomplete or contradictory.
- **NOT-APPLICABLE:** A system that does not fit Caligo's genre or architecture; explain the reason and any alternative.

Do not mark a feature complete just because a screen or button exists. Verify that its underlying logic works.

## 5. GAMEPLAY SYSTEMS TO EVALUATE AND INTEGRATE

Evaluate every system below against the actual codebase. Implement missing systems that fit Caligo, expand relevant existing systems, and preserve all unrelated Caligo functionality.

Do not force an inappropriate crime, business, or combat mechanic into Caligo if its existing world and gameplay do not support it. Adapt the underlying design principle while retaining Caligo's identity.

### A. Player identity, character progression, and persistent state

Evaluate and implement where appropriate:

- Player profiles and character progression.
- Character level, experience, progression milestones, and unlocks.
- Persistent character attributes and derived statistics.
- Player status, activity state, and progression history.
- Account settings and configurable player preferences.
- Persistent game state across refreshes and sessions.
- Save migration when existing player data needs new fields.
- Recovery from incomplete saves, invalid state, and interrupted actions.

Preserve the current player system if it already exists. Extend its data model carefully rather than resetting players.

### B. Resource and regeneration systems

Use the research on Energy, Nerve, Happiness, and Life as reference patterns for distinct resource systems.

First determine which Caligo resources already exist. Do not create four redundant resources if the game already has equivalent mechanics.

Possible integrations include:

- Action energy and activity costs.
- A resource used for special actions, challenges, or risky activities.
- Happiness, morale, concentration, or another world-appropriate modifier.
- Health, damage, recovery, defeat, and injury states.
- Natural regeneration, capacity limits, temporary boosts, and modifiers.
- Upgradeable regeneration speed and maximum capacity.
- Clear cooldown and resource-recovery feedback.

Resource regeneration must use reliable timestamps or server-authoritative time where required. It must not become exploitable by repeatedly refreshing the browser or changing the client clock.

Make resource rules configurable. Clearly distinguish permanent progression bonuses from temporary effects.

### C. Training, statistics, and upgrades

Use the Torn gym and battle-stat research as design inspiration.

Evaluate:

- Training locations and training actions.
- Strength, speed, defence, dexterity, or equivalent game-specific attributes.
- Training costs and progression curves.
- Permanent upgrades, diminishing returns, and stat scaling.
- Equipment modifiers and temporary buffs.
- Milestones, unlock requirements, and advanced training.
- Clear explanations of how attributes affect outcomes.

Reuse Caligo's existing stat system if it is suitable. Do not add duplicate attributes that perform the same function.

Create centralized calculations so upgrades, equipment, buffs, combat, and UI use consistent results.

Avoid arbitrary linear scaling that makes early progression meaningless or late-game values impossible to balance.

### D. Activities, actions, and skill progression

Use Torn's Crimes 2.0 structure as a reference for activity design, skill progression, requirements, action costs, and outcomes.

Study the reported activity families, including Search for Cash, Bootlegging, Graffiti, Shoplifting, Card Skimming, Burglary, Pickpocketing, Hustling, Disposal, Cracking, Forgery, Scamming, and Arson.

Do not copy these as a mandatory crime list. Adapt applicable mechanics into Caligo's own setting.

Potential design patterns include:

- Multiple distinct activity families.
- Actions with separate costs and prerequisites.
- Skill levels and difficulty tiers.
- Risk and reward trade-offs.
- Success, failure, partial success, and rare outcomes.
- Unlockable actions and equipment.
- Repeatable activities that remain interesting through progression.
- Location-dependent opportunities.
- Cooldowns and meaningful consequences.
- Action histories and skill progression.

If Caligo already has missions, quests, or activities, expand the existing framework rather than building a competing one.

Keep action definitions data-driven wherever practical so new activities can be added without rewriting the entire game engine.

### E. Hidden skill, experience, and progression modifiers

The research discusses Crime Experience and its relationship with certain progression mechanics.

Use that principle only where appropriate for Caligo. Consider hidden or visible mastery values, skill experience, reputation, proficiency, and long-term progression modifiers.

Hidden mechanics should not become arbitrary or unfair. Document their rules for developers, expose meaningful player feedback, and provide reasonable ways to discover progression.

Do not claim to reproduce Torn's exact hidden formulas unless they are supported by the supplied research and are appropriate for the original game.

### F. Missions, contracts, quests, and challenges

Use the Duke mission research as a reference for repeatable contracts and structured objectives.

Evaluate:

- Daily or recurring missions.
- Active mission limits.
- Objective combinations and restrictions.
- Target-specific or action-specific challenges.
- Streaks and consecutive accomplishments.
- Rewards, prerequisites, completion history, and failure states.
- Mission generation and progression.
- Appropriate difficulty and cooldown rules.

Retain Caligo's existing quest or mission system. Add these mechanics to it where possible.

Do not turn recurring tasks into endless repetitive work. Missions should connect to the game's progression and provide meaningful goals.

### G. Combat and consequences

Use the combat research as a reference for consistent resolution, equipment effects, hit chance, mitigation, and stat interactions.

Audit the existing combat engine before making changes.

Where appropriate, support:

- Consistent attack resolution.
- Hit chance and defensive mitigation.
- Damage calculations.
- Weapon and armour modifiers.
- Health and defeat states.
- Recovery and temporary incapacitation.
- PvE and, where the current architecture supports it, PvP.
- Combat logs and understandable outcome messages.
- Anti-exploit validation for combat actions.
- Balanced progression between new and advanced players.

Centralize authoritative combat calculations. Avoid duplicating formulas in separate UI components.

Do not simply copy Torn's formulas; adapt and rebalance them for Caligo's existing combat design.

### H. Inventory, items, equipment, and effects

Evaluate the full Caligo inventory and item implementation.

Use the research on equipment, enhancers, consumables, tools, and item-dependent outcomes as design inspiration.

Where relevant, support:

- Item definitions and unique identifiers.
- Inventory capacity and item stacking.
- Equipment slots and loadouts.
- Weapons, armour, tools, consumables, and collectibles.
- Item requirements and skill-gated uses.
- Consumable duration, cooldowns, and effects.
- Item rarity, value, rewards, and acquisition sources.
- Buying, selling, transferring, equipping, and using items.
- Item-effect validation and consistent stat calculations.
- Transaction history and duplication prevention.

Reuse Caligo's current item definitions and assets. Do not delete existing items or replace existing inventory data with a new schema without a migration plan.

New item effects must have real gameplay logic, not merely descriptive text or non-functional buttons.

### I. Skills, education, and long-term learning

Evaluate the research on the 12 Education tracks, course costs, durations, prerequisites, and passive effects.

Adapt its progression principles to Caligo's setting. Possible systems include training courses, research, certifications, skill trees, specializations, or character development paths.

Where suitable, support:

- Multiple learning paths.
- Course requirements and costs.
- Learning durations and completion states.
- Passive bonuses and unlocks.
- Specialization choices.
- Clear progression summaries.
- Prerequisite tracking and migration of existing character progress.

Do not add a university system simply for the sake of copying Torn. Integrate the underlying progression design only when it improves Caligo.

Treat conflicting education effects in the research as unconfirmed until resolved.

### J. Economy, currency, and financial systems

Audit every existing currency, earning system, store, reward, and transaction in Caligo.

Use the Torn economy research to evaluate:

- Multiple currencies, if justified.
- Reliable sources and sinks for currency.
- Shops and item pricing.
- Buy/sell differences and transaction fees.
- Rewards, recurring income, and progression costs.
- Market supply and demand.
- Player-to-player transactions.
- Banking, interest, investments, or passive income, if suitable.
- Transaction history and economic balancing.
- Duplicate transaction and currency-exploit prevention.

Do not add financial features that merely generate unlimited currency. Every economy feature needs a clear purpose and a balance model.

If a market or trading system is introduced, protect transactions from item duplication, negative balances, race conditions, and client-side manipulation.

Research-reported fees and values are not automatically Caligo defaults. Use Caligo-specific configuration and balance testing.

### K. Travel, locations, and the world

Evaluate the Travel and Properties research against Caligo's existing world structure.

Where appropriate, expand the world with:

- Unlockable destinations.
- Location-specific activities, items, shops, and missions.
- Travel costs and durations.
- Location-dependent actions and access requirements.
- Inventory and activity rules while travelling.
- Properties, personal spaces, bases, or upgradeable locations.
- Meaningful location progression.

Preserve existing maps and world content. Do not replace the current map or navigation structure without a compatibility plan.

Add new locations only when they connect to actual activities or progression. They should not be empty screens added just to increase the number of features.

### L. Jobs, companies, factions, teams, and social systems

Use the research on Jobs, Companies, Factions, and Faction Perks as a reference for long-term cooperative progression.

Check which social and organization mechanics Caligo already supports.

Where appropriate, consider:

- Jobs or careers.
- Organisations, guilds, clans, factions, or teams.
- Membership and permission management.
- Shared progression and group objectives.
- Organization upgrades and configurable perks.
- Contribution tracking and reward distribution.
- Role-based permissions.
- Group missions and leaderboards.
- Anti-abuse and transaction safeguards.

Do not implement every faction perk literally. Select effects that suit Caligo's design and balance.

If multiplayer features already exist, extend their current architecture rather than creating a separate identity or membership system.

### M. Jail, penalties, risk, and recovery

Use the Jail research as inspiration only if Caligo has a world-appropriate equivalent.

Evaluate whether the game benefits from penalties, temporary lockouts, capture, injury, failed missions, recovery tasks, or other consequences.

Consequences must be understandable and fair. Avoid mechanics that permanently destroy valid player progress or make the game unplayable after a single mistake.

### N. Merits, achievements, collections, and milestones

Use the Merits and Awards research as a reference for permanent accomplishments and incremental upgrades.

Where applicable, implement or expand:

- Achievements and milestones.
- Permanent upgrade points.
- Reward tracks.
- Collections and unique discoveries.
- Progress summaries.
- Long-term goals.
- Unlock conditions and reward claim validation.

Do not create duplicate achievement systems if Caligo already has one. Merge features into the appropriate existing system.

### O. Player market and item trading

If the game has, or should reasonably have, a player-driven economy, consider a listing-based market that supports:

- Item listings and price filters.
- Search, sorting, and pagination.
- Listing, buying, cancelling, and expiration.
- Transaction fees configured by the game.
- Atomic transactions and reliable inventory changes.
- Listing history and transaction records.
- Duplicate-purchase prevention and concurrent transaction handling.

Never trust the browser to determine the authoritative listing price, player's balance, or item ownership.

If multiplayer trading requires a backend that does not exist, design the integration explicitly rather than pretending client-side data is secure.

### P. User interface, onboarding, and player experience

Preserve Caligo's existing visual identity, layout, character presentation, and interaction patterns.

Audit the full user journey and improve it without gratuitously redesigning working screens.

Where needed, add:

- Clear resource bars and regeneration indicators.
- Character progression and stat summaries.
- Activity and mission panels.
- Inventory and equipment management.
- Economy and transaction views.
- Location and travel interfaces.
- Training and upgrade screens.
- Achievement and history views.
- Helpful empty, loading, success, error, and offline states.
- Mobile-friendly controls and responsive layouts.
- Onboarding that explains newly introduced mechanics.
- Accessible navigation and consistent feedback.

New systems must look like part of Caligo, not unrelated modules bolted onto the interface.

Reuse existing design tokens, components, typography, icons, and styles wherever practical. Do not add unnecessary dependencies or create a visually inconsistent collection of panels.

## 6. USE THE RESEARCH AS A SYSTEM, NOT JUST A CHECKLIST

Do not simply copy a list of Torn features into Caligo.

Study the connections between mechanics.

For example:

- Activities consume resources and improve skills.
- Skills unlock more difficult activities.
- Training influences combat or other outcomes.
- Items and equipment change available actions and their results.
- Missions guide players toward different parts of the game.
- Jobs or organisations provide additional progression paths.
- The economy links activity rewards with item demand and spending.
- Locations create new opportunities and progression gates.
- Achievements reward long-term engagement.
- Progression modifiers must interact consistently with all relevant calculations.

Build a coherent gameplay loop using compatible systems that already exist and new systems that genuinely improve Caligo.

Every new feature must have a reason to exist, a connection to the core gameplay, a defined data model, working actions, feedback for the player, and tests where appropriate.

## 7. ARCHITECTURE, DATA, AND BACKEND REQUIREMENTS

First determine the actual technologies and architecture used by Caligo. Follow the project's established patterns unless there is a clear technical reason to improve them.

### Code structure

- Extend existing modules where practical.
- Keep gameplay logic separate from UI presentation.
- Centralize formulas, configuration, and game rules.
- Use reusable components and data-driven definitions.
- Avoid giant monolithic components.
- Avoid duplicating the same rules across multiple files.
- Maintain existing route and asset path conventions.
- Keep interfaces and shared types consistent.
- Add clear error handling.
- Do not leave fake implementations hidden behind working-looking UI.

### State and persistence

Inspect the current save system before changing it.

Use the most appropriate persistence mechanism for the actual game architecture. If local storage is used, preserve existing save compatibility. If a database already exists, extend its schema safely.

For persistent multiplayer systems, use an authoritative backend wherever client-side manipulation could affect player balances, inventory, combat, cooldowns, ownership, missions, or shared world state.

Never rely on the client browser as the sole authority for competitive or economic outcomes.

### Backend and hosting

Inspect the current deployment configuration before introducing infrastructure.

If Caligo is currently a static GitHub Pages game, do not assume that a fully persistent multiplayer economy can be made secure using frontend code alone.

Preserve the working static deployment where possible, and introduce only the backend or external service genuinely needed by the selected features. Keep hosting costs, setup requirements, and third-party dependencies explicit.

Do not introduce an expensive paid service or a major platform migration without a strong technical reason.

Never expose secrets, service-role keys, database credentials, or private API tokens in client-side code. Provide `.env.example` when appropriate and keep actual secrets out of version control.

Do not use Torn's API as Caligo's game backend. The supplied API research describes Torn's read-only API; Caligo needs its own original game logic and appropriate data services.

### Database migrations

If the data model changes:

- Preserve existing players and saves.
- Add explicit migrations or backward-compatible default values.
- Handle old and partially written data safely.
- Avoid resetting the database or deleting user data.
- Document any unavoidable migration requirements.

## 8. ORIGINALITY AND INTELLECTUAL PROPERTY

Caligo must remain its own game.

Use the Torn City research to learn from its systems, balance principles, activity structures, progression loops, and economy design.

Do not directly copy Torn's proprietary assets, artwork, logos, branding, exact UI, written descriptions, mission text, maps, or other distinctive content.

Create Caligo-appropriate names, descriptions, assets, setting, progression choices, item content, and balancing. Do not present Caligo as an official Torn product or imply an affiliation.

Use the broad mechanics as design inspiration and implement them with Caligo's own identity.

## 9. RESEARCH GAPS MUST BE HANDLED TRANSPARENTLY

The consolidated research report identifies important incomplete or conflicting areas. Preserve these limitations during implementation.

Examples include:

- The full Torn API endpoint matrix was blocked or incomplete.
- Some item-effect data was deferred.
- Some Burglary skill requirements are only partially recorded.
- Disposal research contains an unresolved eight-versus-twelve-types conflict.
- Some Cracking target counts are approximate.
- Some education effects and historical entries have conflicting descriptions.
- Some faction information relies on community research.
- Several reported figures may be historical rather than current.

Do not make more research on Torn an excuse to stop all Caligo development. Use sufficiently supported mechanics now; where exact values are missing, create clearly labeled Caligo-specific rules and configurable values.

If an unresolved research detail materially affects the architecture or balance, document the uncertainty and continue with a safe, modular implementation rather than silently inventing facts.

## 10. IMPLEMENTATION WORKFLOW — EXECUTE, DO NOT STOP AT PLANNING

Follow this workflow in the actual workspace.

### Phase 1 — Inspect and protect the existing game

1. Inspect the repository structure and all major source files.
2. Read the README, package configuration, build scripts, existing documentation, and deployment configuration.
3. Inspect Git status before changes.
4. Identify existing features and record the files that implement them.
5. Run the current tests, lint checks, and production build when available.
6. Record existing failures separately so they are not mistaken for regressions.
7. Establish a safe checkpoint or recommended recovery method before extensive edits. Do not delete or overwrite user work.
8. Identify the current core gameplay loop and technical constraints.

### Phase 2 — Build the mapping and integration plan

1. Create `CALIGO_FEATURE_AUDIT.md`.
2. Create `CALIGO_SYSTEM_ARCHITECTURE.md`.
3. Create `CALIGO_IMPLEMENTATION_ROADMAP.md`.
4. Map each relevant Torn research system to existing Caligo features or proposed new modules.
5. Mark all Caligo-only features that must be retained.
6. Identify dependencies and order the work to avoid broken integrations.
7. Separate required gameplay systems from optional features that do not fit the game.
8. Choose the smallest coherent implementation plan that preserves all existing working behavior.

Do not ask for confirmation after producing the plan. Proceed with implementation using sensible, reversible decisions.

### Phase 3 — Implement incrementally

1. Implement foundational data models and shared rules first.
2. Extend existing gameplay systems before creating replacements.
3. Add missing systems in modular, testable increments.
4. Connect features so progression, resources, equipment, missions, and rewards work together.
5. Add all necessary UI, actions, validation, persistence, and feedback.
6. Add loading, error, empty, and success states.
7. Add tests for new systems and regression tests for existing functionality.
8. Keep the game runnable between changes.
9. Do not stop after writing a roadmap or creating empty modules.
10. Continue until you have completed the feasible work in the current environment. Do not claim that a system is implemented when it is only planned.

### Phase 4 — Verify the complete integration

Run the available:

- Production build.
- Unit and integration tests.
- Linter and type checks.
- Save and migration checks.
- Gameplay logic checks.
- UI and navigation checks.
- Responsive and mobile interaction checks.
- Existing feature regression tests.

Test the critical gameplay loops from start to finish.

For example, where applicable: start a session → perform an activity → spend resources → receive the outcome → gain progression → obtain or use a reward → save the state → refresh/reopen → verify that the state remains correct.

Test the new and existing systems together, not only in isolation.

Fix regressions caused by your changes. If something cannot be verified because the available environment lacks a browser, backend, credentials, or another required dependency, state the exact limitation and do not claim the test passed.

### Phase 5 — Keep the project maintainable

Update documentation as implementation changes.

Create or update these persistent documents as appropriate:

- `CALIGO_FEATURE_AUDIT.md` — existing, added, upgraded, unique, and deferred features.
- `CALIGO_SYSTEM_ARCHITECTURE.md` — module responsibilities, state flow, data models, and dependencies.
- `CALIGO_IMPLEMENTATION_ROADMAP.md` — actual completed work and outstanding work.
- `CALIGO_BALANCE_CONFIG.md` — configurable resource limits, costs, rewards, modifiers, cooldowns, and progression values.
- `CALIGO_RESEARCH_TRACEABILITY.md` — mapping from research findings to Caligo implementations, including evidence status and Caligo-specific design decisions.
- `CALIGO_CHANGELOG.md` — meaningful modifications and preserved compatibility.

Only claim that files exist if you have actually created or updated them. Keep the documentation consistent with the actual code.

## 11. ACCEPTANCE CRITERIA

The work is not complete merely because the app builds.

The final result must satisfy these conditions:

### Preservation
- All previously working Caligo features remain available.
- Caligo-only mechanics and assets are retained.
- Existing navigation, controls, and core game loop continue to work.
- Existing save data is preserved or migrated safely.

### Integration
- Relevant Torn-inspired systems are implemented in Caligo's own design.
- Existing overlapping systems are upgraded instead of duplicated.
- Missing appropriate systems are implemented, not merely listed in documentation.
- New mechanics connect meaningfully to the actual gameplay loop.
- Newly added UI controls perform real actions.
- Game rules are consistent across the interface, state management, and backend.

### Technical quality
- No avoidable destructive rewrites.
- No broken import paths, invalid asset paths, or unresolved dependencies introduced by changes.
- No fake success states or placeholder functionality presented as complete.
- No client-side authority over security-sensitive multiplayer transactions.
- No exposed secrets.
- No known regression caused by the modifications left undocumented.

### Evidence and reporting
- Research-derived facts retain their evidence status.
- Caligo-specific balancing decisions are labeled as such.
- Tests are reported truthfully.
- Incomplete integrations and blockers remain visible.
- Every system is marked with its real implementation status.

## 12. FINAL RESPONSE FORMAT

After implementing and testing the project, report:

1. **Existing Caligo features preserved:** Name the major features and the implementation areas inspected.
2. **Existing features upgraded:** Explain which systems were extended and what changed.
3. **New features implemented:** List the working additions and explain how they connect to the gameplay.
4. **Caligo-specific mechanics:** Describe any original balancing and design decisions.
5. **Files changed or created:** Name the important actual files.
6. **Data and migration safety:** State whether existing saves and player data are preserved.
7. **Verification results:** Report the actual build, test, lint, and other results, distinguishing pre-existing failures from new failures.
8. **Incomplete work:** Clearly state any features that remain partial, blocked, or deferred and explain why.
9. **Next priorities:** Provide the highest-value remaining tasks based on the real project status.

Do not say that every feature has been completed if some remain unfinished.

## FINAL DIRECTIVE

**Start by examining my existing Caligo repository and the complete Torn City research already supplied. Preserve the current game, audit every feature, map the research onto the actual code, and then implement the compatible missing features and improvements directly in the project.**

Never sacrifice existing Caligo features merely to imitate Torn City. When a mechanic already exists, improve it if useful. When it is missing and appropriate, add it. When it is unique to Caligo, preserve it. When research is incomplete, retain the uncertainty and use a configurable, clearly documented design decision if necessary.

The goal is a richer, deeper, more coherent Caligo built on its existing foundation—not a stripped-down clone, a fresh replacement project, or just a document containing future ideas.

Begin now with repository inspection, and continue through implementation and verification without stopping after the planning phase.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-27T19:40:06+05:30.

The user has mentioned some items in the form @[ITEM]. Here is extra information about the items that were mentioned by the user, in the order that they appear:

@[d:\HARI KHATRI\Caligo] is a [File]:
d:\HARI KHATRI\Caligo
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.8 Flash (High) to Claude Opus 4.6 (Thinking). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>