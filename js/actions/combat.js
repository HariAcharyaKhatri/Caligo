/* CALIGO — combat actions. Extends CALIGO.actions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var U = C.util;
  var S = C.state;
  var A = C.actions;
  var D = C.data;

  function save() { return C.state.save; }

  /* ---- BOT SELECTION -------------------------------------------------- */
  A.botSample = function (count) {
    return C.bots.sample(save(), count || 12);
  };

  /* Estimated win chance against a given bot, for the target list.
     Rough heuristic only — real fights have variance.                   */
  A.estimatedWinChance = function (bot) {
    var sv = save();
    var myPower = S.playerPower(sv);
    var botPower = C.bots.power(bot) + bot.maxLife * 0.3;
    var ratio = myPower / Math.max(1, botPower);
    /* Map ratio to 5%..95% using a soft curve. */
    var raw = 1 / (1 + Math.pow(1 / Math.max(0.001, ratio), 1.6));
    return U.clamp(raw, 0.05, 0.95);
  };

  /* ---- START A FIGHT -------------------------------------------------- */
  A.startFight = function (botId) {
    var sv = save();
    var bot = C.bots.find(sv, botId);
    if (!bot) return { ok: false, reason: 'That person is no longer here.' };
    if (bot.hospitalUntil > sv.meta.gameTime) return { ok: false, reason: 'They are already in a clinic.' };
    if (!S.canAct(sv)) return { ok: false, reason: 'You cannot fight right now.' };
    if (sv.player.energy < cfg.COMBAT.energyCost) return { ok: false, reason: 'Not enough energy.' };
    if (sv.combat) return { ok: false, reason: 'You are already in a fight.' };

    sv.player.energy -= cfg.COMBAT.energyCost;
    sv.player.acc.energy = 0;

    sv.combat = {
      botId: bot.id,
      botName: bot.name,
      botTier: bot.tier,
      botLevel: bot.level,
      botLife: bot.life,
      botMaxLife: bot.maxLife,
      playerLife: sv.player.life,
      playerMaxLife: S.maxLife(sv.player),
      round: 1,
      log: [
        { side: 'system', text: 'You square up with ' + bot.name +
          ' (' + C.bots.tierLabel(bot) + ', level ' + bot.level + ') behind the fish market.' }
      ],
      over: false,
      outcome: null,
      startedAt: sv.meta.gameTime
    };

    return { ok: true };
  };

  /* ---- A ROUND --------------------------------------------------------
     The player picks a move, the bot picks one, both resolve, damage is
     applied in speed order. Repeat until KO or escape.                   */
  A.fightRound = function (moveId) {
    var sv = save();
    if (!sv.combat) return { ok: false, reason: 'You are not in a fight.' };
    if (sv.combat.over) return { ok: false, reason: 'This fight is finished.' };

    var bot = C.bots.find(sv, sv.combat.botId);
    if (!bot) return { ok: false, reason: 'They are gone.' };

    var move = cfg.COMBAT.moves[moveId];
    if (!move) return { ok: false, reason: 'Unknown move.' };

    var combat = sv.combat;
    combat.round++;

    /* Escape attempt resolves immediately. */
    if (move.special === 'escape') {
      var escaped = U.chance(0.5);
      if (escaped) {
        combat.log.push({ side: 'system', text: U.pick(D.combatFlavour.escape) });
        finish(sv, 'escaped');
        return { ok: true, escape: true };
      }
      combat.log.push({ side: 'player', text: 'You try to break away but they cut you off.' });
      botTurn(sv, bot, combat);
      checkEnd(sv, bot, combat);
      return { ok: true };
    }

    /* Special actions resolve before normal damage. */
    if (move.special === 'disarm') {
      var myDex = sv.player.stats.dexterity;
      var disarmChance = U.clamp(0.15 + myDex / (myDex + 300), 0.05, 0.65);
      if (U.chance(disarmChance)) {
        combat.log.push({ side: 'player', text: 'You knock their weapon aside.' });
        bot._disarmed = true;
      } else {
        combat.log.push({ side: 'player', text: 'You fail to disarm them.' });
      }
      botTurn(sv, bot, combat);
      checkEnd(sv, bot, combat);
      return { ok: true };
    }

    /* Defence-only moves skip your attack. */
    if (move.dmg === 0 && move.incoming) {
      combat.log.push({ side: 'player', text: 'You ' +
        (moveId === 'block' ? 'raise your guard.' : 'try to slip away from the next blow.') });
      combat._playerGuard = move;
      botTurn(sv, bot, combat);
      combat._playerGuard = null;
      checkEnd(sv, bot, combat);
      return { ok: true };
    }

    /* Normal attack. */
    playerAttack(sv, bot, combat, move);
    if (combat.over) return { ok: true };
    botTurn(sv, bot, combat);
    checkEnd(sv, bot, combat);
    return { ok: true };
  };

  function playerAttack(sv, bot, combat, move) {
    var myPower = S.playerPower(sv);
    var mySpeed = sv.player.stats.speed + sv.player.stats.dexterity;
    var botSpeed = bot.stats.speed + bot.stats.dexterity;
    var hitChance = cfg.COMBAT.baseHitChance + move.hit +
      U.clamp((mySpeed - botSpeed) / 800, -0.15, 0.15);
    hitChance = U.clamp(hitChance, 0.10, 0.95);

    if (!U.chance(hitChance)) {
      combat.log.push({ side: 'player', text: U.pick(D.combatFlavour.miss) });
      return;
    }

    var raw = myPower * cfg.COMBAT.damageFraction * move.dmg;
    var variance = 1 + U.rand(-cfg.COMBAT.damageVariance, cfg.COMBAT.damageVariance);
    var soft = raw * (1 - bot.stats.defense / (bot.stats.defense + cfg.COMBAT.defenceSoften));
    var dmg = Math.max(cfg.COMBAT.minDamage, Math.round(soft * variance));
    if (bot._disarmed) dmg = Math.round(dmg * 0.7);

    combat.botLife = Math.max(0, combat.botLife - dmg);
    combat.log.push({ side: 'player', text: U.pick(D.combatFlavour.playerHit) + ' (-' + dmg + ' life)' });
    if (C.audio && C.audio.play) C.audio.play(dmg > raw * 1.2 ? 'crit' : 'hit');

    if (combat.botLife <= 0) {
      combat.log.push({ side: 'system', text: U.pick(D.combatFlavour.koWin) });
      finish(sv, 'win');
    }
  }

  function botTurn(sv, bot, combat) {
    if (combat.over) return;
    var botMove = pickBotMove(bot);
    var botPower = C.bots.power(bot);
    var myDef = S.playerDefence(sv);
    var mySpeed = sv.player.stats.speed + sv.player.stats.dexterity;
    var botSpeed = bot.stats.speed + bot.stats.dexterity;

    /* Guard / dodge can negate the bot's strike. */
    var guard = combat._playerGuard;
    if (guard && guard.evade && U.chance(guard.evade)) {
      combat.log.push({ side: 'system', text: 'You slip the blow entirely.' });
      return;
    }

    var hitChance = cfg.COMBAT.baseHitChance + botMove.hit +
      U.clamp((botSpeed - mySpeed) / 800, -0.15, 0.15);
    hitChance = U.clamp(hitChance, 0.10, 0.95);

    if (!U.chance(hitChance)) {
      combat.log.push({ side: 'bot', text: 'They miss.' });
      return;
    }

    var raw = botPower * cfg.COMBAT.damageFraction * botMove.dmg;
    var variance = 1 + U.rand(-cfg.COMBAT.damageVariance, cfg.COMBAT.damageVariance);
    var soft = raw * (1 - myDef / (myDef + cfg.COMBAT.defenceSoften));
    var dmg = Math.max(cfg.COMBAT.minDamage, Math.round(soft * variance));
    if (guard && guard.incoming) dmg = Math.max(1, Math.round(dmg * guard.incoming));

    combat.playerLife = Math.max(0, combat.playerLife - dmg);
    combat.log.push({ side: 'bot', text: U.pick(D.combatFlavour.botHit) + ' (-' + dmg + ' life)' });
    if (C.audio && C.audio.play) C.audio.play('hit');

    if (combat.playerLife <= 0) {
      combat.log.push({ side: 'system', text: U.pick(D.combatFlavour.koLose) });
      finish(sv, 'loss');
    }
  }

  /* Bots favour the moves a player would: mostly basic, occasional power,
     block when hurt. */
  function pickBotMove(bot) {
    var hpPct = bot.life / bot.maxLife;
    if (hpPct < 0.3 && U.chance(0.35)) return cfg.COMBAT.moves.block;
    var r = Math.random();
    if (r < 0.55) return cfg.COMBAT.moves.basic;
    if (r < 0.72) return cfg.COMBAT.moves.power;
    if (r < 0.85) return cfg.COMBAT.moves.quick;
    return cfg.COMBAT.moves.aimed;
  }

  function checkEnd(sv, bot, combat) {
    if (combat.over) return;
    if (combat.playerLife <= 0) { finish(sv, 'loss'); return; }
    if (combat.botLife <= 0) { finish(sv, 'win'); }
  }

  /* ---- FINISH --------------------------------------------------------- */
  function finish(sv, outcome) {
    var combat = sv.combat;
    combat.over = true;
    combat.outcome = outcome;

    var bot = C.bots.find(sv, combat.botId);
    if (!bot) return;

    sv.player.life = Math.max(1, combat.playerLife);

    if (outcome === 'win') {
      if (C.audio && C.audio.play) C.audio.play('win');
      sv.counters.fightsWon++;
      var xp = cfg.COMBAT.xpPerWin + bot.level;
      A.grantXp(xp);
      bot.life = 0;
      bot.losses++;
      bot.hospitalUntil = sv.meta.gameTime +
        U.randInt(cfg.BOTS.hospitalMinutes[0], cfg.BOTS.hospitalMinutes[1]) * 60;
      /* The bot's own player stats reset when they come out. */
      combat.rewardXp = xp;
      combat.rewardCash = 0;
    } else if (outcome === 'loss') {
      if (C.audio && C.audio.play) C.audio.play('loss');
      sv.counters.fightsLost++;
      A.grantXp(cfg.COMBAT.xpPerLoss);
      var hospSec = U.randInt(cfg.COMBAT.hospitalMinutes[0], cfg.COMBAT.hospitalMinutes[1]) * 60;
      sv.player.hospitalUntil = Math.max(sv.player.hospitalUntil, sv.meta.gameTime) + hospSec;
      sv.counters.hosp++;
      var lost = Math.min(sv.player.cash, Math.round(sv.player.cash * 0.10));
      sv.player.cash -= lost;
      combat.rewardCash = -lost;
      combat.rewardXp = cfg.COMBAT.xpPerLoss;
      combat.hospitalSeconds = hospSec;
      bot.wins++;
      bot.life = bot.maxLife;
    } else if (outcome === 'escaped') {
      sv.counters.fightsFled++;
      bot.life = Math.max(1, combat.botLife);
    }
  }

  /* ---- LEAVING A FINISHED FIGHT --------------------------------------- */
  A.clearCombat = function () {
    var sv = save();
    if (sv.combat && sv.combat.over) {
      sv.combat = null;
      return { ok: true };
    }
    return { ok: false, reason: 'You cannot leave a fight you are still in.' };
  };

  /* ---- POST-WIN CONSEQUENCES ------------------------------------------
     The player chooses what happens after a win: walk away with respect,
     take some cash (mug), or put them in a clinic for longer (hospitalise).
     Each raises the reward and the risk.                                */
  A.resolveWin = function (choice) {
    var sv = save();
    if (!sv.combat || !sv.combat.over || sv.combat.outcome !== 'win') {
      return { ok: false, reason: 'Nothing to resolve.' };
    }
    var bot = C.bots.find(sv, sv.combat.botId);
    if (!bot) { sv.combat = null; return { ok: false, reason: 'They are gone.' }; }

    if (choice === 'mug') {
      var take = Math.round(bot.cash * cfg.COMBAT.mugShare);
      bot.cash -= take;
      sv.player.cash += take;
      if (take > 0 && C.audio && C.audio.play) C.audio.play('cash');
      sv.player.wanted += 1;
      A.grantXp(4);
      sv.combat.log.push({ side: 'system', text: 'You take ' + U.money(take) + ' off them.' });
      sv.combat.resolved = 'mug';
      sv.combat.took = take;
    } else if (choice === 'hospitalise') {
      bot.hospitalUntil = Math.max(bot.hospitalUntil, sv.meta.gameTime) +
        U.randInt(30, 90) * 60;
      sv.player.wanted += 2;
      sv.counters.botsHospitalised++;
      A.grantXp(8);
      sv.combat.log.push({ side: 'system', text: 'You leave them on the ground. Someone will call for help.' });
      sv.combat.resolved = 'hospitalise';
    } else {
      sv.combat.log.push({ side: 'system', text: 'You walk away. Word gets around.' });
      sv.combat.resolved = 'leave';
      sv.player.happiness = Math.min(S.maxHappiness(sv.player) + 5, sv.player.happiness + 5);
    }

    return { ok: true };
  };

  C.actions = A;
})(window.CALIGO);
