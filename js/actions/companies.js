/* CALIGO — companies actions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config, U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.foundCompany = function (companyId) {
    var sv = save();
    var comp = C.data.companies.filter(function (c) { return c.id === companyId; })[0];
    if (!comp) return { ok: false, reason: 'Unknown company.' };
    if (sv.companies.owned) return { ok: false, reason: 'You already own a company.' };
    if (sv.player.cash < comp.cost) return { ok: false, reason: 'You need ' + U.money(comp.cost) + '.' };

    sv.player.cash -= comp.cost;
    sv.companies.owned = companyId;
    sv.companies.foundedAt = sv.meta.gameTime;
    sv.companies.lastCollected = sv.meta.gameTime;
    sv.companies.accrued = 0;
    A.log('Founded ' + comp.name + '.', 'money');
    A.pushMail('Registrar', 'Company registered: ' + comp.name, 'Welcome to the Exchange.');
    return { ok: true };
  };

  A.sellCompany = function () {
    var sv = save();
    var comp = S.company(sv);
    if (!comp) return { ok: false, reason: 'You do not own a company.' };
    var payout = Math.round(comp.cost * 0.6);
    sv.player.cash += payout;
    A.log('Sold ' + comp.name + ' for ' + U.money(payout) + '.', 'money');
    sv.companies.owned = null;
    return { ok: true, payout: payout };
  };

  A.collectCompany = function () {
    var sv = save();
    var comp = S.company(sv);
    if (!comp) return { ok: false, reason: 'No company owned.' };
    var last = sv.companies.lastCollected || sv.companies.foundedAt;
    var elapsed = sv.meta.gameTime - last;
    var days = Math.min(cfg.COMPANIES.maxCollectDays, elapsed / 86400);
    if (days < 0.5) return { ok: false, reason: 'Too soon. Wait half a day.' };

    var profit = Math.floor((comp.dailyIncome - comp.dailyCost) * days);
    if (profit < 0) profit = 0;
    sv.player.cash += profit;
    sv.companies.lastCollected = sv.meta.gameTime;
    A.log(comp.name + ' profit collected: ' + U.money(profit) + '.', 'money');
    return { ok: true, amount: profit };
  };

  C.actions = A;
})(window.CALIGO);
