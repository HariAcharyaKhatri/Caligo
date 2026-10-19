/* CALIGO — the bot population that makes the city feel lived in.
   Bots are rolled once, stored in the save, and grow slowly with time.   */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var U = C.util;
  var D = C.data;
  var B = {};

  /* ---- GENERATION ----------------------------------------------------- */
  B.generateRoster = function (size) {
    var list = [];
    for (var i = 0; i < size; i++) list.push(makeBot(rollTier()));
    return list;
  };

  function rollTier() {
    var w = D.botTierWeights, total = 0, i;
    for (i = 0; i < w.length; i++) total += w[i];
    var r = Math.random() * total;
    for (i = 0; i < w.length; i++) {
      r -= w[i];
      if (r <= 0) return i;
    }
    return 0;
  }

  function makeBot(tierIndex) {
    var tier = D.botTiers[tierIndex];
    var s = tier.statRange;
    var level = U.randInt(tier.levelRange[0], tier.levelRange[1]);
    var name = U.pick(D.namePools.first) + ' ' + U.pick(D.namePools.last);
    var aware = U.pickWeighted(D.botAwareness);
    var maxLife = tier.lifeBase + level * 4;
    return {
      id: 'b_' + U.uid(),
      name: name,
      age: U.randInt(20, 58),
      build: U.pick(D.botBuilds),
      occupation: U.pick(D.botOccupations),
      tier: tier.id,
      tierIndex: tierIndex,
      level: level,
      stats: {
        strength:  U.randInt(s[0], s[1]),
        defense:   U.randInt(s[0], s[1]),
        speed:     U.randInt(s[0], s[1]),
        dexterity: U.randInt(s[0], s[1])
      },
      maxLife: maxLife,
      life: maxLife,
      cash: U.randInt(tier.cashRange[0], tier.cashRange[1]),
      awareness: aware.id,
      activity: U.pick(D.botActivities),
      online: U.chance(0.6),
      hospitalUntil: 0,
      faction: null,
      wins: 0, losses: 0
    };
  }

  /* ---- TIME-BASED GROWTH ---------------------------------------------
     Bots get very slightly stronger with real time so a player who walks
     away for a week does not return to a trivially easy city.           */
  B.grow = function (save, elapsedGameSeconds) {
    var hours = elapsedGameSeconds / 3600;
    if (hours <= 0) return;
    var statRate = 1 + C.config.BOTS.statGrowthPerHour * hours;
    var levelChance = C.config.BOTS.levelUpPerHour * hours;
    save.bots.forEach(function (b) {
      if (b.hospitalUntil > save.meta.gameTime) return;
      ['strength', 'defense', 'speed', 'dexterity'].forEach(function (k) {
        b.stats[k] = Math.round(b.stats[k] * statRate * 100) / 100;
      });
      b.maxLife = Math.round(b.maxLife * statRate);
      if (b.life > b.maxLife) b.life = b.maxLife;
      if (U.chance(levelChance)) { b.level++; b.maxLife += 4; }
      if (U.chance(C.config.BOTS.activityRefreshChance * Math.min(1, hours))) {
        b.activity = U.pick(D.botActivities);
        b.online = U.chance(0.6);
      }
    });
  };

  /* ---- POWER ----------------------------------------------------------
     One number per bot for combat math. Same weights as the player.      */
  B.power = function (bot) {
    var w = C.config.COMBAT.powerWeights;
    var s = bot.stats;
    return s.strength * w.strength + s.defense * w.defense +
           s.speed * w.speed + s.dexterity * w.dexterity;
  };

  B.tierLabel = function (bot) {
    var t = D.botTierById[bot.tier];
    return t ? t.name : 'Unknown';
  };

  B.find = function (save, id) {
    for (var i = 0; i < save.bots.length; i++) {
      if (save.bots[i].id === id) return save.bots[i];
    }
    return null;
  };

  /* Bots in hospital are not selectable, so this is what the Combat
     screen shows. */
  B.available = function (save) {
    return save.bots.filter(function (b) {
      return b.hospitalUntil <= save.meta.gameTime;
    });
  };

  /* ---- PICK A RANDOM OPPONENT ----------------------------------------- */
  B.sample = function (save, count) {
    var pool = B.available(save).slice();
    /* shuffle */
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return pool.slice(0, count || 12);
  };

  /* ---- MARKET SELLERS -------------------------------------------------
     Used by the market simulator to find bots willing to list an item.  */
  B.randomSeller = function (save) {
    var pool = save.bots;
    if (!pool.length) return null;
    return pool[U.randInt(0, pool.length - 1)];
  };

  C.bots = B;
})(window.CALIGO);
