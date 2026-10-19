/* CALIGO — casino game definitions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.casinoGames = [
    { id: 'slots',    name: 'Slots',     blurb: 'Three reels. Match two for 2x, three for 10x.',     edge: 0.10, icon: '◉' },
    { id: 'roulette', name: 'Roulette',  blurb: 'Single number pays 35:1. Colour pays 2:1.',        edge: 0.0526, icon: '◎' },
    { id: 'highlow',  name: 'High-Low',  blurb: 'Card higher or lower than the house card.',        edge: 0.03, icon: '⇅' },
    { id: 'keno',     name: 'Keno',      blurb: 'Pick ten numbers. Match as many as you can.',      edge: 0.25, icon: '⚄' },
    { id: 'craps',    name: 'Craps',     blurb: 'Roll the dice. Pass line bets only.',              edge: 0.014, icon: '⚀' },
    { id: 'bookie',   name: 'The Bookie',blurb: 'Bet on bot races. Odds shift by field size.',      edge: 0.06, icon: '♞' },
    { id: 'blackjack',name: 'Blackjack', blurb: 'Beat the dealer without going bust.',              edge: 0.02, icon: '♠' },
    { id: 'poker',    name: 'Poker',     blurb: 'Texas Hold\'em against three bots.',               edge: 0.05, icon: '♥' }
  ];
})(window.CALIGO);
