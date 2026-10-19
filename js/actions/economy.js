/* CALIGO — bank, item market and travel actions.
   Extends CALIGO.actions.                                                */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config;
  var U = C.util;
  var S = C.state;
  var A = C.actions;
  var D = C.data;

  function save() { return C.state.save; }

  /* ====================================================================
     BANK
     ==================================================================== */

  A.deposit = function (amount) {
    var sv = save();
    amount = Math.floor(amount);
    if (amount <= 0) return { ok: false, reason: 'Nothing to deposit.' };
    if (sv.player.cash < amount) return { ok: false, reason: 'You do not have that much on you.' };
    sv.player.cash -= amount;
    sv.player.bank += amount;
    A.log('Deposited ' + U.money(amount) + ' at the Central Bank.', 'money');
    return { ok: true };
  };

  A.withdraw = function (amount) {
    var sv = save();
    amount = Math.floor(amount);
    if (amount <= 0) return { ok: false, reason: 'Nothing to withdraw.' };
    if (sv.player.bank < amount) return { ok: false, reason: 'Not enough in the account.' };
    sv.player.bank -= amount;
    sv.player.cash += amount;
    A.log('Withdrew ' + U.money(amount) + ' from the Central Bank.', 'money');
    return { ok: true };
  };

  /* Fixed-term deposits: money locked for a set number of game days, paid
     back with a fixed return on maturity. */
  A.buyDeposit = function (depositId, amount) {
    var sv = save();
    amount = Math.floor(amount);
    var tier = null;
    cfg.BANK.deposits.forEach(function (d) { if (d.id === depositId) tier = d; });
    if (!tier) return { ok: false, reason: 'Unknown note.' };
    if (amount < 1000) return { ok: false, reason: 'Minimum is $1,000.' };
    if (sv.player.cash < amount) return { ok: false, reason: 'Not enough cash on hand.' };

    sv.player.cash -= amount;
    sv.bank.deposits.push({
      id: tier.id,
      label: tier.label,
      principal: amount,
      rate: tier.rate,
      maturesAt: sv.meta.gameTime + tier.days * 86400
    });
    A.log('Locked ' + U.money(amount) + ' into a ' + tier.label + '.', 'money');
    return { ok: true };
  };

  A.collectDeposit = function (index) {
    var sv = save();
    var dep = sv.bank.deposits[index];
    if (!dep) return { ok: false, reason: 'That note is gone.' };
    if (dep.maturesAt > sv.meta.gameTime) {
      return { ok: false, reason: 'Not mature for another ' + U.dur(dep.maturesAt - sv.meta.gameTime) + '.' };
    }
    var payout = Math.round(dep.principal * (1 + dep.rate));
    sv.player.cash += payout;
    sv.bank.deposits.splice(index, 1);
    A.log('Note matured. ' + U.money(payout) + ' back in your pocket.', 'money');
    return { ok: true, payout: payout };
  };

  /* Simple savings interest. Paid on demand when the player visits the
     bank, capped at 30 game days of accrual so it never becomes silly.  */
  A.collectSavingsInterest = function () {
    var sv = save();
    if (!sv.bank.savingsAccruedAt) { sv.bank.savingsAccruedAt = sv.meta.gameTime; return { ok: false }; }
    var elapsed = sv.meta.gameTime - sv.bank.savingsAccruedAt;
    if (elapsed < 3600) return { ok: false, reason: 'Too soon.' };
    var days = Math.min(30, elapsed / 86400);
    var interest = Math.floor(sv.player.bank * cfg.BANK.savingsRatePerDay * days);
    if (interest <= 0) return { ok: false, reason: 'Nothing earned yet.' };
    sv.player.bank += interest;
    sv.bank.savingsAccruedAt = sv.meta.gameTime;
    A.log('Savings interest: ' + U.money(interest) + '.', 'money');
    return { ok: true, interest: interest };
  };

  /* Loans: cash now, owed more later, due on a fixed date. */
  A.takeLoan = function (loanId) {
    var sv = save();
    var tier = null;
    cfg.BANK.loans.forEach(function (l) { if (l.id === loanId) tier = l; });
    if (!tier) return { ok: false, reason: 'Unknown loan.' };

    /* One of each tier at a time keeps things legible. */
    var already = sv.bank.loans.some(function (l) { return l.id === loanId; });
    if (already) return { ok: false, reason: 'You already have a loan of that size.' };

    var owed = Math.round(tier.amount * (1 + tier.rate));
    sv.player.cash += tier.amount;
    sv.bank.loans.push({
      id: tier.id,
      label: tier.label,
      principal: tier.amount,
      owed: owed,
      dueAt: sv.meta.gameTime + tier.days * 86400
    });
    A.log('Loan taken: ' + U.money(tier.amount) + ' now, ' + U.money(owed) +
          ' due in ' + tier.days + ' days.', 'money');
    return { ok: true };
  };

  A.repayLoan = function (index) {
    var sv = save();
    var loan = sv.bank.loans[index];
    if (!loan) return { ok: false, reason: 'That loan is gone.' };
    if (sv.player.cash < loan.owed) {
      return { ok: false, reason: 'You need ' + U.money(loan.owed) + ' on hand.' };
    }
    sv.player.cash -= loan.owed;
    sv.bank.loans.splice(index, 1);
    A.log('Loan repaid: ' + U.money(loan.owed) + '.', 'money');
    return { ok: true };
  };

  /* Called from the tick. Overdue loans spawn a collector event. */
  A.checkLoans = function () {
    var sv = save();
    var overdue = sv.bank.loans.filter(function (l) { return l.dueAt <= sv.meta.gameTime; });
    overdue.forEach(function (loan) {
      /* The collector takes what cash you have on hand and adds wanted. */
      var take = Math.min(sv.player.cash, Math.round(loan.owed * 0.5));
      sv.player.cash -= take;
      sv.player.wanted += 3;
      A.log('A collector finds you about the ' + loan.label + '. ' +
        (take > 0 ? 'They take ' + U.money(take) + ' off you. ' : '') +
        'Your record gets worse.', 'bad');
      loan.dueAt = sv.meta.gameTime + 7 * 86400; // roll the due date forward
    });
  };

  /* ====================================================================
     ITEM MARKET
     ==================================================================== */

  /* Bots list items at a spread around base price. Called on first open
     and every cfg.MARKET.refreshMinutes of game time.                   */
  A.refreshMarket = function (force) {
    var sv = save();
    var elapsed = sv.meta.gameTime - (sv.market.lastRefresh || 0);
    if (!force && elapsed < cfg.MARKET.refreshMinutes * 60) return { ok: false };

    /* Which items can be listed? Anything tradeable except pure ammo. */
    var sellable = Object.keys(D.items).filter(function (id) {
      var it = D.items[id];
      return it && it.price > 0 && it.id !== 'fists';
    });

    var listings = [];
    var target = cfg.MARKET.targetListingCount;
    for (var i = 0; i < target; i++) {
      var id = sellable[U.randInt(0, sellable.length - 1)];
      var it = D.items[id];
      var drift = 1 + U.rand(-cfg.MARKET.priceSpread, cfg.MARKET.priceSpread);
      var price = Math.max(1, Math.round(it.price * drift));
      var qty = it.stack ? U.randInt(1, 5) : 1;
      var seller = C.bots.randomSeller(sv);
      listings.push({
        id: 'l_' + U.uid(),
        itemId: id,
        qty: qty,
        price: price,
        sellerName: seller ? seller.name : 'A dockhand',
        listedAt: sv.meta.gameTime
      });
    }
    sv.market.listings = listings;
    sv.market.lastRefresh = sv.meta.gameTime;
    return { ok: true };
  };

  /* Player listings: the player sells their own items. */
  A.listOnMarket = function (itemId, qty, price) {
    var sv = save();
    var it = D.items[itemId];
    qty = Math.max(1, Math.floor(qty));
    price = Math.max(1, Math.floor(price));
    if (!it) return { ok: false, reason: 'Unknown item.' };
    if (S.itemQty(sv, itemId) < qty) return { ok: false, reason: 'You do not have that many.' };
    if (sv.market.playerListings.length >= cfg.MARKET.maxListings) {
      return { ok: false, reason: 'Your listing slots are full.' };
    }

    A.removeItem(itemId, qty);
    sv.market.playerListings.push({
      id: 'pl_' + U.uid(),
      itemId: itemId,
      qty: qty,
      price: price,
      listedAt: sv.meta.gameTime,
      expiresAt: sv.meta.gameTime + cfg.MARKET.playerListingExpiryHours * 3600
    });
    A.log('Listed ' + qty + '× ' + it.name + ' at ' + U.money(price) + ' each.', 'info');
    return { ok: true };
  };

  A.cancelListing = function (listingId) {
    var sv = save();
    for (var i = 0; i < sv.market.playerListings.length; i++) {
      if (sv.market.playerListings[i].id === listingId) {
        var l = sv.market.playerListings[i];
        A.addItem(l.itemId, l.qty);
        sv.market.playerListings.splice(i, 1);
        return { ok: true };
      }
    }
    return { ok: false, reason: 'Listing not found.' };
  };

  /* Called from the tick. Player listings sell over time based on how
     close the asking price is to the market average.                    */
  A.tickMarketSales = function () {
    var sv = save();
    var elapsed = sv.meta.gameTime - (sv.market.lastSaleTick || 0);
    if (elapsed < cfg.MARKET.saleTickMinutes * 60) return;
    sv.market.lastSaleTick = sv.meta.gameTime;

    var ticks = Math.floor(elapsed / (cfg.MARKET.saleTickMinutes * 60));
    for (var t = 0; t < ticks; t++) {
      var stillListed = [];
      sv.market.playerListings.forEach(function (l) {
        /* Expired listings return the goods. */
        if (l.expiresAt <= sv.meta.gameTime) {
          A.addItem(l.itemId, l.qty);
          A.log('Your listing of ' + D.items[l.itemId].name + ' expired. Goods returned.', 'info');
          return;
        }
        var avg = S.marketAverage(sv, l.itemId) || D.items[l.itemId].price;
        var ratio = l.price / Math.max(1, avg);
        /* Sell chance falls as price rises above market average. */
        var chance;
        if (ratio <= 0.5) chance = cfg.MARKET.sellChanceAtHalf;
        else if (ratio >= 2) chance = cfg.MARKET.sellChanceAtDouble;
        else {
          chance = cfg.MARKET.sellChanceAtMarket +
            (1 - ratio) * (cfg.MARKET.sellChanceAtHalf - cfg.MARKET.sellChanceAtMarket) / 0.5;
          chance = U.clamp(chance, cfg.MARKET.sellChanceAtDouble, cfg.MARKET.sellChanceAtHalf);
        }
        if (U.chance(chance)) {
          var gross = l.price * l.qty;
          var fee = Math.max(1, Math.round(gross * 0.05));
          sv.player.cash += gross - fee;
          sv.counters.marketSells++;
          A.log('Sold ' + l.qty + '× ' + D.items[l.itemId].name + ' for ' +
                U.money(gross - fee) + ' (fee ' + U.money(fee) + ').', 'money');
        } else {
          stillListed.push(l);
        }
      });
      sv.market.playerListings = stillListed;
    }
  };

  A.buyListing = function (listingId, qty) {
    var sv = save();
    qty = Math.max(1, Math.floor(qty || 1));
    for (var i = 0; i < sv.market.listings.length; i++) {
      var l = sv.market.listings[i];
      if (l.id !== listingId) continue;
      if (qty > l.qty) return { ok: false, reason: 'They do not have that many.' };
      var cost = l.price * qty;
      if (sv.player.cash < cost) return { ok: false, reason: 'Not enough cash on hand.' };

      sv.player.cash -= cost;
      A.addItem(l.itemId, qty);
      l.qty -= qty;
      if (l.qty <= 0) sv.market.listings.splice(i, 1);
      sv.counters.marketBuys++;
      A.log('Bought ' + qty + '× ' + D.items[l.itemId].name + ' for ' + U.money(cost) + '.', 'money');
      return { ok: true, cost: cost };
    }
    return { ok: false, reason: 'Listing is gone.' };
  };

  /* ====================================================================
     TRAVEL
     ==================================================================== */

  A.travelPlatform = function (platformId) {
    var sv = save();
    var cfgP = cfg.TRAVEL.platforms[platformId];
    if (!cfgP) return { ok: false, reason: 'Unknown platform.' };
    if (sv.player.location === platformId) return { ok: false, reason: 'You are already there.' };
    if (!S.canAct(sv)) return { ok: false, reason: 'You cannot travel right now.' };
    if (sv.player.cash < cfgP.cost) return { ok: false, reason: 'Not enough cash on hand.' };

    sv.player.cash -= cfgP.cost;
    sv.player.travelFrom = sv.player.location;
    sv.player.travelTo = platformId;
    sv.player.travelUntil = sv.meta.gameTime + cfgP.minutes * 60;
    A.log('Ferry booked to ' + D.platforms[platformId].name + '. ' +
          cfgP.minutes + ' minutes.', 'info');
    return { ok: true };
  };

  A.travelAbroad = function (destId, classId) {
    var sv = save();
    var dest = D.destById[destId];
    if (!dest) return { ok: false, reason: 'Unknown destination.' };
    var cls = null;
    D.flightClasses.forEach(function (c) { if (c.id === classId) cls = c; });
    if (!cls) cls = D.flightClasses[0];

    if (sv.player.abroad) return { ok: false, reason: 'You are already abroad.' };
    if (S.inTransit(sv)) return { ok: false, reason: 'You are already in transit.' };
    if (S.isJailed(sv) || S.isHospital(sv)) return { ok: false, reason: 'You cannot fly right now.' };

    var cost = Math.round(dest.ticket * cls.costMult);
    var minutes = Math.round(dest.minutes * cls.timeMult);
    if (sv.player.cash < cost) return { ok: false, reason: 'Not enough cash for the ticket.' };

    sv.player.cash -= cost;
    sv.player.travelTo = 'abroad:' + destId;
    sv.player.travelFrom = sv.player.location;
    sv.player.travelUntil = sv.meta.gameTime + minutes * 60;
    sv.counters.flightsTaken++;
    A.log('Booked ' + cls.label + ' passage to ' + dest.name + ' (' + U.money(cost) + ').', 'money');
    return { ok: true, cost: cost, minutes: minutes };
  };

  A.travelHome = function () {
    var sv = save();
    if (!sv.player.abroad) return { ok: false, reason: 'You are not abroad.' };
    if (S.inTransit(sv)) return { ok: false, reason: 'You are already in transit.' };
    var dest = D.destById[sv.player.abroad];
    if (!dest) return { ok: false, reason: 'Unknown destination.' };

    var cost = Math.round(dest.ticket * 1.0); /* economy return */
    if (sv.player.cash < cost) return { ok: false, reason: 'Not enough for the ticket home.' };

    sv.player.cash -= cost;
    sv.player.travelTo = 'home';
    sv.player.travelFrom = 'abroad:' + sv.player.abroad;
    sv.player.travelUntil = sv.meta.gameTime + dest.minutes * 60;
    A.log('Booked passage back to Caligo (' + U.money(cost) + ').', 'money');
    return { ok: true, cost: cost };
  };

  /* Buy exclusive goods at a foreign destination. */
  A.buyTradeGood = function (destId, itemId, qty) {
    var sv = save();
    qty = Math.max(1, Math.floor(qty || 1));
    var dest = D.destById[destId];
    if (!dest) return { ok: false, reason: 'Unknown destination.' };
    if (sv.player.abroad !== destId) return { ok: false, reason: 'You are not there.' };

    var entry = null;
    dest.goods.forEach(function (g) { if (g.id === itemId) entry = g; });
    if (!entry) return { ok: false, reason: 'Not sold here.' };

    /* Carry capacity limits how much you can bring home. */
    var carried = 0;
    sv.inventory.forEach(function (st) {
      var it = D.items[st.id];
      if (it && it.cat === 'trade') carried += st.qty;
    });
    if (carried + qty > S.totalCarry(sv)) {
      return { ok: false, reason: 'You cannot carry that much. Buy a suitcase at the market.' };
    }

    var cost = entry.cost * qty;
    if (sv.player.cash < cost) return { ok: false, reason: 'Not enough local cash.' };
    sv.player.cash -= cost;
    A.addItem(itemId, qty);
    A.log('Bought ' + qty + '× ' + D.items[itemId].name + ' for ' + U.money(cost) + '.', 'money');
    return { ok: true, cost: cost };
  };

  /* Completes a trip that has finished its timer. Called from the tick. */
  A.completeTravel = function () {
    var sv = save();
    if (!sv.player.travelUntil || sv.player.travelUntil > sv.meta.gameTime) return;
    var to = sv.player.travelTo;
    if (!to) { sv.player.travelUntil = 0; return; }

    if (to === 'home') {
      sv.player.abroad = null;
      sv.player.location = sv.player.travelFrom && sv.player.travelFrom.indexOf('abroad:') === 0
        ? 'docks' : (sv.player.location || 'docks');
      A.log('You step off the plane at Caligo. The air tastes like diesel.', 'info');
    } else if (to.indexOf('abroad:') === 0) {
      var destId = to.slice(7);
      sv.player.abroad = destId;
      A.log('You land in ' + D.destById[destId].name + '.', 'info');
    } else {
      sv.player.location = to;
      A.log('Ferry docks at ' + D.platforms[to].name + '.', 'info');
    }
    sv.player.travelTo = null;
    sv.player.travelFrom = null;
    sv.player.travelUntil = 0;
  };

  C.actions = A;
})(window.CALIGO);
