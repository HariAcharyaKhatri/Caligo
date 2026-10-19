/* CALIGO — factions, war, chains, territories. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config, U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.joinFaction = function (factionId) {
    var sv = save();
    if (sv.faction.id) return { ok: false, reason: 'You are already in a faction.' };
    var f = C.data.factions.filter(function (x) { return x.id === factionId; })[0];
    if (!f) return { ok: false, reason: 'Unknown faction.' };
    if (sv.player.level < f.req.level) return { ok: false, reason: 'Requires level ' + f.req.level + '.' };
    if (sv.player.stats[f.req.stat] < f.req.value) {
      return { ok: false, reason: 'Requires ' + f.req.stat + ' ' + f.req.value + '.' };
    }

    sv.faction.id = factionId;
    sv.faction.role = 'Recruit';
    sv.faction.joinedAt = sv.meta.gameTime;
    sv.faction.respect = 0;
    A.log('Joined ' + f.name + ' as a Recruit.', 'good');
    A.pushMail(f.name, 'Welcome to ' + f.name, f.perk + ' is now active.');
    return { ok: true };
  };

  A.leaveFaction = function () {
    var sv = save();
    if (!sv.faction.id) return { ok: false, reason: 'You are not in a faction.' };
    var f = S.faction(sv);
    sv.faction.id = null;
    sv.faction.role = null;
    sv.faction.war = null;
    sv.faction.chain = 0;
    A.log('Left ' + (f ? f.name : 'the faction') + '.', 'info');
    return { ok: true };
  };

  /* Bot members generated on join and used for display. */
  A.factionMembers = function () {
    var sv = save();
    if (!sv.faction.id) return [];
    if (!sv.faction._members) {
      var count = U.randInt(cfg.FACTIONS.botMemberCount[0], cfg.FACTIONS.botMemberCount[1]);
      var mem = [];
      for (var i = 0; i < count; i++) {
        var bot = C.bots.randomSeller(sv);
        mem.push({
          name: bot ? bot.name : 'Member ' + i,
          role: C.data.factionBotRoles[i] || 'Member',
          level: U.randInt(3, 40)
        });
      }
      sv.faction._members = mem;
    }
    return sv.faction._members;
  };

  /* ---- WAR ---------------------------------------------------------- */
  A.declareWar = function (enemyId) {
    var sv = save();
    if (!sv.faction.id) return { ok: false, reason: 'You are not in a faction.' };
    if (sv.faction.war) return { ok: false, reason: 'You are already at war.' };
    var enemy = C.data.factions.filter(function (f) { return f.id === enemyId; })[0];
    if (!enemy || enemyId === sv.faction.id) return { ok: false, reason: 'Cannot war that faction.' };

    sv.faction.war = {
      enemyId: enemyId,
      startedAt: sv.meta.gameTime,
      endsAt: sv.meta.gameTime + cfg.FACTIONS.warDurationHours * 3600,
      score: 0,
      enemyScore: 0,
      hits: 0
    };
    sv.faction.chain = 0;
    sv.faction.chainExpires = 0;
    A.log('War declared on ' + enemy.name + '. Duration: ' + cfg.FACTIONS.warDurationHours + ' hours.', 'bad');
    return { ok: true };
  };

  A.warAttack = function () {
    var sv = save();
    if (!sv.faction.war) return { ok: false, reason: 'No active war.' };
    if (sv.faction.war.endsAt <= sv.meta.gameTime) { endWar(sv); return { ok: false, reason: 'War has ended.' }; }
    if (!S.canAct(sv)) return { ok: false, reason: 'You cannot attack right now.' };

    var cost = 5;
    if (sv.player.energy < cost) return { ok: false, reason: 'Not enough energy.' };
    sv.player.energy -= cost;

    /* Attack success based on power vs enemy faction defense. */
    var myPower = S.playerPower(sv);
    var enemyDef = cfg.TERRITORIES.defenseBase + sv.faction.war.hits * 8;
    var winChance = U.clamp(myPower / (myPower + enemyDef), 0.15, 0.9);
    var success = U.chance(winChance);

    if (success) {
      sv.faction.war.score += cfg.FACTIONS.respectPerHit;
      sv.faction.war.hits++;
      sv.faction.respect += cfg.FACTIONS.respectPerHit;
      sv.faction.chain++;
      sv.faction.chainExpires = sv.meta.gameTime + cfg.FACTIONS.chainTimeoutMinutes * 60;

      /* Chain milestones. */
      cfg.FACTIONS.chainMilestones.forEach(function (m, i) {
        if (sv.faction.chain === m) {
          sv.faction.respect += cfg.FACTIONS.chainBonusRespect[i];
          A.log('Chain milestone ' + m + '! +' + cfg.FACTIONS.chainBonusRespect[i] + ' respect.', 'good');
        }
      });

      A.grantXp(8);
      A.log('War hit. Chain ' + sv.faction.chain + '. +' + cfg.FACTIONS.respectPerHit + ' respect.', 'good');
      return { ok: true, success: true, chain: sv.faction.chain };
    } else {
      sv.faction.chain = 0;
      sv.faction.war.enemyScore += cfg.FACTIONS.respectPerHit;
      A.log('War hit failed. Chain broken.', 'bad');
      return { ok: true, success: false, chain: 0 };
    }
  };

  /* Called from the tick. Expires wars, breaks chains, pays territories. */
  A.tickFaction = function () {
    var sv = save();
    if (sv.faction.chain > 0 && sv.meta.gameTime > sv.faction.chainExpires) {
      A.log('Chain expired at ' + sv.faction.chain + '.', 'info');
      sv.faction.chain = 0;
    }
    if (sv.faction.war && sv.faction.war.endsAt <= sv.meta.gameTime) {
      endWar(sv);
    }
  };

  function endWar(sv) {
    if (!sv.faction.war) return;
    var enemy = C.data.factions.filter(function (f) { return f.id === sv.faction.war.enemyId; })[0];
    var won = sv.faction.war.score > sv.faction.war.enemyScore;
    var reward = won ? sv.faction.war.score * 500 : 0;
    sv.player.cash += reward;
    A.log('War against ' + (enemy ? enemy.name : 'the enemy') + ' ended. ' +
      (won ? 'Won. Payout ' + U.money(reward) : 'Lost.') + '.', won ? 'money' : 'bad');
    if (won) A.grantXp(100);
    sv.faction.war = null;
    sv.faction.chain = 0;
  }

  /* ---- TERRITORIES --------------------------------------------------- */
  A.captureTerritory = function (tid) {
    var sv = save();
    if (!sv.faction.id) return { ok: false, reason: 'You must be in a faction.' };
    if (!sv.faction.war) return { ok: false, reason: 'You must be at war to capture.' };
    var t = C.data.territories.filter(function (x) { return x.id === tid; })[0];
    if (!t) return { ok: false, reason: 'Unknown territory.' };
    if (sv.territories[tid] === sv.faction.id) return { ok: false, reason: 'Already yours.' };

    var cost = 10;
    if (sv.player.energy < cost) return { ok: false, reason: 'Not enough energy.' };
    sv.player.energy -= cost;

    /* Capture roll based on power vs defense. */
    var power = S.playerPower(sv);
    var chance = U.clamp(power / (power + t.defense), 0.1, 0.85);
    if (U.chance(chance)) {
      sv.territories[tid] = sv.faction.id;
      sv.faction.respect += 25;
      A.grantXp(25);
      A.log('Captured ' + t.name + ' for your faction.', 'good');
      return { ok: true, success: true };
    }
    A.log('Failed to capture ' + t.name + '.', 'bad');
    return { ok: true, success: false };
  };

  /* Called on tick: pay territories held by the player's faction. */
  A.tickTerritories = function () {
    var sv = save();
    if (!sv.faction.id) return;
    if (!sv.territories._lastPayout) sv.territories._lastPayout = sv.meta.gameTime;
    var elapsed = sv.meta.gameTime - sv.territories._lastPayout;
    if (elapsed < 86400) return;
    var days = Math.floor(elapsed / 86400);
    var total = 0;
    C.data.territories.forEach(function (t) {
      if (sv.territories[t.id] === sv.faction.id) total += t.income * days;
    });
    if (total > 0) {
      sv.player.cash += total;
      A.log('Faction territory income: ' + U.money(total) + '.', 'money');
    }
    sv.territories._lastPayout = sv.meta.gameTime;
  };

  C.actions = A;
})(window.CALIGO);
