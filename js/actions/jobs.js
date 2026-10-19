/* CALIGO — job actions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config, U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.applyForJob = function (jobId) {
    var sv = save();
    var job = C.data.jobs.filter(function (j) { return j.id === jobId; })[0];
    if (!job) return { ok: false, reason: 'Unknown job.' };
    if (sv.job.current === jobId) return { ok: false, reason: 'You already work here.' };
    var req = job.ranks[0].req;
    var w = sv.player.work;
    if (req.manual && w.manual < req.manual) return { ok: false, reason: 'Manual labour too low.' };
    if (req.intelligence && w.intelligence < req.intelligence) return { ok: false, reason: 'Intelligence too low.' };
    if (req.endurance && w.endurance < req.endurance) return { ok: false, reason: 'Endurance too low.' };

    sv.job.current = jobId;
    sv.job.rank = 0;
    sv.job.workDays = 0;
    sv.job.payAccrued = 0;
    sv.job.totalDays = 0;
    A.log('Hired at ' + job.name + ' as ' + job.ranks[0].title + '.', 'good');
    return { ok: true };
  };

  A.quitJob = function () {
    var sv = save();
    if (!sv.job.current) return { ok: false, reason: 'You have no job.' };
    var job = S.currentJob(sv);
    sv.job.current = null;
    sv.job.rank = 0; sv.job.workDays = 0;
    sv.counters.jobsQuit++;
    A.log('You quit ' + (job ? job.name : 'your job') + '.', 'info');
    return { ok: true };
  };

  A.workShift = function () {
    var sv = save();
    if (!S.canAct(sv)) return { ok: false, reason: 'You cannot work right now.' };
    var job = S.currentJob(sv);
    if (!job) return { ok: false, reason: 'You have no job.' };
    if (sv.player.energy < cfg.JOBS.energyPerShift) return { ok: false, reason: 'Not enough energy.' };

    sv.player.energy -= cfg.JOBS.energyPerShift;
    sv.player.acc.energy = 0;
    sv.player.happiness = Math.max(0, sv.player.happiness - cfg.JOBS.happinessLossPerShift);

    /* Stats grow from work. */
    sv.player.work.manual += 3 + Math.floor(job.ranks[sv.job.rank].pay / 1000);
    sv.player.work.endurance += 2;
    sv.player.work.intelligence += (job.id === 'teacher' || job.id === 'lawyer' || job.id === 'engineer' || job.id === 'surgeon') ? 3 : 1;

    var rank = S.jobRank(sv);
    var pay = rank ? rank.pay : 500;
    sv.job.payAccrued += pay;
    sv.job.workDays++;
    sv.job.totalDays++;
    sv.counters.works++;

    A.grantXp(cfg.JOBS.workXpPerShift * 3 + sv.job.rank * 2);

    /* Try to promote. */
    var promoted = false;
    if (sv.job.rank + 1 < job.ranks.length) {
      var next = job.ranks[sv.job.rank + 1].req;
      var w = sv.player.work;
      var ok = true;
      if (next.manual && w.manual < next.manual) ok = false;
      if (next.intelligence && w.intelligence < next.intelligence) ok = false;
      if (next.endurance && w.endurance < next.endurance) ok = false;
      if (ok && sv.job.workDays >= (sv.job.rank + 1) * 5) {
        sv.job.rank++;
        sv.job.workDays = 0;
        promoted = true;
        A.log('Promoted: ' + job.ranks[sv.job.rank].title + ' at ' + job.name + '.', 'good');
      }
    }

    A.log('Shift at ' + job.name + '. Accrued ' + U.money(pay) + '.', 'money');
    return { ok: true, pay: pay, promoted: promoted };
  };

  A.collectPay = function () {
    var sv = save();
    if (sv.job.payAccrued <= 0) return { ok: false, reason: 'No accrued pay.' };
    var amt = sv.job.payAccrued;
    sv.job.payAccrued = 0;
    sv.player.cash += amt;
    A.log('Pay collected: ' + U.money(amt) + '.', 'money');
    return { ok: true, amount: amt };
  };

  C.actions = A;
})(window.CALIGO);
