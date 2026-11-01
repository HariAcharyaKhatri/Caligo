/* CALIGO — save, load, versioning. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var Store = {};

  Store.available = (function () {
    try { var k = '__c__'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  })();
  Store.memory = null;

  Store.write = function (save) {
    var json = JSON.stringify(save);
    if (Store.available) { try { window.localStorage.setItem(cfg.SAVE_KEY, json); return true; } catch (e) {} }
    Store.memory = json;
    return false;
  };
  Store.read = function () {
    var json = null;
    if (Store.available) { try { json = window.localStorage.getItem(cfg.SAVE_KEY); } catch (e) {} }
    if (!json) json = Store.memory;
    if (!json) return null;
    try { return JSON.parse(json); } catch (e) { return null; }
  };
  Store.clear = function () {
    Store.memory = null;
    if (Store.available) { try { window.localStorage.removeItem(cfg.SAVE_KEY); } catch (e) {} }
  };

  var migrations = {
    1: function (save) {
      save.version = 2;
      save.bots = save.bots || [];
      save.bank = save.bank || { savings: 0, loans: [], deposits: [], savingsAccruedAt: 0 };
      save.market = save.market || { listings: [], playerListings: [], lastRefresh: 0, lastSaleTick: 0 };
      save.combat = null;
      save.player.location = save.player.location || 'docks';
      save.player.abroad = null;
      save.player.travelUntil = 0;
      save.player.travelTo = null; save.player.travelFrom = null;
      save.flags = save.flags || { platform: 'docks' };
      var c = save.counters;
      ['fightsWon','fightsLost','fightsFled','botsHospitalised','marketBuys','marketSells','flightsTaken'].forEach(function (k) { c[k] = c[k] || 0; });
      return save;
    },
    2: function (save) {
      save.version = 3;
      /* Phase 3 additions. */
      save.player.work = save.player.work || { manual: 0, intelligence: 0, endurance: 0 };
      save.player.merits = save.player.merits || 0;
      save.player.meritsSpent = save.player.meritsSpent || 0;
      save.player.points = save.player.points || 0;
      save.job = save.job || { current: null, rank: 0, workDays: 0, payAccrued: 0, lastWorked: 0, totalDays: 0 };
      save.education = save.education || { active: null, completed: [], startedAt: 0 };
      save.companies = save.companies || { owned: null };
      save.faction = save.faction || { id: null, role: null, joinedAt: 0, war: null, chain: 0, chainExpires: 0, respect: 0 };
      save.territories = save.territories || {};
      save.casino = save.casino || { tokens: 0, tokensClaimedAt: 0, betsToday: 0, netWon: 0, streak: 0 };
      save.missions = save.missions || { story: 0, daily: {}, dailyClaimed: {}, storyClaimed: [] };
      save.lists = save.lists || { friends: [], enemies: [], targets: [] };
      save.mail = save.mail || [];
      save.events = save.events || [];
      save.counters = save.counters || {};
      ['works','coursesCompleted','spends','jobsQuit'].forEach(function (k) { save.counters[k] = save.counters[k] || 0; });
      return save;
    },
    3: function (save) {
      save.version = 4;
      /* Phase 4 additions: Merits Allocation, Enhancers & Properties */
      save.player.meritUpgrades = save.player.meritUpgrades || {
        sharpness: 0, brawn: 0, protection: 0, evasion: 0,
        crit: 0, nerve_bar: 0, ce: 0, edu: 0, bank: 0, mug: 0, life: 0
      };
      save.player.property = save.player.property || 'shack';
      save.player.propertiesOwned = save.player.propertiesOwned || ['shack'];
      save.forums = save.forums || [];
      return save;
    }
  };

  Store.migrate = function (save) {
    if (!save || !save.version) return null;
    var v = save.version;
    while (v < cfg.SAVE_VERSION) {
      var step = migrations[v];
      if (!step) return null;
      save = step(save);
      v = save.version;
    }
    return save;
  };

  Store.repair = function (save) {
    if (!save || !save.player) return null;
    var fresh = C.state.newSave(
      (save.meta && save.meta.name) || 'Nameless',
      (save.meta && save.meta.avatar) || '◈'
    );
    for (var k in fresh) {
      if (!Object.prototype.hasOwnProperty.call(fresh, k)) continue;
      if (save[k] === undefined || save[k] === null) save[k] = fresh[k];
    }
    for (var pk in fresh.player) {
      if (!Object.prototype.hasOwnProperty.call(fresh.player, pk)) continue;
      if (save.player[pk] === undefined || save.player[pk] === null) save.player[pk] = fresh.player[pk];
    }
    ['settings','counters','bank','market','player','flags'].forEach(function (parent) {
      if (!save[parent]) return;
      for (var k in fresh[parent]) {
        if (save[parent][k] === undefined) save[parent][k] = fresh[parent][k];
      }
    });
    ['job','education','companies','faction','territories','casino','missions','lists'].forEach(function (k) {
      if (!save[k]) save[k] = fresh[k];
    });
    if (!save.player.meritUpgrades) {
      save.player.meritUpgrades = {
        sharpness: 0, brawn: 0, protection: 0, evasion: 0,
        crit: 0, nerve_bar: 0, ce: 0, edu: 0, bank: 0, mug: 0, life: 0
      };
    }
    if (!save.player.property) save.player.property = 'shack';
    if (!save.player.propertiesOwned) save.player.propertiesOwned = ['shack'];
    if (!save.meta.lastReal) save.meta.lastReal = Date.now();
    if (save.meta.gameTime === undefined) save.meta.gameTime = 0;
    return save;
  };

  Store.exportText = function (save) { return JSON.stringify(save); };
  Store.importText = function (text) {
    var save = JSON.parse(text);
    save = Store.migrate(save);
    if (!save) throw new Error('Unsupported save version.');
    return Store.repair(save);
  };

  C.storage = Store;
})(window.CALIGO);
