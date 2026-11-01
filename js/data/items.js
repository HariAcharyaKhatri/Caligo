/* CALIGO — every item in the world.
   Compact tuple format keeps the table readable:
   [id, name, category, subtype, rarity, price, extra]                    */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var DEFS = [
    /* ---------------- MELEE ---------------- */
    ['fists', 'Fists', 'weapon', 'melee', 'common', 0, { dmg: 5, desc: 'Bare hands. Free, and it shows.' }],
    ['brass_knuckles', 'Brass Knuckles', 'weapon', 'melee', 'common', 250, { dmg: 20, tags: ['street'], desc: 'Cheap, loud, effective.' }],
    ['knife', 'Knife', 'weapon', 'melee', 'common', 400, { dmg: 15, tags: ['blade'], desc: 'A short blade with a taped grip.' }],
    ['bat', 'Baseball Bat', 'weapon', 'melee', 'common', 600, { dmg: 25, tags: ['street'], desc: 'Dockside classic. Still has the sticker.' }],
    ['crowbar', 'Crowbar', 'weapon', 'melee', 'uncommon', 750, { dmg: 30, tags: ['lock'], desc: 'Opens doors and arguments alike.' }],
    ['machete', 'Machete', 'weapon', 'melee', 'uncommon', 1200, { dmg: 40, tags: ['blade'], desc: 'Heavy blade, worn handle.' }],
    ['nunchucks', 'Nunchucks', 'weapon', 'melee', 'uncommon', 1500, { dmg: 45, tags: ['blade'], desc: 'Harder to use than the vids suggest.' }],
    ['whip', 'Whip', 'weapon', 'melee', 'uncommon', 1000, { dmg: 35, tags: ['street'], desc: 'Braided leather. Keeps people at range.' }],
    ['katana', 'Katana', 'weapon', 'melee', 'rare', 9000, { dmg: 70, tags: ['blade'], desc: 'Folded steel, folded patience.' }],
    ['sledgehammer', 'Sledgehammer', 'weapon', 'melee', 'rare', 15000, { dmg: 100, tags: ['lock'], desc: 'Solves most problems eventually.' }],
    ['chainsaw', 'Chainsaw', 'weapon', 'melee', 'epic', 40000, { dmg: 120, tags: ['blade'], desc: 'Terrible in a stairwell. Terrifying anyway.' }],
    ['stun_gun', 'Stun Gun', 'weapon', 'melee', 'rare', 8000, { dmg: 15, tags: ['street'], stun: 0.25, desc: 'Drops a mark fast and quiet.' }],
    ['taser', 'Taser', 'weapon', 'melee', 'uncommon', 5000, { dmg: 10, tags: ['street'], stun: 0.2, desc: 'One shot, then you had better be winning.' }],
    ['power_fist', 'Power Fist', 'weapon', 'melee', 'legendary', 500000, { dmg: 150, tags: ['street'], desc: 'Hydraulic knuckles from a Hollows workshop.' }],

    /* ---------------- PISTOLS ---------------- */
    ['pistol_glock', 'Vantor 17', 'weapon', 'pistol', 'uncommon', 6000, { dmg: 30, tags: ['firearm'], desc: 'Reliable polymer sidearm.' }],
    ['pistol_beretta', 'Rinelli 92', 'weapon', 'pistol', 'uncommon', 9000, { dmg: 35, tags: ['firearm'], desc: 'Standard issue for people who are not issued anything.' }],
    ['pistol_compact', 'Kess PM9', 'weapon', 'pistol', 'rare', 12000, { dmg: 40, tags: ['firearm'], desc: 'Fits a coat pocket. Barely.' }],
    ['pistol_heavy', 'Marek .45', 'weapon', 'pistol', 'rare', 20000, { dmg: 45, tags: ['firearm'], desc: 'Loud, heavy, convincing.' }],
    ['hand_cannon', 'Ostrava Hand Cannon', 'weapon', 'pistol', 'epic', 45000, { dmg: 60, tags: ['firearm'], desc: 'A pistol the way a brick is a paperweight.' }],
    ['revolver', 'Sable Revolver', 'weapon', 'pistol', 'rare', 60000, { dmg: 70, tags: ['firearm'], desc: 'Six shots, no apologies.' }],
    ['revolver_large', 'Sable .50 Long', 'weapon', 'pistol', 'epic', 150000, { dmg: 100, tags: ['firearm'], desc: 'Ridiculous. Effective.' }],
    ['pistol_golden', 'Gilded Sidearm', 'weapon', 'pistol', 'legendary', 600000, { dmg: 100, tags: ['firearm'], desc: 'Choir officers carry these. Now so do you.' }],
    ['pistol_silenced', 'Whisper 9', 'weapon', 'pistol', 'rare', 35000, { dmg: 35, tags: ['firearm', 'stealth'], desc: 'Quiet enough for a stairwell.' }],

    /* ---------------- SMG ---------------- */
    ['smg_a', 'Vantor MP', 'weapon', 'smg', 'rare', 25000, { dmg: 30, tags: ['firearm'], desc: 'Spray and pray, dockside edition.' }],
    ['smg_b', 'Rinelli 12', 'weapon', 'smg', 'rare', 35000, { dmg: 35, tags: ['firearm'], desc: 'Old design, still works.' }],
    ['smg_c', 'Kess K7', 'weapon', 'smg', 'rare', 45000, { dmg: 40, tags: ['firearm'], desc: 'Folding stock, unforgiving rate.' }],
    ['smg_d', 'Ostrava S9', 'weapon', 'smg', 'epic', 60000, { dmg: 45, tags: ['firearm'], desc: 'Exchange bodyguard standard.' }],
    ['smg_e', 'Vantor Vector-X', 'weapon', 'smg', 'epic', 80000, { dmg: 50, tags: ['firearm'], desc: 'Handles like it knows where you are aiming.' }],
    ['smg_f', 'Marek Cyclone', 'weapon', 'smg', 'epic', 110000, { dmg: 55, tags: ['firearm'], desc: 'Belt-fed, bad news.' }],

    /* ---------------- ASSAULT RIFLES ---------------- */
    ['ar_a', 'Rinelli AR-4', 'weapon', 'rifle', 'epic', 120000, { dmg: 70, tags: ['firearm'], desc: 'The workhorse of every bad idea.' }],
    ['ar_b', 'Vantor VK', 'weapon', 'rifle', 'epic', 160000, { dmg: 74, tags: ['firearm'], desc: 'Modular rails, endless attachments.' }],
    ['ar_c', 'Kess K14', 'weapon', 'rifle', 'epic', 200000, { dmg: 78, tags: ['firearm'], desc: 'Choir surplus, stripped of markings.' }],
    ['ar_d', 'Ostrava O5', 'weapon', 'rifle', 'epic', 240000, { dmg: 80, tags: ['firearm'], desc: 'Accurate to a worrying distance.' }],
    ['ar_e', 'Marek M4 Long', 'weapon', 'rifle', 'epic', 280000, { dmg: 83, tags: ['firearm'], desc: 'Long barrel, steady hand.' }],
    ['ar_f', 'Vantor XR', 'weapon', 'rifle', 'legendary', 320000, { dmg: 86, tags: ['firearm'], desc: 'Prototype that escaped the Spire.' }],
    ['ar_g', 'Sable Breach', 'weapon', 'rifle', 'legendary', 360000, { dmg: 88, tags: ['firearm'], desc: 'Built for doors and the people behind them.' }],
    ['ar_h', 'Kess K21 Ghost', 'weapon', 'rifle', 'legendary', 400000, { dmg: 90, tags: ['firearm'], desc: 'You will never hear it from the front.' }],

    /* ---------------- SHOTGUNS ---------------- */
    ['sg_a', 'Rinelli 870', 'weapon', 'shotgun', 'epic', 90000, { dmg: 90, tags: ['firearm'], desc: 'Pump action, close quarters.' }],
    ['sg_b', 'Vantor Breaker', 'weapon', 'shotgun', 'epic', 140000, { dmg: 100, tags: ['firearm'], desc: 'Semi-auto and unreasonable.' }],
    ['sg_c', 'Marek Twin Bore', 'weapon', 'shotgun', 'legendary', 190000, { dmg: 110, tags: ['firearm'], desc: 'Two barrels, one decision.' }],
    ['sg_d', 'Ostrava Siege', 'weapon', 'shotgun', 'legendary', 250000, { dmg: 120, tags: ['firearm'], desc: 'Used to open vault doors. Allegedly.' }],

    /* ---------------- SNIPERS ---------------- */
    ['sn_a', 'Kess Longview', 'weapon', 'sniper', 'epic', 400000, { dmg: 130, tags: ['firearm'], desc: 'Bolt action, cold calculation.' }],
    ['sn_b', 'Sable Reach', 'weapon', 'sniper', 'legendary', 800000, { dmg: 165, tags: ['firearm'], desc: 'Hollows gunsmith special.' }],
    ['sn_c', 'Vantor Horizon', 'weapon', 'sniper', 'legendary', 1400000, { dmg: 200, tags: ['firearm'], desc: 'Rangefinder built into the glass.' }],
    ['sn_d', 'Ostrava Godline', 'weapon', 'sniper', 'legendary', 2000000, { dmg: 250, tags: ['firearm'], desc: 'The Spire\'s answer to a very specific problem.' }],

    /* ---------------- HEAVY ---------------- */
    ['hw_a', 'Rinelli Heavy MG', 'weapon', 'heavy', 'legendary', 1500000, { dmg: 120, tags: ['firearm'], desc: 'Not portable. Not subtle.' }],
    ['hw_b', 'Sable Rocket Tube', 'weapon', 'heavy', 'legendary', 3000000, { dmg: 300, tags: ['firearm', 'explosive'], desc: 'Point at problem. Problem ends.' }],
    ['hw_c', 'Choir Siege Cannon', 'weapon', 'heavy', 'legendary', 8000000, { dmg: 450, tags: ['firearm', 'explosive'], desc: 'Mounted on Spire checkpoints.' }],
    ['hw_energy', 'Caligo Resonance Lance', 'weapon', 'heavy', 'mythic', 50000000, { dmg: 600, tags: ['energy'], desc: 'Orbital-yard technology. Barely understood.' }],

    /* ---------------- EXPLOSIVES (consumable) ---------------- */
    ['grenade', 'Fragmentation Grenade', 'explosive', 'thrown', 'rare', 10000, { dmg: 100, radius: 6, stack: true, tags: ['explosive'], desc: 'Pull pin. Regret later.' }],
    ['dynamite', 'Dynamite Bundle', 'explosive', 'placed', 'rare', 25000, { dmg: 180, radius: 8, stack: true, tags: ['explosive'], desc: 'Old mining stock from the Docks.' }],
    ['claymore', 'Directional Mine', 'explosive', 'placed', 'epic', 30000, { dmg: 150, radius: 12, stack: true, tags: ['explosive'], desc: 'Faces one way. Chooses for you.' }],
    ['plastic_charge', 'Moulded Charge', 'explosive', 'placed', 'epic', 60000, { dmg: 200, radius: 5, stack: true, tags: ['explosive'], desc: 'Shaped, quiet, thorough.' }],
    ['thermite', 'Thermite Charge', 'explosive', 'placed', 'legendary', 120000, { dmg: 300, radius: 3, stack: true, tags: ['explosive'], desc: 'Burns through anything you can name.' }],

    /* ---------------- ARMOUR ---------------- */
    ['leather_jacket', 'Leather Jacket', 'armour', 'body', 'common', 500, { def: 10, dur: 40, desc: 'Scuffed, warm, mildly protective.' }],
    ['kevlar_vest', 'Kevlar Vest', 'armour', 'body', 'uncommon', 5000, { def: 30, dur: 80, desc: 'Stops most of the small things.' }],
    ['ballistic_vest', 'Ballistic Vest', 'armour', 'body', 'rare', 18000, { def: 50, dur: 120, desc: 'Rated for rifles, priced for paranoia.' }],
    ['riot_gear', 'Riot Gear', 'armour', 'body', 'rare', 45000, { def: 70, dur: 160, desc: 'Surplus from a protest nobody talks about.' }],
    ['military_armour', 'Military Armour', 'armour', 'body', 'epic', 120000, { def: 90, dur: 220, desc: 'Plate carrier with real plates.' }],
    ['composite_vest', 'Composite Vest', 'armour', 'body', 'epic', 300000, { def: 120, dur: 280, desc: 'Layered ceramic, Spire-made.' }],
    ['powered_armour', 'Powered Armour', 'armour', 'body', 'legendary', 2000000, { def: 200, dur: 400, desc: 'Servo-assisted. Walks like a small vehicle.' }],
    ['nano_armour', 'Nanoweave Shell', 'armour', 'body', 'mythic', 20000000, { def: 350, dur: 600, desc: 'Repairs itself. Nobody knows how.' }],

    /* ---------------- AMMO ---------------- */
    ['ammo_standard', 'Standard Rounds', 'ammo', 'rounds', 'common', 20, { stack: true, desc: 'No modifier. Reliable.' }],
    ['ammo_hollow', 'Hollow Point', 'ammo', 'rounds', 'uncommon', 60, { stack: true, effect: 'bleed', mod: 0.20, desc: '+20% damage, causes bleeding.' }],
    ['ammo_tracer', 'Tracer Rounds', 'ammo', 'rounds', 'uncommon', 45, { stack: true, effect: 'accuracy', mod: 0.10, desc: '+10% accuracy.' }],
    ['ammo_piercing', 'Piercing Rounds', 'ammo', 'rounds', 'rare', 120, { stack: true, effect: 'pierce', mod: 0.30, desc: '+30% armour penetration.' }],
    ['ammo_incendiary', 'Incendiary Rounds', 'ammo', 'rounds', 'rare', 150, { stack: true, effect: 'burn', mod: 0.25, desc: '+25% damage, causes burning.' }],
    ['ammo_explosive', 'Explosive Rounds', 'ammo', 'rounds', 'epic', 400, { stack: true, effect: 'area', mod: 0.50, desc: '+50% damage in an area.' }],
    ['ammo_subsonic', 'Subsonic Rounds', 'ammo', 'rounds', 'rare', 100, { stack: true, effect: 'quiet', mod: 0, desc: 'No damage bonus. Almost silent.' }],

    /* ---------------- MEDICAL ---------------- */
    ['bandage', 'Bandage', 'medical', 'heal', 'common', 50, { stack: true, heal: 10, desc: 'Stops the bleeding. Mostly.' }],
    ['first_aid', 'First Aid Kit', 'medical', 'heal', 'common', 200, { stack: true, heal: 30, desc: 'A tin of useful things.' }],
    ['med_kit', 'Med Kit', 'medical', 'heal', 'uncommon', 1000, { stack: true, heal: 50, desc: 'Proper supplies, proper stitching.' }],
    ['trauma_kit', 'Trauma Kit', 'medical', 'heal', 'rare', 5000, { stack: true, heal: 80, desc: 'For when it is genuinely bad.' }],
    ['surgical_kit', 'Surgical Kit', 'medical', 'heal', 'rare', 25000, { stack: true, heal: 100, desc: 'Field surgery without the field.' }],
    ['nanomed', 'Nanomed Injector', 'medical', 'heal', 'epic', 100000, { stack: true, heal: 200, desc: 'Knits tissue from the inside.' }],
    ['regen_serum', 'Regeneration Serum', 'medical', 'regen', 'epic', 40000, { stack: true, regen: 5, regenSeconds: 300, desc: 'Heals 5 life every 5 minutes for an hour.' }],
    ['antidote', 'Antidote', 'medical', 'cure', 'uncommon', 1500, { stack: true, cures: ['poison'], desc: 'Clears toxins.' }],
    ['stimulant', 'Combat Stimulant', 'medical', 'stim', 'rare', 6000, { stack: true, energy: 30, desc: 'Restores 30 energy. Comes with a headache.' }],
    ['painkiller', 'Painkiller', 'medical', 'cure', 'uncommon', 900, { stack: true, cures: ['injury'], desc: 'Dulls injury penalties.' }],

    /* ---------------- BOOSTERS ---------------- */
    ['coffee', 'Coffee', 'booster', 'energy', 'common', 30, { stack: true, energy: 8, desc: 'Dockside sludge. It works.' }],
    ['energy_drink', 'Energy Drink', 'booster', 'energy', 'common', 150, { stack: true, energy: 20, desc: 'Tastes like a battery.' }],
    ['nerve_booster', 'Nerve Tonic', 'booster', 'nerve', 'rare', 5000, { stack: true, nerve: 5, desc: 'A pharmacist in the Undercity owes you.' }],
    ['happy_candy', 'Happy Candy', 'booster', 'happiness', 'common', 400, { stack: true, happiness: 50, desc: 'Cheap, sweet, briefly effective.' }],
    ['flowers', 'Bouquet', 'booster', 'happiness', 'uncommon', 1200, { stack: true, happiness: 100, desc: 'For yourself, if nobody else.' }],

    /* ---------------- DRUGS (abstract game items only) ---------------- */
    ['weed', 'Dockleaf', 'drug', 'recreational', 'common', 300, { stack: true, happiness: 50, addiction: 0.05, duration: 3600, desc: '+50 happiness. Low addiction risk.' }],
    ['cocaine', 'White Chalk', 'drug', 'stimulant', 'rare', 3000, { stack: true, happiness: 100, speedBuff: 0.15, addiction: 0.30, duration: 1800, desc: '+100 happiness and a speed edge. Heavy addiction risk.' }],
    ['stim_pills', 'Focus Tabs', 'drug', 'nootropic', 'rare', 2500, { stack: true, intelligenceBuff: 0.15, addiction: 0.12, duration: 7200, desc: '+15% intelligence for two hours.' }],
    ['steroid', 'Iron Compound', 'drug', 'steroid', 'rare', 5000, { stack: true, strengthBuff: 0.20, addiction: 0.25, duration: 86400, desc: '+20% strength for 24 hours.' }],
    ['opioid', 'Grey Dust', 'drug', 'depressant', 'epic', 4000, { stack: true, happiness: 150, speedBuff: -0.20, addiction: 0.45, overdose: 0.18, duration: 3600, desc: 'Huge happiness, dulled reflexes, real overdose risk.' }],
    ['anxiolytic', 'Calm Caps', 'drug', 'depressant', 'uncommon', 3500, { stack: true, nerveLossReduce: 0.5, addiction: 0.10, duration: 7200, desc: 'Halves nerve loss from failures for two hours.' }],

    /* ---------------- TOOLS ----------------
       `bonusTags` matches crime tags. Carried tools add their bonus to the
       matching crime and may break on use.                              */
    ['gloves', 'Work Gloves', 'tool', 'kit', 'common', 150, { bonusTags: ['stealth'], bonus: 3, breakChance: 0.02, desc: 'No prints, no fuss.' }],
    ['ski_mask', 'Ski Mask', 'tool', 'kit', 'common', 300, { bonusTags: ['street', 'stealth'], bonus: 5, breakChance: 0.02, desc: 'Cotton, anonymous.' }],
    ['burner_phone', 'Burner Phone', 'tool', 'kit', 'common', 500, { bonusTags: ['electronics'], bonus: 5, breakChance: 0.03, desc: 'Untraceable until it is not.' }],
    ['lockpick_set', 'Lockpick Set', 'tool', 'kit', 'uncommon', 2000, { bonusTags: ['lock'], bonus: 8, breakChance: 0.06, desc: 'Ten picks, one tension wrench.' }],
    ['adv_lockpick', 'Advanced Lockpick Set', 'tool', 'kit', 'rare', 15000, { bonusTags: ['lock'], bonus: 15, breakChance: 0.05, desc: 'For the locks that mean business.' }],
    ['police_scanner', 'Police Scanner', 'tool', 'kit', 'rare', 8000, { bonusTags: ['street', 'armed'], bonus: 7, breakChance: 0.03, desc: 'Hear the patrol before it hears you.' }],
    ['signal_jammer', 'Signal Jammer', 'tool', 'kit', 'epic', 25000, { bonusTags: ['electronics'], bonus: 14, breakChance: 0.05, desc: 'Cuts cameras and calls alike.' }],
    ['night_vision', 'Night Vision Rig', 'tool', 'kit', 'rare', 30000, { bonusTags: ['stealth', 'lock'], bonus: 12, breakChance: 0.03, desc: 'The dark stops being a problem.' }],
    ['blueprints', 'Building Blueprints', 'tool', 'kit', 'rare', 20000, { bonusTags: ['lock', 'stealth'], bonus: 10, breakChance: 0.0, desc: 'Know the halls before you walk them.' }],
    ['hacking_device', 'Intrusion Deck', 'tool', 'kit', 'epic', 60000, { bonusTags: ['electronics'], bonus: 18, breakChance: 0.04, desc: 'Hollows-built. Very illegal.' }],
    ['getaway_car', 'Getaway Sedan', 'tool', 'vehicle', 'rare', 50000, { bonusTags: ['vehicle', 'armed'], bonus: 12, breakChance: 0.04, desc: 'Parked two streets over with the engine warm.' }],

    /* ---- CRIMES 2.0 ENHANCERS & SPECIAL TOOLS ---- */
    ['flashlight', 'Heavy Flashlight', 'tool', 'kit', 'common', 450, { bonusTags: ['stealth', 'lock'], bonus: 10, enhancerFor: 'burglary', desc: 'Burglary enhancer. Casts a crisp beam without alerting patrols.' }],
    ['cut_razor', 'Cut-Throat Razor', 'tool', 'kit', 'common', 550, { bonusTags: ['stealth', 'street'], bonus: 10, enhancerFor: 'pickpocket', desc: 'Pickpocket enhancer. Surgical precision for slicing purse straps and pockets.' }],
    ['high_drive', 'High-Speed Drive', 'tool', 'kit', 'uncommon', 3500, { bonusTags: ['electronics'], bonus: 12, enhancerFor: 'bootlegging', desc: 'Bootlegging enhancer. High-speed optical duplication drive for rapid media burning.' }],
    ['duct_tape', 'Reinforced Duct Tape', 'tool', 'kit', 'common', 200, { bonusTags: ['electronics', 'stealth'], bonus: 8, enhancerFor: 'atm_skimming', desc: 'Skimming enhancer. Industrial adhesive that sticks to any ATM casing.' }],
    ['lighter', 'Windproof Lighter', 'tool', 'kit', 'uncommon', 850, { bonusTags: ['street', 'armed'], bonus: 10, enhancerFor: 'arson', desc: 'Arson & sabotage enhancer. Burns reliably in heavy wind and rain.' }],
    ['mountain_bike', 'Mountain Bike', 'tool', 'vehicle', 'uncommon', 1800, { bonusTags: ['vehicle', 'stealth'], bonus: 10, enhancerFor: 'shoplift', desc: 'Shoplifting enhancer. Rapid getaway through narrow vertical alleyways.' }],
    ['jemmy', 'Jemmy Crowbar', 'tool', 'kit', 'common', 700, { bonusTags: ['lock'], bonus: 9, enhancerFor: 'burglary', desc: 'Entry tool. Sturdy pry tool for cracking residential and commercial latches.' }],
    ['skeleton_key', 'Skeleton Key', 'tool', 'kit', 'rare', 8500, { bonusTags: ['lock'], bonus: 14, desc: 'Master key that opens commercial store rooms.' }],
    ['glasses', 'Reading Glasses', 'tool', 'kit', 'common', 250, { bonusTags: ['stealth'], bonus: 10, enhancerFor: 'search_cash', desc: 'Search for Cash enhancer. Sharp focal lenses for spotting lost valuables.' }],
    ['paint_mask', 'Industrial Paint Mask', 'tool', 'kit', 'common', 350, { bonusTags: ['street'], bonus: 10, enhancerFor: 'graffiti', desc: 'Graffiti enhancer. Blocks toxic fumes and conceals identity.' }],
    ['latex_gloves', 'Latex Gloves', 'tool', 'kit', 'common', 150, { bonusTags: ['stealth'], bonus: 10, enhancerFor: 'disposal', desc: 'Disposal enhancer. Sterile chemical protection for handling hazardous waste.' }],
    ['shovel', 'Heavy Trench Shovel', 'tool', 'kit', 'common', 500, { bonusTags: ['street'], bonus: 8, desc: 'Required tool for burying evidence in Disposal operations.' }],
    ['gas_can', 'Jerry Can of Gasoline', 'tool', 'kit', 'common', 250, { bonusTags: ['armed'], bonus: 8, desc: 'Combustible fuel consumed when burning waste in Disposal.' }],
    ['acid', 'Hydrochloric Acid Canister', 'tool', 'kit', 'uncommon', 1200, { bonusTags: ['street'], bonus: 12, desc: 'Corrosive chemical agent consumed when dissolving waste.' }],
    ['office_chair', 'Ergonomic Office Chair', 'tool', 'kit', 'uncommon', 2200, { bonusTags: ['electronics'], bonus: 10, enhancerFor: 'cracking', desc: 'Cracking enhancer. High-comfort posture support for long brute-force sessions.' }],
    ['magnifying_glass', 'Jeweler Magnifying Glass', 'tool', 'kit', 'common', 600, { bonusTags: ['forgery'], bonus: 10, enhancerFor: 'forgery', desc: 'Forgery enhancer. Precision magnification for tracing signatures and seals.' }],
    ['ergo_keyboard', 'Split Ergonomic Keyboard', 'tool', 'kit', 'uncommon', 1800, { bonusTags: ['electronics'], bonus: 10, enhancerFor: 'scamming', desc: 'Scamming enhancer. Rapid-fire typing for parallel social-engineering chats.' }],
    ['window_breaker', 'Spring-Loaded Window Breaker', 'tool', 'kit', 'common', 400, { bonusTags: ['lock'], bonus: 8, desc: 'Entry tool for silently punching through residential windows.' }],
    ['rope', 'Braided Climbing Rope', 'tool', 'kit', 'common', 450, { bonusTags: ['stealth'], bonus: 7, desc: 'Heavy nylon rope for scaling fences and industrial roofs.' }],
    ['credit_card', 'Blank Shimming Card', 'tool', 'kit', 'common', 300, { bonusTags: ['lock'], bonus: 8, desc: 'Flexible acetate card for slipping spring-bolt latches in apartments.' }],
    ['spray_can', 'Black Spray Can', 'tool', 'kit', 'common', 150, { bonusTags: ['street'], bonus: 8, enhancerFor: 'graffiti', desc: 'A pressurized aerosol can of black spray paint used for tagging city sectors in Graffiti operations.' }],
    ['skimmer', 'Card Skimmer', 'tool', 'kit', 'uncommon', 1500, { bonusTags: ['electronics'], bonus: 12, enhancerFor: 'card_skimming', desc: 'An illicit magnetic card reader device attached to ATMs during Card Skimming.' }],
    ['blank_cards', 'Blank Plastic Cards', 'misc', 'material', 'common', 80, { desc: 'Unencoded plastic magnetic stripe cards used for producing counterfeit cards and skimming data.' }],
    ['blank_dvds', 'Blank Spindle of DVDs', 'misc', 'material', 'common', 150, { desc: 'A spool of writeable blank discs used for burning bootleg software and media.' }],
    ['dvd', 'Bootleg Media DVD', 'misc', 'media', 'common', 250, { desc: 'A burned disc packed with pirated media and software ready for street distribution.' }],
    ['cpu', 'High-Performance CPU', 'misc', 'hardware', 'rare', 8500, { desc: 'A multi-core computing processor used for upgrading distributed Cracking rigs.' }],
    ['cooling', 'Water Cooling Rig', 'misc', 'hardware', 'uncommon', 2400, { desc: 'A liquid heatsink assembly to keep distributed Cracking rigs from overheating.' }],
    ['wheelbarrow', 'Heavy Wheelbarrow', 'tool', 'kit', 'common', 650, { bonusTags: ['street'], bonus: 6, desc: 'A reinforced hauler required for moving building debris in Disposal operations.' }],
    ['disposable_mask', 'Disposable Protective Mask', 'misc', 'material', 'common', 50, { desc: 'A surgical grade filter mask required when transporting biological waste in Disposal.' }],
    ['megaphone', 'Bullhorn Megaphone', 'tool', 'kit', 'common', 450, { bonusTags: ['street'], bonus: 10, enhancerFor: 'hustling', desc: 'Hustling enhancer. Amplifies your pitch across noisy boardwalks to draw crowds.' }],
    ['wire_cutters', 'Heavy Wire Cutters', 'tool', 'kit', 'common', 300, { bonusTags: ['lock'], bonus: 7, desc: 'Hardened steel shears for severing perimeter security fences and padlocks.' }],
    ['fishing_rod', 'Carbon Fishing Rod', 'misc', 'trinket', 'uncommon', 750, { desc: 'A collapsible graphite fishing rod recovered while searching the beach.' }],
    ['lucky_quarter', 'Lucky Silver Quarter', 'misc', 'trinket', 'rare', 1200, { desc: 'An antique minted coin fished from the municipal fountain. Feels heavy.' }],
    ['silver_bead', 'Ancient Silver Bead', 'misc', 'trinket', 'rare', 3500, { desc: 'A hand-hammered ornate silver bead uncovered from coastal sands.' }],
    ['golden_wreath', 'Golden Laurel Wreath', 'misc', 'trinket', 'epic', 45000, { desc: 'A stunning gold ceremonial laurel wreath unearthed from an ancient cemetery plot.' }],

    /* ---- ADDITIONAL RESEARCHED DRUGS & MEDICAL ---- */
    ['xanax', 'Xanax Strip', 'drug', 'pharm', 'uncommon', 8500, { energy: 250, happiness: -150, cooldown: 28800, overdose: 0.025, desc: 'The premiere illicit energy pill. Massive burst of 250 energy, at the expense of composure.' }],
    ['ecstasy', 'Ecstasy Tab', 'drug', 'street', 'uncommon', 3200, { happiness: 100, cooldown: 14400, overdose: 0.02, desc: 'Euphoric tablet that floods the central nervous system with raw happiness.' }],
    ['ketamine', 'Ketamine Vial', 'drug', 'pharm', 'uncommon', 4200, { buff: { stat: 'defense', mult: 1.15 }, cooldown: 18000, overdose: 0.02, desc: 'Dissociative anesthetic. Dulls nerve endings and boosts defense.' }],
    ['speed', 'Speed Ampoule', 'drug', 'street', 'common', 1800, { buff: { stat: 'speed', mult: 1.15 }, cooldown: 14400, overdose: 0.03, desc: 'Powerful central nervous system stimulant that hyper-charges motor speed.' }],
    ['pcp', 'PCP Vial', 'drug', 'street', 'uncommon', 2500, { buff: { stat: 'strength', mult: 1.20 }, cooldown: 18000, overdose: 0.035, desc: 'Phencyclidine. Induces adrenaline rushes that dramatically surge physical strength.' }],
    ['opium', 'Raw Opium Gum', 'drug', 'narcotic', 'uncommon', 3500, { heal: 40, happiness: 50, cooldown: 14400, overdose: 0.03, desc: 'Natural poppy resin. Relieves physical trauma and calms frayed nerves.' }],
    ['morphine', 'Morphine Ampoule', 'medical', 'injectable', 'uncommon', 2000, { heal: 50, cooldown: 7200, desc: 'Hospital-grade injectable painkiller that restores a substantial chunk of physical health.' }],
    ['blood_bag', 'Empty Blood Bag', 'medical', 'kit', 'common', 800, { heal: 30, cooldown: 3600, desc: 'Sterilized medical bag for blood volume expansion and rapid stabilization.' }],
    ['beer', 'Bottle of Chilled Beer', 'booster', 'alcohol', 'common', 350, { nerve: 2, cooldown: 3600, desc: 'A crisp fermented brew that soothes the nerves and grants +2 Nerve.' }],
    ['candy', 'Bag of Candy Kisses', 'booster', 'candy', 'common', 150, { happiness: 25, cooldown: 1800, desc: 'Sweet chocolate confections that grant a quick burst of +25 happiness.' }],

    /* ---- UNIQUE CRIME OUTCOMES & COLLECTIBLES ---- */
    ['gold_tooth', 'Gold Tooth', 'misc', 'trinket', 'uncommon', 1200, { desc: 'A curious dental curiosity recovered during burglary.' }],
    ['persian_rug', 'Antique Persian Rug', 'misc', 'trinket', 'rare', 18500, { desc: 'Exquisite silk and wool rug lifted from a luxury penthouse.' }],
    ['rare_stamp', 'Rare Postage Stamp', 'misc', 'trinket', 'rare', 9500, { desc: 'A pristine collector stamp recovered from a postal depot.' }],
    ['police_badge', 'Police Officer Badge', 'misc', 'trinket', 'rare', 25000, { desc: 'An authentic police shield lifted from a running patrolman.' }],
    ['high_heels', 'Designer High Heels', 'misc', 'trinket', 'uncommon', 3200, { desc: 'Red-bottom Italian heels lifted from a distracted classy lady.' }],
    ['thong', 'Silk Thong', 'misc', 'trinket', 'common', 800, { desc: 'Lace lingerie lifted from a soliciting sex worker.' }],
    ['tootsie_rolls', 'Bag of Tootsie Rolls', 'misc', 'candy', 'common', 250, { desc: 'Sweet candy lifted from an elderly pedestrian.' }],
    ['pumpkin_brew', 'Bottle of Pumpkin Brew', 'misc', 'alcohol', 'uncommon', 1500, { desc: 'Seasonal craft beer lifted from a celebratory drunk woman.' }],
    ['crocozade', 'Can of Crocozade', 'misc', 'booster', 'uncommon', 2000, { desc: 'Electrolyte sports drink lifted from a park jogger.' }],
    ['chandelier', 'Crystal Chandelier', 'misc', 'trinket', 'epic', 55000, { desc: 'Ornate crystal chandelier dismantled from a manor ballroom.' }],
    ['claymore_mine', 'Antique Claymore Mine', 'weapon', 'secondary', 'rare', 35000, { dmg: 65, desc: 'Deactivated military mine recovered from a mobile home.' }],
    ['yasukuni_sword', 'Yasukuni Ceremonial Sword', 'weapon', 'melee', 'epic', 85000, { dmg: 75, desc: 'Historic folded steel blade looted from a foundry executive suite.' }],
    ['tumble_dryer', 'Commercial Tumble Dryer', 'misc', 'trinket', 'uncommon', 4500, { desc: 'Heavy laundry machinery hauled from a cleaning agency.' }],

    /* ---------------- VEHICLES (obtained from Car Theft) ---------------- */
    ['veh_sedan', 'Sedan', 'vehicle', 'car', 'common', 20000, { speed: 40, desc: 'A stolen sedan. Unremarkable.' }],
    ['veh_coupe', 'Coupe', 'vehicle', 'car', 'uncommon', 45000, { speed: 55, desc: 'A stolen coupe.' }],
    ['veh_sports', 'Sports Car', 'vehicle', 'car', 'rare', 200000, { speed: 80, desc: 'A stolen sports car. Very loud.' }],
    ['veh_supercar', 'Supercar', 'vehicle', 'car', 'epic', 1000000, { speed: 110, desc: 'A stolen supercar. Somebody is furious.' }],

    /* ---------------- MISC ---------------- */
    ['suitcase', 'Suitcase', 'misc', 'travel', 'common', 3000, { capacity: 5, desc: 'Adds carry capacity on trips abroad.' }],
    ['lucky_charm', 'Tarnished Charm', 'misc', 'trinket', 'uncommon', 2500, { desc: 'Found on the Abandoned Pier. Feels lucky.' }]
  ];

  var items = {};

  DEFS.forEach(function (d) {
    var id = d[0];
    var it = {
      id: id,
      name: d[1],
      cat: d[2],
      sub: d[3],
      rarity: d[4],
      price: d[5],
      /* Sell value is 40% of shop price unless the tuple overrides it. */
      sell: Math.max(1, Math.round(d[5] * 0.4)),
      stack: false
    };
    var extra = d[6] || {};
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) it[k] = extra[k];
    if (it.dmg != null || it.def != null) it.stack = false;
    items[id] = it;
  });

  items.fists.sell = 0;

  C.data = C.data || {};
  C.data.items = items;

  C.data.rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

  C.data.itemCategories = [
    { id: 'weapon', label: 'Weapons' },
    { id: 'armour', label: 'Armour' },
    { id: 'ammo', label: 'Ammunition' },
    { id: 'medical', label: 'Medical' },
    { id: 'booster', label: 'Boosters' },
    { id: 'drug', label: 'Recreational' },
    { id: 'tool', label: 'Tools' },
    { id: 'vehicle', label: 'Vehicles' },
    { id: 'explosive', label: 'Explosives' },
    { id: 'misc', label: 'Miscellaneous' }
  ];
})(window.CALIGO);
