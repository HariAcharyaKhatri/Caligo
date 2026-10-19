/* CALIGO — the six factions. Each has perks, requirements, and a founding cost. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.factions = [
    { id: 'ironhides', name: 'The Ironhides', platform: 'docks',
      blurb: 'Smugglers with a code. They honour a deal even when it costs them.',
      perk: '+10% smuggling income', req: { level: 5, stat: 'strength', value: 200 } },
    { id: 'ledger', name: 'The Ledger', platform: 'exchange',
      blurb: 'Accountants, brokers and quiet hackers in expensive shoes.',
      perk: '+15% hacking and fraud success', req: { level: 10, stat: 'intelligence', value: 500 } },
    { id: 'vermilion', name: 'The Vermilion', platform: 'undercity',
      blurb: 'Street cartel. Loud, proud, and everywhere below the Exchange.',
      perk: '+15% street trade profit', req: { level: 8, stat: 'strength', value: 300 } },
    { id: 'choir', name: 'The Choir', platform: 'spire',
      blurb: 'Mercenaries with a Spire address and a very good lawyer.',
      perk: '+20% combat damage', req: { level: 12, stat: 'strength', value: 1000 } },
    { id: 'guild', name: 'The Guild', platform: 'hollows',
      blurb: 'Neutral crafters. Weapons, gadgets, and quiet precision.',
      perk: '+15% crafting', req: { level: 6, stat: 'intelligence', value: 300 } },
    { id: 'hollow', name: 'The Hollow', platform: 'hollows',
      blurb: 'Anarchist hackers. Secretive, dangerous, and no fixed territory.',
      perk: '+25% cyber crime', req: { level: 15, stat: 'intelligence', value: 500 } }
  ];

  /* Bot member names for faction rosters. */
  D.factionBotRoles = ['Leader', 'Co-leader', 'Officer', 'Officer', 'Member', 'Member', 'Member', 'Recruit'];
})(window.CALIGO);
