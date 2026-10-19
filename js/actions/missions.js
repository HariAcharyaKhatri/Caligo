/* CALIGO — story and daily mission tracking. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.missionProgress = function (mission) {
    var sv = save();
    var c = sv.counters, p = sv.player;
    switch (mission.goal.type) {
      case 'cash':         return Math.min(mission.goal.target, p.cash + p.bank);
      case 'crimes':       return Math.min(mission.goal.target, c.crimesOk);
      case 'wins':         return Math.min(mission.goal.target, c.fightsWon);
      case 'trains':       return Math.min(mission.goal.target, c.trains);
      case 'spend':        return Math.min(mission.goal.target, c.spends || 0);
      case 'works':        return Math.min(mission.goal.target, c.works || 0);
      case 'courses':      return Math.min(mission.goal.target, c.coursesCompleted || 0);
      case 'marketBuys':   return Math.min(mission.goal.target, c.marketBuys);
      case 'debt':         return p.cash >= mission.goal.target ? mission.goal.target : 0;
      case 'faction':      return sv.faction.id ? 1 : 0;
      case 'level_cash':   return p.level >= mission.goal.target && (p.cash + p.bank) >= 100000 ? 1 : 0;
    }
    return 0;
  };

  A.claimStoryMission = function () {
    var sv = save();
    var m = C.data.storyMissions[sv.missions.story];
    if (!m) return { ok: false, reason: 'No more story missions.' };
    if (sv.missions.storyClaimed.indexOf(m.id) !== -1) return { ok: false, reason: 'Already claimed.' };
    var prog = A.missionProgress(m);
    if (prog < m.goal.target) return { ok: false, reason: 'Not complete yet.' };

    sv.missions.storyClaimed.push(m.id);
    sv.missions.story++;
    sv.player.cash += m.reward;
    A.grantXp(50);
    A.log('Story mission: ' + m.name + ' — ' + U.money(m.reward) + '.', 'money');
    A.pushMail(m.npc, 'Mission complete: ' + m.name, 'Good work. The reward is in your pocket.');
    return { ok: true };
  };

  A.rollDailyMissions = function () {
    var sv = save();
    var key = S.dayKey();
    if (sv.missions.daily.dayKey === key) return;
    var pool = C.data.dailyMissions.slice();
    /* Shuffle and take 3. */
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    sv.missions.daily = { dayKey: key, list: pool.slice(0, 3) };
    sv.missions.dailyClaimed = {};
  };

  A.claimDailyMission = function (id) {
    var sv = save();
    var list = (sv.missions.daily && sv.missions.daily.list) || [];
    var m = list.filter(function (x) { return x.id === id; })[0];
    if (!m) return { ok: false, reason: 'Unknown mission.' };
    if (sv.missions.dailyClaimed[id]) return { ok: false, reason: 'Already claimed.' };
    var prog = A.missionProgress(m);
    if (prog < m.goal.target) return { ok: false, reason: 'Not complete yet.' };
    sv.missions.dailyClaimed[id] = true;
    sv.player.cash += m.reward;
    A.log('Daily mission: ' + m.text + ' — ' + U.money(m.reward) + '.', 'money');
    return { ok: true };
  };

  C.actions = A;
})(window.CALIGO);
