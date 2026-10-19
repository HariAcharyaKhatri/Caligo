/* CALIGO — headline templates for the auto-generated newspaper. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.headlines = {
    crime: [
      'Late-night heist at {place}: nothing taken, nothing left.',
      'Dockside crew walks off with a sealed container.',
      '{place} closes early after a quiet incident nobody reports.',
      'Customs finds a shipment that is not on the manifest.',
      'Third warehouse in a week hits the same shortfall.'
    ],
    market: [
      'Exchange slips after a bad week for shipping.',
      'Rumours of a Ledger restructuring move the board.',
      'Traders see the largest single-session swing this year.',
      'Something on the Spire leaked. The market noticed.'
    ],
    bot: [
      '{name} tops the Leaderboard again. Nobody is surprised.',
      'Report: {name} spends more than most factions earn.',
      '{name} is asking questions about the Council. Loudly.'
    ],
    world: [
      'Concord Council extends the ferry curfew another month.',
      'Weather service warns of a week of fog over the Docks.',
      'Power flickers through the Undercity. Nobody has fixed it.',
      'A minor platform war ends without a public statement.'
    ]
  };

  D.placeNames = ['The Docks', 'The Exchange', 'The Undercity', 'The Spire', 'The Hollows',
                  'Pier Three', 'Rustline Depot', 'Harbor Street', 'Foundry Lane'];
})(window.CALIGO);
