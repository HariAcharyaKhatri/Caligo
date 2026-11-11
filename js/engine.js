/* CALIGO — the game clock.
   Everything time-based is expressed as an absolute GAME time stamp on
   the save, which makes offline catch-up and countdowns trivial.

   gameTime advances by (real elapsed seconds) x settings.timeScale, so a
   time scale of 60 runs the whole city sixty times faster for testing.  */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var U = C.util;
  var S = C.state;

  var Engine = {};

  var timer = null;
  var saveSecondsAcc = 0;
  var lastReal = Date.now();
  var liveFns = [];

  Engine.offlineReport = null;

  /* ---- REGEN ---------------------------------------------------------
     Each resource keeps a fractional accumulator. When the accumulator
     passes the configured seconds-per-point, whole points are awarded.
     At maximum the accumulator resets so nothing is banked.             */
  function regenOne(p, key, accKey, rate, maxValue) {
    if (maxValue <= 0) return 0;
    if (p[key] >= maxValue) { p.acc[accKey] = 0; return 0; }
    var gain = Math.floor(p.acc[accKey] / rate);
    if (gain <= 0) return 0;
    p.acc[accKey] -= gain * rate;
    var before = p[key];
    p[key] = Math.min(maxValue, p[key] + gain);
    if (p[key] >= maxValue) p.acc[accKey] = 0;
    return p[key] - before;
  }

  /* ---- APPLY ELAPSED GAME TIME --------------------------------------- */
  Engine.applyElapsed = function (save, dt) {
    if (dt <= 0) return { gained: {} };
    var p = save.player;
    var gained = {};

    save.meta.gameTime += dt;

    p.acc.energy = (p.acc.energy || 0) + dt;
    p.acc.nerve  = (p.acc.nerve || 0) + dt;
    p.acc.life   = (p.acc.life || 0) + dt;

    gained.energy = regenOne(p, 'energy', 'energy', cfg.REGEN.energy, S.maxEnergy(p));
    gained.nerve  = regenOne(p, 'nerve',  'nerve',  cfg.REGEN.nerve,  S.maxNerve(p));
    gained.life   = regenOne(p, 'life',   'life',   cfg.REGEN.life,   S.maxLife(p));

    /* Happiness above the maximum bleeds away. */
    var maxH = S.maxHappiness(p);
    if (p.happiness > maxH) {
      p.acc.happyOver += dt;
      var step = cfg.HAPPINESS_DECAY_SECONDS;
      var drop = Math.floor(p.acc.happyOver / step);
      if (drop > 0) {
        p.acc.happyOver -= drop * step;
        p.happiness = Math.max(maxH, p.happiness - drop);
      }
    } else {
      p.acc.happyOver = 0;
    }

    /* Wanted level decays slowly. */
    if (p.wanted > 0) {
      p.acc.wanted += dt;
      var wStep = cfg.REGEN.wanted;
      var wDrop = Math.floor(p.acc.wanted / wStep);
      if (wDrop > 0) {
        p.acc.wanted -= wDrop * wStep;
        p.wanted = Math.max(0, p.wanted - wDrop);
      }
    } else {
      p.acc.wanted = 0;
    }

    return { gained: gained };
  };

  /* ---- OFFLINE CATCH-UP ----------------------------------------------
     Caps at cfg.OFFLINE_CAP_HOURS of real time before applying the time
     scale, so a long absence never produces an absurd windfall.         */
  Engine.catchUp = function (save) {
    var now = Date.now();
    var elapsedReal = (now - (save.meta.lastReal || now)) / 1000;
    var capped = Math.min(Math.max(0, elapsedReal), cfg.OFFLINE_CAP_HOURS * 3600);
    var scale = save.settings.timeScale || 1;
    var scaled = capped * scale;

    var result = Engine.applyElapsed(save, scaled);

    var report = {
      awayReal: elapsedReal,
      appliedReal: capped,
      capped: elapsedReal > capped,
      gameSeconds: scaled,
      gained: result.gained,
      releasedFromJail: save.player.jailUntil > 0 && save.player.jailUntil <= save.meta.gameTime,
      releasedFromHospital: save.player.hospitalUntil > 0 && save.player.hospitalUntil <= save.meta.gameTime
    };

    save.meta.lastReal = now;
    return report;
  };

  /* ---- TICK ----------------------------------------------------------- */
  Engine.tick = function () {
    var save = C.state.save;
    if (!save) return;

    var now = Date.now();
    var dtReal = Math.max(0, (now - lastReal) / 1000);
    lastReal = now;

    /* Guard against absurd frame gaps (backgrounded tabs) by letting the
       normal catch-up path handle anything over an hour. */
    if (dtReal > 3600) {
      Engine.catchUp(save);
    } else {
      var scale = save.settings.timeScale || 1;
      Engine.applyElapsed(save, dtReal * scale);
      save.meta.lastReal = now;
    }

    Engine.rollWeather(save, now);

    saveSecondsAcc += dtReal;
    if (saveSecondsAcc >= cfg.AUTOSAVE_SECONDS) {
      saveSecondsAcc = 0;
      C.storage.write(save);
    }

    for (var i = 0; i < liveFns.length; i++) {
      try { liveFns[i](save); } catch (e) { console.error(e); }
    }
  };

  /* Weather is rolled once per real calendar day and cached on the save. */
  Engine.rollWeather = function (save, nowMs) {
    if (!save) return;
    save.weather = save.weather || { id: 'clear', dayKey: '' };
    var key = S.dayKey(new Date(nowMs));
    if (save.weather.dayKey === key) return;
    var pick = U.pickWeighted(C.data.weatherTypes);
    save.weather.id = pick ? pick.id : 'clear';
    save.weather.dayKey = key;
  };

  Engine.weather = function (save) {
    if (!save || !save.weather || !save.weather.id) return C.data.weatherTypes[0];
    for (var i = 0; i < C.data.weatherTypes.length; i++) {
      if (C.data.weatherTypes[i].id === save.weather.id) return C.data.weatherTypes[i];
    }
    return C.data.weatherTypes[0];
  };

  /* ---- LIVE UPDATERS --------------------------------------------------
     Screens register functions here instead of re-rendering every second. */
  Engine.live = function (fn) { liveFns.push(fn); };
  Engine.clearLive = function () { liveFns = []; };

  /* ---- START / STOP ---------------------------------------------------- */
  Engine.start = function () {
    Engine.stop();
    lastReal = Date.now();
    saveSecondsAcc = 0;
    timer = window.setInterval(Engine.tick, cfg.TICK_MS);
  };

  Engine.stop = function () {
    if (timer) { window.clearInterval(timer); timer = null; }
  };

  /* Forces a save right now (used on page hide and before exports). */
  Engine.flush = function () {
    if (C.state.save) {
      C.state.save.meta.lastReal = Date.now();
      C.storage.write(C.state.save);
    }
  };

  C.engine = Engine;
})(window.CALIGO);
