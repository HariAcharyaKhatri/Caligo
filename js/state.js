/* CALIGO — save shape and every derived rule that reads from it. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var U = C.util;
  var S = {};

  S.newSave = function (name, avatar) {
    var now = Date.now();
    return {
      version: cfg.SAVE_VERSION,
      meta: { created: now, gameTime: 0, lastReal: now, name: name, avatar: avatar },
      player: {
        name: name, avatar: avatar,
        level: 1, xp: 0, crimeLevel: 1, crimeXp: 0,
        hiddenCrimeXp: 0, hiddenNerveTier: 0,
        cash: cfg.START.cash, bank: cfg.START.bank,
        stats: {
          strength: cfg.START.stats.strength, defense: cfg.START.stats.defense,
          speed: cfg.START.stats.speed, dexterity: cfg.START.stats.dexterity,
          intelligence: cfg.START.stats.intelligence
        },
        /* Job-related stats */
        work: { manual: 0, intelligence: 0, endurance: 0 },
        life: cfg.START.life, happiness: cfg.START.happiness,
        energy: cfg.START.energy, nerve: cfg.START.nerve,
        wanted: cfg.START.wanted,
        jailUntil: 0, hospitalUntil: 0,
        equipped: { weapon: null, armour: null },
        acc: { energy: 0, nerve: 0, life: 0, wanted: 0, happyOver: 0 },
        cooldowns: { drug: 0, booster: 0, medical: 0 },
        buffs: {},
        location: 'docks', abroad: null, travelUntil: 0, travelTo: null, travelFrom: null,
        /* Merits the player has earned from awards. */
        merits: 0, meritsSpent: 0,
        points: 0
      },
      inventory: [
        { id: 'knife', qty: 1 },
        { id: 'leather_jacket', qty: 1 },
        { id: 'bandage', qty: 3 }
      ],
      gyms: { memberships: {} },
      daily: { last: 0, streak: 0 },
      weather: { id: 'clear', dayKey: '' },
      log: [],
      settings: {
        timeScale: 1, theme: 'noir', textSize: 'normal',
        confirmExpensive: true, sound: false
      },
      counters: {
        crimes: 0, crimesOk: 0, crimesFail: 0,
        trains: 0, jailed: 0, hosp: 0, itemsUsed: 0, itemsBought: 0,
        fightsWon: 0, fightsLost: 0, fightsFled: 0, botsHospitalised: 0,
        marketBuys: 0, marketSells: 0, flightsTaken: 0,
        works: 0, coursesCompleted: 0, spends: 0, jobsQuit: 0
      },
      flags: { platform: 'docks' },
      bots: [],
      bank: { savings: 0, loans: [], deposits: [], savingsAccruedAt: 0 },
      market: { listings: [], playerListings: [], lastRefresh: 0, lastSaleTick: 0 },
      combat: null,
      /* ---- Phase 3 ---- */
      job: { current: null, rank: 0, workDays: 0, payAccrued: 0, lastWorked: 0, totalDays: 0 },
      education: { active: null, completed: [], startedAt: 0 },
      companies: { owned: null },
      faction: { id: null, role: null, joinedAt: 0, war: null, chain: 0, chainExpires: 0, respect: 0 },
      territories: {},   // id -> owner faction id
      casino: { tokens: 0, tokensClaimedAt: 0, betsToday: 0, netWon: 0, streak: 0 },
      missions: { story: 0, daily: {}, dailyClaimed: {}, storyClaimed: [] },
      lists: { friends: [], enemies: [], targets: [] },
      mail: [],
      events: []
    };
  };

  /* ---- Caps ---------------------------------------------------------- */
  S.maxEnergy = function (p) { return cfg.LEVEL.baseEnergy + (p.level - 1) * cfg.LEVEL.energyPerLevel; };
  S.maxNerve = function (p) {
    var lv = Math.floor((p.level - 1) / cfg.LEVEL.nerveEveryLevels) * cfg.LEVEL.nervePerLevel;
    var hd = (p.hiddenNerveTier || 0) * cfg.HIDDEN_NERVE.step;
    return cfg.LEVEL.baseNerve + lv + hd;
  };
  S.maxHappiness = function (p) { return cfg.LEVEL.baseHappiness + (p.level - 1) * cfg.LEVEL.happinessPerLevel; };
  S.maxLife = function (p) { return cfg.LEVEL.baseLife + (p.level - 1) * cfg.LEVEL.lifePerLevel; };

  S.xpToNext = function (level) { return Math.round(cfg.LEVEL.xpBase * Math.pow(level, cfg.LEVEL.xpExp)); };
  S.crimeXpToNext = function (cl) { return Math.round(cfg.CRIME_LEVEL.xpBase * Math.pow(cl, cfg.CRIME_LEVEL.xpExp)); };
  S.hiddenThreshold = function (k) { return Math.round(cfg.HIDDEN_NERVE.base * Math.pow(k, cfg.HIDDEN_NERVE.exp)); };
  S.hiddenTiersFor = function (xp) {
    var n = 0;
    for (var k = 1; k <= cfg.HIDDEN_NERVE.maxTiers; k++) {
      if (xp >= S.hiddenThreshold(k)) n = k; else break;
    }
    return n;
  };
  S.crimeLevelName = function (cl) {
    var n = cfg.CRIME_LEVEL_NAMES;
    return n[Math.min(cl, n.length) - 1] || n[n.length - 1];
  };

  /* ---- Location ------------------------------------------------------ */
  S.platformId = function (save) { return save.player.location || 'docks'; };
  S.platformName = function (save) {
    save = save || C.state.save;
    if (!save) return 'The Docks';
    if (save.player.abroad) {
      var d = C.data.destById[save.player.abroad];
      return d ? d.name : 'Abroad';
    }
    var p = C.data.platforms[save.player.location || 'docks'];
    return p ? p.name : 'The Docks';
  };
  S.inTransit = function (save) { return (save.player.travelUntil || 0) > save.meta.gameTime; };
  S.transitLeft = function (save) { return Math.max(0, (save.player.travelUntil || 0) - save.meta.gameTime); };
  S.abroad = function (save) { return !!save.player.abroad; };
  S.canAct = function (save) { return !S.isJailed(save) && !S.isHospital(save) && !S.inTransit(save); };
  S.canCrime = function (save) { return S.canAct(save) && !S.abroad(save); };

  /* ---- Custody ------------------------------------------------------- */
  S.isJailed = function (save) { return save.player.jailUntil > save.meta.gameTime; };
  S.isHospital = function (save) { return save.player.hospitalUntil > save.meta.gameTime; };
  S.jailLeft = function (save) { return Math.max(0, save.player.jailUntil - save.meta.gameTime); };
  S.hospitalLeft = function (save) { return Math.max(0, save.player.hospitalUntil - save.meta.gameTime); };
  S.busy = function (save) { return S.isJailed(save) || S.isHospital(save); };

  S.cooldownLeft = function (save, key) {
    return Math.max(0, (save.player.cooldowns[key] || 0) - save.meta.gameTime);
  };

  /* ---- Inventory ----------------------------------------------------- */
  S.itemQty = function (save, id) {
    for (var i = 0; i < save.inventory.length; i++) {
      if (save.inventory[i].id === id) return save.inventory[i].qty;
    }
    return 0;
  };
  S.ownsItem = function (save, id) { return S.itemQty(save, id) > 0; };
  S.totalCarry = function (save) {
    var cap = 10;
    save.inventory.forEach(function (st) {
      var it = C.data.items[st.id];
      if (it && it.capacity) cap += it.capacity * st.qty;
    });
    return cap;
  };
  S.hasMembership = function (save, gymId) {
    return (save.gyms.memberships[gymId] || 0) > save.meta.gameTime;
  };

  S.toolBonusFor = function (save, crime) {
    var total = 0, used = [];
    save.inventory.forEach(function (stack) {
      var it = C.data.items[stack.id];
      if (!it || !it.bonusTags || stack.qty <= 0) return;
      var match = it.bonusTags.some(function (t) { return crime.tags.indexOf(t) !== -1; });
      if (!match) return;
      total += it.bonus || 0;
      used.push(stack.id);
    });
    return { total: Math.min(cfg.CRIME.toolBonusCap, total), items: used };
  };

  S.equippedWeapon = function (save) { var id = save.player.equipped.weapon; return id ? C.data.items[id] : null; };
  S.equippedArmour = function (save) { var id = save.player.equipped.armour; return id ? C.data.items[id] : null; };
  S.playerPower = function (save) {
    var p = save.player, w = cfg.COMBAT.powerWeights, s = p.stats;
    var base = s.strength * w.strength + s.defense * w.defense + s.speed * w.speed + s.dexterity * w.dexterity;
    var wp = S.equippedWeapon(save), ar = S.equippedArmour(save);
    return base + (wp ? (wp.dmg || 0) : 0) + (ar ? (ar.def || 0) * 0.5 : 0);
  };
  S.playerDefence = function (save) {
    var ar = S.equippedArmour(save);
    return save.player.stats.defense + (ar ? (ar.def || 0) : 0);
  };

  /* ---- Bank helpers -------------------------------------------------- */
  S.totalDebt = function (save) {
    var sum = 0;
    save.bank.loans.forEach(function (l) { sum += l.owed; });
    return sum;
  };
  S.netWorth = function (save) {
    var comp = save.companies.owned ? C.data.companies.filter(function (c) { return c.id === save.companies.owned; })[0] : null;
    var compVal = comp ? comp.cost * 0.7 : 0;
    return save.player.cash + save.player.bank + save.bank.savings - S.totalDebt(save) + compVal;
  };

  /* ---- Market helpers ------------------------------------------------ */
  S.marketAverage = function (save, itemId) {
    var sum = 0, n = 0;
    save.market.listings.forEach(function (l) {
      if (l.itemId === itemId) { sum += l.price; n++; }
    });
    if (!n) {
      var it = C.data.items[itemId];
      return it ? it.price : 0;
    }
    return sum / n;
  };

  /* ---- Faction helpers ----------------------------------------------- */
  S.faction = function (save) {
    if (!save.faction.id) return null;
    return C.data.factions.filter(function (f) { return f.id === save.faction.id; })[0] || null;
  };
  S.inFaction = function (save) { return !!save.faction.id; };

  /* ---- Company helpers ----------------------------------------------- */
  S.company = function (save) {
    if (!save.companies.owned) return null;
    return C.data.companies.filter(function (c) { return c.id === save.companies.owned; })[0] || null;
  };

  /* ---- Job helpers --------------------------------------------------- */
  S.currentJob = function (save) {
    if (!save.job.current) return null;
    return C.data.jobs.filter(function (j) { return j.id === save.job.current; })[0] || null;
  };
  S.jobRank = function (save) {
    var j = S.currentJob(save);
    if (!j) return null;
    return j.ranks[save.job.rank] || j.ranks[j.ranks.length - 1];
  };

  /* ---- Education helpers --------------------------------------------- */
  S.courseById = function (id) { return C.data.eduCourses[id]; };
  S.courseCompleted = function (save, id) { return save.education.completed.indexOf(id) !== -1; };
  S.canTakeCourse = function (save, id) {
    var c = S.courseById(id);
    if (!c) return { ok: false, reason: 'Unknown course.' };
    if (S.courseCompleted(save, id)) return { ok: false, reason: 'Already completed.' };
    if (save.education.active) return { ok: false, reason: 'Already taking a course.' };
    if (c.prereq !== 'none' && !S.courseCompleted(save, c.prereq)) return { ok: false, reason: 'Prerequisite not met.' };
    if (save.player.cash < c.cost) return { ok: false, reason: 'Not enough cash.' };
    return { ok: true };
  };

  S.dayKey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  C.state = S;
})(window.CALIGO);
