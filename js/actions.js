/* CALIGO — THE GAME ACTIONS LAYER.
   Screens call these functions and nothing else. They never touch the
   save directly, so a real server can replace this whole file later.     */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var U = C.util;
  var S = C.state;
  var A = {};

  /* ---- INTERNAL HELPERS ------------------------------------------------ */
  function save() { return C.state.save; }

  function log(text, kind) {
    var sv = save();
    sv.log.unshift({ t: sv.meta.gameTime, text: text, kind: kind || 'info' });
    if (sv.log.length > 80) sv.log.length = 80;
    return text;
  }
  A.log = log;

  function has(id, qty) { return S.itemQty(save(), id) >= (qty || 1); }

  function addItem(id, qty) {
    qty = qty || 1;
    var sv = save();
    var it = C.data.items[id];
    if (!it) return;
    for (var i = 0; i < sv.inventory.length; i++) {
      if (sv.inventory[i].id === id) {
        if (it.stack) { sv.inventory[i].qty += qty; return; }
        /* non-stackable duplicates are kept as separate stacks */
        sv.inventory.push({ id: id, qty: qty });
        return;
      }
    }
    sv.inventory.push({ id: id, qty: qty });
  }
  A.addItem = addItem;

  function removeItem(id, qty) {
    qty = qty || 1;
    var sv = save();
    for (var i = 0; i < sv.inventory.length; i++) {
      if (sv.inventory[i].id !== id) continue;
      sv.inventory[i].qty -= qty;
      if (sv.inventory[i].qty <= 0) {
        sv.inventory.splice(i, 1);
        /* unequip if we just lost the last copy */
        if (sv.player.equipped.weapon === id && S.itemQty(sv, id) === 0) sv.player.equipped.weapon = null;
        if (sv.player.equipped.armour === id && S.itemQty(sv, id) === 0) sv.player.equipped.armour = null;
      }
      return true;
    }
    return false;
  }

  function giveCash(amount, reason) {
    var sv = save();
    amount = Math.round(amount);
    sv.player.cash += amount;
    if (amount > 0 && C.audio && C.audio.play) C.audio.play('cash');
    if (reason) log(reason, 'money');
    return amount;
  }

  function takeCash(amount) {
    var sv = save();
    amount = Math.round(amount);
    if (sv.player.cash < amount) return false;
    sv.player.cash -= amount;
    return true;
  }
  A.takeCash = takeCash;

  /* ---- LEVELS ----------------------------------------------------------
     Level ups refill energy, nerve and life and raise every cap.         */
  function grantXp(amount) {
    var sv = save();
    var p = sv.player;
    p.xp += amount;
    var levelled = 0;
    while (p.xp >= S.xpToNext(p.level) && p.level < 200) {
      p.xp -= S.xpToNext(p.level);
      p.level++;
      levelled++;
    }
    if (levelled > 0) {
      p.energy = S.maxEnergy(p);
      p.nerve = S.maxNerve(p);
      p.life = S.maxLife(p);
      p.acc.energy = 0; p.acc.nerve = 0; p.acc.life = 0;
      if (C.audio && C.audio.play) C.audio.play('levelUp');
      log('LEVEL UP — you are now level ' + p.level + '. Every bar refilled.', 'good');
    }
    return levelled;
  }

  /* Crime XP is tracked separately from player XP. */
  function grantCrimeXp(amount) {
    var sv = save();
    var p = sv.player;
    p.crimeXp += amount;
    var ups = 0;
    while (p.crimeXp >= S.crimeXpToNext(p.crimeLevel) && p.crimeLevel < 20) {
      p.crimeXp -= S.crimeXpToNext(p.crimeLevel);
      p.crimeLevel++;
      ups++;
    }
    if (ups > 0) {
      log('Your reputation on the street shifts. Crime level ' + p.crimeLevel +
          ' — ' + S.crimeLevelName(p.crimeLevel) + '.', 'good');
    }
  }

  /* Hidden counter: raises MAX NERVE in secret steps. The player is only
     ever told that their nerve bar grew. */
  function grantHiddenCrimeXp(amount) {
    var sv = save();
    var p = sv.player;
    p.hiddenCrimeXp += amount;
    var tiers = S.hiddenTiersFor(p.hiddenCrimeXp);
    if (tiers > (p.hiddenNerveTier || 0)) {
      var gained = tiers - (p.hiddenNerveTier || 0);
      p.hiddenNerveTier = tiers;
      log('Something in you settles. Your nerve bar is bigger than it was. (+' +
          (gained * cfg.HIDDEN_NERVE.step) + ' max nerve)', 'good');
    }
  }

  /* ---- CHARACTER CREATION ---------------------------------------------- */
  A.createCharacter = function (name, avatar) {
    name = (name || '').trim().slice(0, 20) || 'Nameless';
    C.state.save = S.newSave(name, avatar || cfg.AVATARS[0]);
    if (C.bots && C.bots.generateRoster && cfg.BOTS) {
      C.state.save.bots = C.bots.generateRoster(cfg.BOTS.rosterSize);
    }
    if (A.refreshMarket) {
      A.refreshMarket(true);
    }
    log('You step off the ferry at The Docks with ' + U.money(cfg.START.cash) +
        ' and a knife you did not buy.', 'info');
    C.storage.write(C.state.save);
    return C.state.save;
  };

  /* ---- CRIME TARGETS ----------------------------------------------------
     Rolls a fresh set of candidate targets for a crime. Each trait adds
     percentage points; the wealth tier multiplies the payout.            */
  A.rollTargets = function (crimeId, count) {
    var crime = C.data.crimeById[crimeId];
    if (!crime) return [];
    count = count || 4;
    var out = [];
    for (var i = 0; i < count; i++) out.push(rollTarget(crime));
    return out;
  };

  function rollTarget(crime) {
    var pool = C.data.targetPools[crime.target] || C.data.targetPools.person;
    var traits = [];
    var modTotal = 0;
    var rewardMod = 1;

    pool.forEach(function (group) {
      var opt = U.pickWeighted(group.options);
      traits.push({ group: group.label, label: opt.label, mod: opt.mod });
      modTotal += opt.mod;
      if (opt.rewardMod) rewardMod *= opt.rewardMod;
      if (!crime._vehItem && opt.vehItem) crime._vehItem = opt.vehItem;
      if (opt.vehItem) crime._rolledVeh = opt.vehItem;
    });

    /* Global conditions: real-clock time of day and today's weather. */
    var tod = C.data.timeOfDay(new Date());
    var wx = C.engine.weather(save());
    traits.push({ group: 'Time of day', label: tod.label, mod: tod.mod });
    traits.push({ group: 'Weather', label: wx.label, mod: wx.mod });
    modTotal += tod.mod + wx.mod;

    /* Wealth tier, weighted by how ambitious the crime is. */
    var band = C.data.wealthBandForTier(crime.tier);
    var weights = C.data.wealthWeights[band];
    var list = C.data.wealth.map(function (w, i) { return { w: weights[i], w0: w }; });
    var wealth = U.pickWeighted(list).w0;

    var title = makeTitle(crime);

    return {
      id: U.uid(),
      crimeId: crime.id,
      title: title,
      traits: traits,
      mods: modTotal,
      wealth: wealth,
      rewardMult: rewardMod * wealth.mult,
      vehItem: crime._rolledVeh || null
    };
  }

  function makeTitle(crime) {
    var P = C.data.namePools;
    switch (crime.target) {
      case 'store':     return U.pick(P.storeName);
      case 'residence': return U.pick(P.residenceName);
      case 'vehicle':   return U.pick(['Scooter', 'Sedan', 'Coupe', 'Sports car', 'Supercar']) +
                               ' on ' + U.pick(['Pier Road', 'Amber Street', 'Foundry Lane', 'Marlin Court']);
      case 'atm':       return U.pick(P.atmName);
      case 'document':  return U.pick(P.docName);
      default:
        return U.pick(P.first) + ' ' + U.pick(P.last) + ', ' + U.pick(P.personTag);
    }
  }

  /* ---- SUCCESS CHANCE ---------------------------------------------------
     Assembles the percentage-point parts described in the design bible
     and clamps the result between 5% and 95%.                             */
  A.crimeChance = function (crime, target) {
    var sv = save();
    var p = sv.player;
    var parts = [];

    var base = crime.base * 100;
    parts.push({ label: 'Base chance', value: base, kind: 'base' });

    var targetPts = target ? target.mods : 0;
    parts.push({ label: 'Target and conditions', value: targetPts, kind: 'target' });

    /* Dex + Speed approach a ceiling rather than growing without limit. */
    var statSum = p.stats.dexterity + p.stats.speed;
    var statBonus = cfg.CRIME.statMaxBonus * (1 - Math.exp(-statSum / cfg.CRIME.statSoft));
    parts.push({ label: 'Dexterity + Speed', value: statBonus, kind: 'stat' });

    var clBonus = Math.min(cfg.CRIME.clBonusCap,
      Math.max(0, p.crimeLevel - crime.cl) * cfg.CRIME.clBonusPerLevel);
    parts.push({ label: 'Crime level', value: clBonus, kind: 'cl' });

    var happyBonus = U.clamp((p.happiness - 100) / cfg.CRIME.happyDivisor,
      -cfg.CRIME.happyCap, cfg.CRIME.happyCap);
    parts.push({ label: 'Happiness', value: happyBonus, kind: 'happy' });

    var wantedPenalty = -Math.min(cfg.CRIME.wantedCap, p.wanted * cfg.CRIME.wantedPerPoint);
    parts.push({ label: 'Wanted level', value: wantedPenalty, kind: 'wanted' });

    var tools = S.toolBonusFor(sv, crime);
    parts.push({ label: 'Tools carried', value: tools.total, kind: 'tools' });

    var raw = 0;
    parts.forEach(function (x) { raw += x.value; });

    var chance = U.clamp(raw / 100, cfg.CRIME.minChance, cfg.CRIME.maxChance);

    return { chance: chance, parts: parts, raw: raw, toolItems: tools.items };
  };

  /* ---- COMMIT A CRIME ---------------------------------------------------
     Order of operations: pay nerve, add crime experience, roll, resolve. */
  A.attemptCrime = function (crimeId, target) {
    var sv = save();
    var p = sv.player;
    var crime = C.data.crimeById[crimeId];
    if (!crime) return { ok: false, reason: 'Unknown job.' };

    if (S.isJailed(sv)) return { ok: false, reason: 'You are in a cell.' };
    if (S.isHospital(sv)) return { ok: false, reason: 'You are in a hospital bed.' };
    if (S.inTransit(sv)) return { ok: false, reason: 'You are in transit.' };
    if (S.abroad(sv)) return { ok: false, reason: 'You are not in Caligo right now.' };
    if (p.crimeLevel < crime.cl) return { ok: false, reason: 'You are not experienced enough for this job.' };
    if (p.nerve < crime.nerve) return { ok: false, reason: 'Not enough nerve.' };

    var calc = A.crimeChance(crime, target);

    /* Pay the nerve cost up front, win or lose. */
    p.nerve -= crime.nerve;
    p.acc.nerve = 0;
    sv.counters.crimes++;

    var crimeXpGain = crime.nerve * 4 + crime.tier * 2;
    grantCrimeXp(crimeXpGain);
    grantHiddenCrimeXp(1 + crime.tier);

    var succeeded = U.chance(calc.chance);

    /* Tools can break whether or not the job worked. */
    var broken = [];
    calc.toolItems.forEach(function (id) {
      var it = C.data.items[id];
      if (!it || !it.breakChance) return;
      if (U.chance(it.breakChance)) {
        removeItem(id, 1);
        broken.push(it.name);
      }
    });

    if (succeeded) {
      return resolveSuccess(sv, crime, target, calc, crimeXpGain, broken);
    }
    return resolveFailure(sv, crime, target, calc, crimeXpGain, broken);
  };

  function resolveSuccess(sv, crime, target, calc, crimeXpGain, broken) {
    var p = sv.player;

    /* Payout: skewed toward the bottom, scaled by target wealth, crime
       level and player level. */
    var base = U.skewRoll(crime.reward[0], crime.reward[1], cfg.CRIME.rewardSkew);
    var scale = target ? target.rewardMult : 1;
    var clScale = 1 + Math.max(0, p.crimeLevel - crime.cl) * 0.04;
    var lvScale = 1 + (p.level - 1) * 0.01;
    var payout = Math.max(1, Math.round(base * scale * clScale * lvScale));

    p.cash += payout;
    p.wanted += crime.wanted;
    p.happiness = Math.min(S.maxHappiness(p) + 50, p.happiness + 2);
    if (C.audio && C.audio.play) C.audio.play('cash');

    var xpGain = 4 + crime.tier * 3 + crime.nerve;
    grantXp(xpGain);

    sv.counters.crimesOk++;

    var flavour = U.pick(C.data.crimeFlavour.ok);
    var msg = crime.name + ': ' + flavour + ' You clear ' + U.money(payout) + '.';
    log(msg, 'money');

    /* Car theft hands over the actual vehicle instead of loose cash. */
    var extraItem = null;
    if (target && target.vehItem && crime.target === 'vehicle' && crime.id === 'car_theft') {
      addItem(target.vehItem, 1);
      extraItem = C.data.items[target.vehItem].name;
      log('A ' + extraItem + ' is now parked somewhere the Council cannot see.', 'good');
    }

    if (broken.length) {
      log('Broken beyond use: ' + broken.join(', ') + '.', 'bad');
    }

    return {
      ok: true, success: true, crime: crime, target: target,
      chance: calc.chance, parts: calc.parts,
      payout: payout, xp: xpGain, crimeXp: crimeXpGain,
      wanted: crime.wanted, extraItem: extraItem, broken: broken,
      text: msg
    };
  }

  function resolveFailure(sv, crime, target, calc, crimeXpGain, broken) {
    var p = sv.player;
    sv.counters.crimesFail++;

    var wantedGain = Math.round(crime.wanted * cfg.CRIME.failWantedMultiplier);
    p.wanted += wantedGain;
    p.happiness = Math.max(0, p.happiness - cfg.CRIME.failHappinessLoss);

    var jailMinutes = U.randInt(crime.jail[0], crime.jail[1]) * cfg.JAIL.timeScale;
    var jailSeconds = Math.round(jailMinutes * 60);
    p.jailUntil = Math.max(p.jailUntil, sv.meta.gameTime) + jailSeconds;
    sv.counters.jailed++;

    var critical = U.chance(cfg.CRIME.critFailChance);
    var hospSeconds = 0;
    if (critical) {
      hospSeconds = U.randInt(10, 30) * 60;
      p.hospitalUntil = Math.max(p.hospitalUntil, sv.meta.gameTime) + hospSeconds;
      p.life = Math.max(1, Math.floor(p.life * 0.4));
      sv.counters.hosp++;
    }

    if (C.audio && C.audio.play) {
      C.audio.play(critical ? 'hospital' : 'siren');
    }

    var flavour = critical ? U.pick(C.data.crimeFlavour.crit) : U.pick(C.data.crimeFlavour.fail);
    var msg = crime.name + ': ' + flavour +
      (critical ? ' You wake up in a clinic bed.' : ' You are locked up for ' + Math.round(jailMinutes) + ' minutes.');
    log(msg, 'bad');

    if (broken.length) log('Broken beyond use: ' + broken.join(', ') + '.', 'bad');

    return {
      ok: true, success: false, crime: crime, target: target,
      chance: calc.chance, parts: calc.parts,
      jailSeconds: jailSeconds, hospitalSeconds: hospSeconds, critical: critical,
      wanted: wantedGain, xp: 0, crimeXp: crimeXpGain, broken: broken,
      text: msg
    };
  }

  /* ---- GYM -------------------------------------------------------------- */
  A.buyMembership = function (gymId) {
    var sv = save();
    var gym = C.data.gymById[gymId];
    if (!gym) return { ok: false, reason: 'Unknown gym.' };
    if (gym.fee <= 0) return { ok: false, reason: 'No membership needed here.' };
    if (S.hasMembership(sv, gymId)) return { ok: false, reason: 'Membership already active.' };
    if (sv.player.cash < gym.fee) return { ok: false, reason: 'Not enough cash on hand.' };

    sv.player.cash -= gym.fee;
    sv.gyms.memberships[gymId] = sv.meta.gameTime + 24 * 3600;
    log('Membership paid at the ' + gym.name + ' for ' + U.money(gym.fee) + '.', 'money');
    return { ok: true };
  };

  A.train = function (gymId, statId, trainerId) {
    var sv = save();
    var p = sv.player;
    var gym = C.data.gymById[gymId];
    var trainer = C.data.trainerById[trainerId || 'none'] || C.data.trainerById.none;

    if (!gym) return { ok: false, reason: 'Unknown gym.' };
    if (S.isJailed(sv)) return { ok: false, reason: 'You are in a cell.' };
    if (S.isHospital(sv)) return { ok: false, reason: 'You are in a hospital bed.' };
    if (S.inTransit(sv)) return { ok: false, reason: 'You are in transit.' };
    if (S.abroad(sv)) return { ok: false, reason: 'You are not in Caligo right now.' };
    if (gym.fee > 0 && !S.hasMembership(sv, gymId)) {
      return { ok: false, reason: 'You need a membership at the ' + gym.name + ' first.' };
    }
    if (p.energy < gym.energy) return { ok: false, reason: 'Not enough energy.' };

    var totalCost = trainer.cost;
    if (p.cash < totalCost) return { ok: false, reason: 'You cannot afford that trainer.' };

    var statDef = null;
    for (var i = 0; i < C.data.trainableStats.length; i++) {
      if (C.data.trainableStats[i].id === statId) statDef = C.data.trainableStats[i];
    }
    if (!statDef) return { ok: false, reason: 'Unknown training type.' };

    /* Pay costs. */
    p.energy -= gym.energy;
    p.acc.energy = 0;
    if (totalCost > 0) p.cash -= totalCost;
    p.happiness = Math.max(0, p.happiness - cfg.GYM.happinessCost);

    /* Happiness factor: 0.5 at zero happiness, 1.0 at the base maximum. */
    var happyFactor = cfg.GYM.happinessFloor + (p.happiness / cfg.GYM.happinessDivisor);

    var variance = 1 + U.rand(-cfg.GYM.variance, cfg.GYM.variance);
    var trainerMult = 1 + trainer.bonus;

    var gains = {};
    var targets = statId === 'all'
      ? ['strength', 'defense', 'speed', 'dexterity']
      : [statId];
    var allRoundScale = statId === 'all' ? 0.45 : 1;

    targets.forEach(function (key) {
      var current = p.stats[key];
      /* Diminishing returns: gains halve at the soft cap, then keep sliding. */
      var diminish = 1 / (1 + current / cfg.GYM.softCap);
      var gain = cfg.GYM.baseGain * gym.mult * trainerMult * happyFactor *
                 diminish * variance * allRoundScale;
      gain = Math.max(0.05, gain);
      p.stats[key] = Math.round((current + gain) * 100) / 100;
      gains[key] = gain;
    });

    grantXp(cfg.GYM.xp);
    sv.counters.trains++;
    if (C.audio && C.audio.play) C.audio.play('punch');

    var exercise = U.pick(statDef.exercises);
    var statLine = targets.map(function (k) {
      return U.titleCase(k) + ' +' + gains[k].toFixed(2);
    }).join(', ');
    var msg = 'You put in a session of ' + exercise + ' at the ' + gym.name + '. ' + statLine + '.';
    log(msg, 'good');

    /* The underground gym can hurt you. */
    var injury = null;
    if (gym.injuryRisk && U.chance(gym.injuryRisk)) {
      var dmg = U.randInt(8, 25);
      p.life = Math.max(1, p.life - dmg);
      var hospSec = U.randInt(5, 15) * 60;
      p.hospitalUntil = Math.max(p.hospitalUntil, sv.meta.gameTime) + hospSec;
      sv.counters.hosp++;
      injury = { damage: dmg, hospitalSeconds: hospSec };
      log('Something in your back gives out. You lose ' + dmg + ' life and a clinic takes you in.', 'bad');
    }

    return { ok: true, gains: gains, gym: gym, exercise: exercise, injury: injury, text: msg };
  };

  /* Buying happiness straight from the gym page. */
  A.buyHappiness = function (sourceId) {
    var sv = save();
    var p = sv.player;
    var src = null;
    C.data.happinessSources.forEach(function (s) { if (s.id === sourceId) src = s; });
    if (!src) return { ok: false, reason: 'Unknown option.' };
    if (p.cash < src.cost) return { ok: false, reason: 'Not enough cash.' };

    p.cash -= src.cost;
    p.happiness += src.happiness;
    log(src.text + ' (+' + src.happiness + ' happiness)', 'good');
    return { ok: true, source: src };
  };

  /* ---- SHOPS ------------------------------------------------------------- */
  A.buyItem = function (shopId, itemId, qty) {
    var sv = save();
    var shop = C.data.shopById[shopId];
    var it = C.data.items[itemId];
    qty = Math.max(1, Math.floor(qty || 1));

    if (!shop || !it) return { ok: false, reason: 'Unknown item.' };
    if (shop.stock.indexOf(itemId) === -1) return { ok: false, reason: 'Not sold here.' };

    var cost = it.price * qty;
    if (sv.player.cash < cost) return { ok: false, reason: 'Not enough cash on hand.' };

    sv.player.cash -= cost;
    addItem(itemId, qty);
    sv.counters.itemsBought += qty;
    log('Bought ' + qty + '× ' + it.name + ' for ' + U.money(cost) + ' at ' + shop.name + '.', 'money');
    return { ok: true, cost: cost };
  };

  A.sellItem = function (itemId, qty) {
    var sv = save();
    var it = C.data.items[itemId];
    qty = Math.max(1, Math.floor(qty || 1));
    if (!it) return { ok: false, reason: 'Unknown item.' };
    if (S.itemQty(sv, itemId) < qty) return { ok: false, reason: 'You do not have that many.' };

    var value = Math.max(1, Math.round(it.sell * qty));
    removeItem(itemId, qty);
    sv.player.cash += value;
    log('Sold ' + qty + '× ' + it.name + ' for ' + U.money(value) + '.', 'money');
    return { ok: true, value: value };
  };

  /* ---- ITEM USE ---------------------------------------------------------- */
  A.useItem = function (itemId) {
    var sv = save();
    var p = sv.player;
    var it = C.data.items[itemId];
    if (!it) return { ok: false, reason: 'Unknown item.' };
    if (!has(itemId)) return { ok: false, reason: 'You do not have one.' };

    var cdKey = null;
    if (it.cat === 'medical') cdKey = 'medical';
    else if (it.cat === 'drug') cdKey = 'drug';
    else if (it.cat === 'booster') cdKey = 'booster';

    if (cdKey && S.cooldownLeft(sv, cdKey) > 0) {
      return { ok: false, reason: 'That category is on cooldown for another ' +
        U.dur(S.cooldownLeft(sv, cdKey)) + '.' };
    }

    var effects = [];
    var isHealOnly = (it.cat === 'medical' && it.heal != null);

    /* Medical items can be used in hospital to shorten the stay. */
    if (it.heal != null) {
      var before = p.life;
      p.life = Math.min(S.maxLife(p), p.life + it.heal);
      effects.push('+' + (p.life - before) + ' life');
    }
    if (it.energy != null) {
      var be = p.energy;
      p.energy = Math.min(S.maxEnergy(p), p.energy + it.energy);
      effects.push('+' + (p.energy - be) + ' energy');
    }
    if (it.nerve != null) {
      var bn = p.nerve;
      p.nerve = Math.min(S.maxNerve(p), p.nerve + it.nerve);
      effects.push('+' + (p.nerve - bn) + ' nerve');
    }
    if (it.happiness != null) {
      p.happiness += it.happiness;
      effects.push('+' + it.happiness + ' happiness');
    }
    if (it.regen) {
      p.buffs.regen = { amount: it.regen, every: it.regenSeconds, until: sv.meta.gameTime + 3600, acc: 0 };
      effects.push('regeneration for an hour');
    }
    if (it.cures) {
      effects.push('cleared ' + it.cures.join(', '));
    }
    if (it.cat === 'drug') {
      var od = it.overdose || 0.03;
      if (U.chance(od)) {
        removeItem(itemId, 1);
        var sec = U.randInt(10, 30) * 60;
        p.hospitalUntil = Math.max(p.hospitalUntil, sv.meta.gameTime) + sec;
        p.life = Math.max(1, Math.floor(p.life * 0.5));
        sv.counters.hosp++;
        log('That was too much. You wake up in the Undercity clinic.', 'bad');
        return { ok: true, overdose: true, hospitalSeconds: sec, effects: effects };
      }
      if (it.addiction) {
        p.buffs.addiction = (p.buffs.addiction || 0) + it.addiction;
      }
      p.buffs[it.id] = {
        until: sv.meta.gameTime + (it.duration || 3600),
        strengthBuff: it.strengthBuff || 0,
        speedBuff: it.speedBuff || 0,
        intelligenceBuff: it.intelligenceBuff || 0
      };
    }

    if (!effects.length) return { ok: false, reason: 'Nothing happens. That item is not usable yet.' };

    removeItem(itemId, 1);
    sv.counters.itemsUsed++;

    /* Cooldown lengths are per category so a medical kit and a beer do not
       block each other. */
    if (cdKey === 'medical') sv.player.cooldowns.medical = sv.meta.gameTime + 60;
    if (cdKey === 'booster') sv.player.cooldowns.booster = sv.meta.gameTime + 60;
    if (cdKey === 'drug') sv.player.cooldowns.drug = sv.meta.gameTime + 900;

    var text = 'Used ' + it.name + '. ' + effects.join(', ') + '.';
    log(text, isHealOnly ? 'good' : 'info');
    return { ok: true, effects: effects, text: text };
  };

  /* ---- EQUIPMENT --------------------------------------------------------- */
  A.equipItem = function (itemId) {
    var sv = save();
    var it = C.data.items[itemId];
    if (!it) return { ok: false, reason: 'Unknown item.' };
    if (!has(itemId)) return { ok: false, reason: 'You do not own that.' };

    var slot = null;
    if (it.cat === 'weapon') slot = 'weapon';
    else if (it.cat === 'armour') slot = 'armour';
    else return { ok: false, reason: 'That cannot be equipped.' };

    sv.player.equipped[slot] = itemId;
    log('Equipped ' + it.name + '.', 'info');
    return { ok: true, slot: slot };
  };

  A.unequip = function (slot) {
    var sv = save();
    sv.player.equipped[slot] = null;
    return { ok: true };
  };

  /* ---- DAILY REWARD -------------------------------------------------------
     Once per 24 game hours. Streaks grow the cash, and every seventh day
     of a streak also drops an item. */
  A.dailyStatus = function () {
    var sv = save();
    var left = Math.max(0, (sv.daily.last + cfg.DAILY.cooldown) - sv.meta.gameTime);
    return { ready: left <= 0, left: left, streak: sv.daily.streak };
  };

  A.claimDaily = function () {
    var sv = save();
    var st = A.dailyStatus();
    if (!st.ready) return { ok: false, reason: 'Already claimed. Come back in ' + U.dur(st.left) + '.' };

    var day = (sv.daily.streak % cfg.DAILY.cash.length);
    var cash = cfg.DAILY.cash[day];
    sv.daily.streak++;
    sv.daily.last = sv.meta.gameTime;

    sv.player.cash += cash;
    sv.player.energy = S.maxEnergy(sv.player);
    sv.player.nerve = S.maxNerve(sv.player);
    sv.player.acc.energy = 0;
    sv.player.acc.nerve = 0;

    var itemGiven = null;
    if (sv.daily.streak % cfg.DAILY.itemDay === 0) {
      itemGiven = U.pick(['first_aid', 'energy_drink', 'happy_candy', 'lockpick_set', 'kevlar_vest']);
      addItem(itemGiven, 1);
    }

    var msg = 'Daily take: ' + U.money(cash) + '. Energy and nerve refilled. Streak ' + sv.daily.streak + '.';
    log(msg, 'money');
    if (itemGiven) log('The runner also leaves you a ' + C.data.items[itemGiven].name + '.', 'good');

    return { ok: true, cash: cash, streak: sv.daily.streak, item: itemGiven };
  };

  /* ---- CUSTODY ------------------------------------------------------------ */
  A.bailCost = function () {
    var sv = save();
    var left = S.jailLeft(sv);
    return Math.max(cfg.CRIME.bailMin, Math.round((left / 60) * cfg.CRIME.bailPerMinute));
  };

  A.payBail = function () {
    var sv = save();
    if (!S.isJailed(sv)) return { ok: false, reason: 'You are not in jail.' };
    var cost = A.bailCost();
    if (sv.player.cash < cost) return { ok: false, reason: 'You need ' + U.money(cost) + ' on hand.' };
    sv.player.cash -= cost;
    sv.player.jailUntil = 0;
    log('Bail posted at ' + U.money(cost) + '. The desk sergeant does not look up.', 'money');
    return { ok: true, cost: cost };
  };

  A.fineCost = function () {
    return Math.round(save().player.wanted * cfg.CRIME.finePerWanted);
  };

  A.payFine = function () {
    var sv = save();
    var p = sv.player;
    if (p.wanted <= 0) return { ok: false, reason: 'You are not wanted.' };
    var cost = A.fineCost();
    if (p.cash < cost) return { ok: false, reason: 'You need ' + U.money(cost) + ' on hand.' };
    p.cash -= cost;
    p.wanted = 0;
    log('Fine of ' + U.money(cost) + ' paid. Your record goes quiet.', 'money');
    return { ok: true, cost: cost };
  };

  A.hospitalCost = function (tier) {
    return { basic: 1000, advanced: 10000, experimental: 50000 }[tier] || 1000;
  };

  A.hospitalTreat = function (tier) {
    var sv = save();
    var cost = A.hospitalCost(tier);
    if (sv.player.cash < cost) return { ok: false, reason: 'Not enough cash.' };
    sv.player.cash -= cost;

    var cut = { basic: 0.5, advanced: 0.8, experimental: 1 }[tier] || 0.5;
    var left = S.hospitalLeft(sv);
    var removed = Math.round(left * cut);
    sv.player.hospitalUntil -= removed;
    sv.player.life = Math.min(S.maxLife(sv.player), sv.player.life + Math.round(S.maxLife(sv.player) * 0.4));

    log('Treated at the clinic. ' + U.dur(removed) + ' off your stay.', 'good');
    return { ok: true, removed: removed };
  };

  /* ---- SETTINGS ----------------------------------------------------------- */
  A.setSetting = function (key, value) {
    var sv = save();
    if (!Object.prototype.hasOwnProperty.call(sv.settings, key)) return false;
    sv.settings[key] = value;
    C.storage.write(sv);
    return true;
  };

  /* ---- SAVE MANAGEMENT ---------------------------------------------------- */
  A.save = function () { C.engine.flush(); return true; };

  A.exportSave = function () { return C.storage.exportText(save()); };

  A.importSave = function (text) {
    var loaded = C.storage.importText(text);
    C.state.save = loaded;
    C.storage.write(loaded);
    return loaded;
  };

  A.resetGame = function () {
    C.storage.clear();
    C.state.save = null;
  };

  /* ---- READ HELPERS FOR SCREENS -------------------------------------------
     Screens read state through these so the shape stays in one place.    */
  A.inventoryList = function () {
    var sv = save();
    return sv.inventory.map(function (stack) {
      var it = C.data.items[stack.id];
      return { id: stack.id, qty: stack.qty, item: it, equipped: it && (
        sv.player.equipped.weapon === stack.id || sv.player.equipped.armour === stack.id) };
    }).filter(function (e) { return !!e.item; });
  };

  A.availableCrimes = function () {
    var sv = save();
    return C.data.crimes.filter(function (c) { return sv.player.crimeLevel >= c.cl; });
  };

  /* Exposed so the Phase 2 action modules (combat, economy) can use them
     without duplicating logic. */
  A.grantXp = grantXp;
  A.grantCrimeXp = grantCrimeXp;
  A.grantHiddenCrimeXp = grantHiddenCrimeXp;
  A.removeItem = removeItem;
  A.giveCash = giveCash;
  A.has = has;
  A.getSave = save;

  /* Push a mail entry. Used by Phase 3 systems. */
  A.pushMail = function (from, subject, body) {
    var sv = save();
    sv.mail.unshift({ id: U.uid(), from: from, subject: subject, body: body, t: sv.meta.gameTime, read: false });
    if (sv.mail.length > 60) sv.mail.length = 60;
  };

  /* Push a calendar event. */
  A.pushEvent = function (title, text) {
    var sv = save();
    sv.events.unshift({ id: U.uid(), title: title, text: text, t: sv.meta.gameTime });
    if (sv.events.length > 40) sv.events.length = 40;
  };

  C.actions = A;
})(window.CALIGO);
