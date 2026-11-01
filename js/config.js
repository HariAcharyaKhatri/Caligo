/* CALIGO — all tunables. Version bumped to 3 for Phase 3. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = {};

  cfg.SAVE_KEY = 'caligo.save';
  cfg.SAVE_VERSION = 4;
  cfg.TICK_MS = 1000;
  cfg.AUTOSAVE_SECONDS = 5;
  cfg.OFFLINE_CAP_HOURS = 8;

  cfg.REGEN = { energy: 300, nerve: 300, life: 90, wanted: 1800 };
  cfg.HAPPINESS_DECAY_SECONDS = 60;

  cfg.START = {
    cash: 2500, bank: 0, energy: 100, nerve: 18, happiness: 100, life: 100, wanted: 0,
    stats: { strength: 10, defense: 10, speed: 10, dexterity: 10, intelligence: 10 }
  };

  cfg.LEVEL = {
    xpBase: 50, xpExp: 1.6,
    baseEnergy: 100, baseNerve: 15, baseHappiness: 100, baseLife: 100,
    energyPerLevel: 5, nervePerLevel: 1, nerveEveryLevels: 2,
    happinessPerLevel: 2, lifePerLevel: 10
  };

  cfg.HIDDEN_NERVE = { step: 5, base: 25, exp: 1.9, maxTiers: 12 };
  cfg.CRIME_LEVEL = { xpBase: 30, xpExp: 1.6 };
  cfg.CRIME_LEVEL_NAMES = [
    'Street Rat', 'Petty Thief', 'Small-time Crook', 'Burglar', 'Robber',
    'Heist Rookie', 'Fraudster', 'Hacker', 'Smuggler', 'Extortionist',
    'Arsonist', 'Ransom Broker', 'Home Invader', 'Jewel Thief', 'Bank Robber',
    'Master Thief', 'Yacht Thief', 'Casino Robber', 'Prison Breaker', 'Legend'
  ];

  cfg.CRIME = {
    minChance: 0.05, maxChance: 0.95,
    statSoft: 800, statMaxBonus: 25,
    clBonusPerLevel: 1.5, clBonusCap: 15,
    happyDivisor: 20, happyCap: 10,
    wantedPerPoint: 0.75, wantedCap: 30,
    rewardSkew: 2.5, toolBonusCap: 20,
    failWantedMultiplier: 2, failHappinessLoss: 12,
    critFailChance: 0.06,
    finePerWanted: 250, bailPerMinute: 120, bailMin: 500
  };

  cfg.GYM = {
    energyCost: 10, baseGain: 1.10, variance: 0.35,
    softCap: 15000, happinessDivisor: 200, happinessFloor: 0.5,
    happinessCost: 1, xp: 3
  };

  cfg.JAIL = { timeScale: 1 };
  cfg.DAILY = { cooldown: 24 * 3600, cash: [1000, 2500, 5000, 10000, 20000, 35000, 50000], itemDay: 7 };
  cfg.AVATARS = ['◈', '☰', '⌖', '⚑', '☍', '⌁', '⟁', '☘', '✕', '⌘'];

  cfg.BOTS = {
    rosterSize: 40,
    statGrowthPerHour: 0.005,
    levelUpPerHour: 0.001,
    hospitalMinutes: [8, 40],
    activityRefreshChance: 0.1
  };

  cfg.COMBAT = {
    energyCost: 18,
    powerWeights: { strength: 1.5, defense: 1.0, speed: 1.2, dexterity: 1.3 },
    baseHitChance: 0.68,
    damageFraction: 0.11,
    defenceSoften: 220,
    damageVariance: 0.25,
    minDamage: 1,
    mugShare: 0.35,
    hospitalMinutes: [10, 45],
    xpPerWin: 12, xpPerLoss: 4,
    moves: {
      basic:{label:'Basic attack',hit:0,dmg:1.00,cost:0},
      power:{label:'Power attack',hit:-0.20,dmg:1.55,cost:0},
      quick:{label:'Quick attack',hit:0.15,dmg:0.70,cost:0},
      aimed:{label:'Aimed attack',hit:-0.10,dmg:1.25,cost:0},
      wild:{label:'Wild swing',hit:0.10,dmg:0.60,cost:0},
      block:{label:'Block',hit:0,dmg:0,cost:0,incoming:0.40},
      dodge:{label:'Dodge',hit:0,dmg:0,cost:0,incoming:0.55,evade:0.45},
      disarm:{label:'Disarm',hit:-0.25,dmg:0.30,cost:0,special:'disarm'},
      run:{label:'Run for it',hit:0,dmg:0,cost:0,special:'escape'}
    }
  };

  cfg.MARKET = {
    salesTax: 0.05,
    maxListings: 5,
    targetListingCount: 30,
    refreshMinutes: 60,
    priceSpread: 0.35,
    playerListingExpiryHours: 48,
    saleTickMinutes: 30,
    sellChanceAtMarket: 0.25,
    sellChanceAtHalf: 0.55,
    sellChanceAtDouble: 0.05
  };

  cfg.BANK = {
    savingsRatePerDay: 0.0015,
    deposits: [
      { id: 'd7', label: '7-day note', days: 7, rate: 0.02 },
      { id: 'd30', label: '30-day note', days: 30, rate: 0.05 },
      { id: 'd90', label: '90-day note', days: 90, rate: 0.10 }
    ],
    loans: [
      { id: 'l10k',  label: 'Small loan',   amount: 10000,    rate: 0.05, days: 7 },
      { id: 'l100k', label: 'Business loan', amount: 100000,  rate: 0.10, days: 14 },
      { id: 'l1m',   label: 'Large loan',   amount: 1000000,  rate: 0.15, days: 30 },
      { id: 'l10m',  label: 'Major loan',   amount: 10000000, rate: 0.25, days: 60 }
    ]
  };

  cfg.TRAVEL = {
    platforms: {
      docks:     { cost: 0,    minutes: 0 },
      exchange:  { cost: 500,  minutes: 30 },
      undercity: { cost: 1000, minutes: 60 },
      spire:     { cost: 2000, minutes: 120 },
      hollows:   { cost: 5000, minutes: 240 }
    }
  };

  /* ============ PHASE 3 ============ */

  cfg.JOBS = {
    /* Each game day of work adds one "work day". Paycheck accrues and is
       collected manually. Promotion needs both days and stat minimums. */
    energyPerShift: 5,
    happinessLossPerShift: 2,
    workXpPerShift: 1
  };

  cfg.EDUCATION = {
    /* One course at a time. Course hours are game hours. */
    concurrentCourses: 1,
    /* Course completion time uses game time so time scale affects it. */
  };

  cfg.COMPANIES = {
    /* Companies pay out on demand: collect accrued profit since last
       collection. Daily income minus daily costs, capped at 7 days. */
    maxCollectDays: 7,
    foundingFeeMultiplier: 1.0
  };

  cfg.FACTIONS = {
    /* Bot factions declare war. Player can join a faction or found one. */
    warDurationHours: 48,
    chainTimeoutMinutes: 30,          // each hit resets chain timer
    chainMilestones: [10, 25, 50, 100],
    chainBonusRespect: [50, 150, 500, 1500],
    respectPerHit: 5,
    /* The player joins one of six factions with bot members. */
    botMemberCount: [12, 20]
  };

  cfg.TERRITORIES = {
    /* Each territory pays daily income to whoever holds it. */
    count: 8,
    dailyIncome: [5000, 80000],
    defenseBase: 100
  };

  cfg.CASINO = {
    houseEdge: 0.02,
    dailyTokens: 75,     // free tokens each real day
    minBet: 100,
    maxBet: 1000000
  };

  cfg.MISSIONS = {
    daily: ['pickpocket_5', 'fight_3', 'stock_1', 'train_5'],
    weekly: ['crimes_50', 'fights_25', 'earn_1m', 'property_1'],
  };

  /* ============ PHASE 4 MERITS CONFIG ============ */
  cfg.MERITS = {
    categories: {
      sharpness:   { id: 'sharpness',   name: 'Sharpness',           desc: 'Increases passive Speed by +1% per upgrade.', max: 10, bonusPerTier: 0.01, stat: 'speed' },
      brawn:       { id: 'brawn',       name: 'Brawn',               desc: 'Increases passive Strength by +1% per upgrade.', max: 10, bonusPerTier: 0.01, stat: 'strength' },
      protection:  { id: 'protection',  name: 'Protection',          desc: 'Increases passive Defense by +1% per upgrade.', max: 10, bonusPerTier: 0.01, stat: 'defense' },
      evasion:     { id: 'evasion',     name: 'Evasion',             desc: 'Increases passive Dexterity by +1% per upgrade.', max: 10, bonusPerTier: 0.01, stat: 'dexterity' },
      crit:        { id: 'crit',        name: 'Critical Hit Rate',    desc: 'Increases critical strike chance by +1% per upgrade.', max: 10, bonusPerTier: 0.01 },
      nerve_bar:   { id: 'nerve_bar',   name: 'Natural Nerve Bar',   desc: 'Increases natural maximum nerve bar by +1 per upgrade.', max: 10, bonusPerTier: 1 },
      ce:          { id: 'ce',          name: 'Crime Experience',     desc: 'Increases Crime Experience & crime skill gain by +3% per upgrade.', max: 10, bonusPerTier: 0.03 },
      edu:         { id: 'edu',         name: 'Education Efficiency', desc: 'Reduces course completion duration by −2% per upgrade.', max: 10, bonusPerTier: 0.02 },
      bank:        { id: 'bank',        name: 'Bank Investment APR',  desc: 'Increases bank savings & deposit interest rates by +5% per upgrade.', max: 10, bonusPerTier: 0.05 },
      mug:         { id: 'mug',         name: 'Masterful Looting',    desc: 'Increases mug cash payout after combat victory by +5% per upgrade.', max: 10, bonusPerTier: 0.05 },
      life:        { id: 'life',        name: 'Fortitude',           desc: 'Increases maximum life capacity by +3% per upgrade.', max: 10, bonusPerTier: 0.03 }
    }
  };

  C.config = cfg;
})(window.CALIGO);
