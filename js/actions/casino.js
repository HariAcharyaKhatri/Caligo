/* CALIGO — casino games. Fictional currency only. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var cfg = C.config, U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.claimCasinoTokens = function () {
    var sv = save();
    var now = sv.meta.gameTime;
    if (now - (sv.casino.tokensClaimedAt || 0) < 86400) {
      return { ok: false, reason: 'Already claimed. Come back later.' };
    }
    sv.casino.tokens += cfg.CASINO.dailyTokens;
    sv.casino.tokensClaimedAt = now;
    if (C.audio && C.audio.play) C.audio.play('coin');
    A.log('Claimed ' + cfg.CASINO.dailyTokens + ' casino tokens.', 'money');
    return { ok: true, amount: cfg.CASINO.dailyTokens };
  };

  A.playCasino = function (gameId, bet) {
    var sv = save();
    bet = Math.floor(bet);
    if (bet < cfg.CASINO.minBet) return { ok: false, reason: 'Minimum bet is ' + U.money(cfg.CASINO.minBet) + '.' };
    if (bet > cfg.CASINO.maxBet) return { ok: false, reason: 'Maximum bet is ' + U.money(cfg.CASINO.maxBet) + '.' };
    if (sv.player.cash < bet) return { ok: false, reason: 'Not enough cash on hand.' };

    sv.player.cash -= bet;
    sv.casino.betsToday++;
    sv.counters.spends += bet;

    var game = C.data.casinoGames.filter(function (g) { return g.id === gameId; })[0];
    if (!game) { sv.player.cash += bet; return { ok: false, reason: 'Unknown game.' }; }

    var payout = 0;
    var detail = '';
    switch (gameId) {
      case 'slots': {
        var reels = [U.randInt(0, 6), U.randInt(0, 6), U.randInt(0, 6)];
        var matches = 0;
        if (reels[0] === reels[1]) matches++;
        if (reels[1] === reels[2]) matches++;
        if (reels[0] === reels[2]) matches++;
        if (reels[0] === reels[1] && reels[1] === reels[2]) { payout = bet * 10; detail = 'Three of a kind!'; }
        else if (matches >= 1) { payout = bet * 2; detail = 'Two match.'; }
        else { detail = 'No match.'; }
        break;
      }
      case 'roulette': {
        var n = U.randInt(0, 36);
        if (n === 0) { payout = bet * 36; detail = 'Zero! Big win.'; }
        else if (n % 2 === 0) { payout = bet * 2; detail = 'Even: ' + n; }
        else { detail = 'Odd: ' + n; }
        break;
      }
      case 'highlow': {
        var house = U.randInt(1, 13);
        var player = U.randInt(1, 13);
        if (player > house) { payout = bet * 2; detail = player + ' vs ' + house + ' — you win.'; }
        else { detail = player + ' vs ' + house + ' — house wins.'; }
        break;
      }
      case 'keno': {
        var matches = 0;
        for (var i = 0; i < 10; i++) {
          if (U.chance(0.25)) matches++;
        }
        payout = bet * Math.pow(2, Math.min(matches, 8)) / 10;
        payout = Math.round(payout);
        detail = matches + ' numbers matched.';
        break;
      }
      case 'craps': {
        var d1 = U.randInt(1, 6), d2 = U.randInt(1, 6);
        var sum = d1 + d2;
        if (sum === 7 || sum === 11) { payout = bet * 2; detail = 'Rolled ' + sum + '. Winner!'; }
        else if (sum === 2 || sum === 3 || sum === 12) { detail = 'Rolled ' + sum + '. Craps.'; }
        else { detail = 'Rolled ' + sum + '. Push.'; payout = bet; }
        break;
      }
      case 'bookie': {
        var winner = U.chance(0.16);
        if (winner) { payout = bet * 6; detail = 'Your runner wins.'; }
        else { detail = 'Your runner places.'; }
        break;
      }
      case 'blackjack': {
        var playerTotal = 15 + U.randInt(0, 6);
        var dealerTotal = 15 + U.randInt(0, 6);
        if (playerTotal === 21) { payout = Math.round(bet * 2.5); detail = 'Blackjack!'; }
        else if (playerTotal > dealerTotal) { payout = bet * 2; detail = playerTotal + ' beats ' + dealerTotal + '.'; }
        else if (playerTotal === dealerTotal) { payout = bet; detail = 'Push at ' + playerTotal + '.'; }
        else { detail = playerTotal + ' loses to ' + dealerTotal + '.'; }
        break;
      }
      case 'poker': {
        var rank = U.randInt(0, 8);
        if (rank >= 6) { payout = bet * 3; detail = 'Strong hand. You take the pot.'; }
        else if (rank >= 4) { payout = bet * 2; detail = 'You win a small pot.'; }
        else if (rank >= 2) { payout = bet; detail = 'Split pot.'; }
        else { detail = 'Bots take the pot.'; }
        break;
      }
    }

    payout = Math.round(payout);
    sv.player.cash += payout;
    sv.casino.netWon += (payout - bet);

    if (payout > bet * 5) sv.casino.streak = 0;   // novelty tracking
    var profit = payout - bet;

    if (C.audio && C.audio.play) {
      if (profit > 0) {
        C.audio.play(payout >= bet * 5 ? 'win' : 'ding');
      } else if (payout === 0) {
        C.audio.play('loss');
      } else {
        C.audio.play('spin');
      }
    }

    return { ok: true, payout: payout, profit: profit, detail: detail, game: game.name };
  };

  A.tickCasino = function () {
    var sv = save();
    if (!sv || !sv.casino) return;
    var now = sv.meta.gameTime;
    if (!sv.casino.lastDayReset) sv.casino.lastDayReset = now;
    if (now - sv.casino.lastDayReset >= 86400) {
      sv.casino.betsToday = 0;
      sv.casino.lastDayReset = now;
    }
  };

  C.actions = A;
})(window.CALIGO);
