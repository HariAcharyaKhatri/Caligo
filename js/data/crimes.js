/* CALIGO — crime table, tiers 1 through 6 (Phase 1 scope).
   jail: [minMinutes, maxMinutes] of game time, scaled by cfg.JAIL.timeScale.
   reward: [min, max] cash before target wealth / size modifiers.          */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  D.crimes = [
    {
      id: 'pickpocket', name: 'Pickpocket', tier: 1, cl: 1, nerve: 1,
      base: 0.60, jail: [2, 5], wanted: 1, reward: [50, 500],
      target: 'person', tags: ['stealth'],
      desc: 'Lift a wallet from a mark who is not paying attention.'
    },
    {
      id: 'shoplift', name: 'Shoplift', tier: 1, cl: 1, nerve: 2,
      base: 0.55, jail: [5, 10], wanted: 1, reward: [100, 300],
      target: 'store', tags: ['stealth'],
      desc: 'Walk out with goods you did not pay for.'
    },
    {
      id: 'mugging', name: 'Mugging', tier: 2, cl: 2, nerve: 3,
      base: 0.50, jail: [10, 20], wanted: 2, reward: [200, 2000],
      target: 'person', tags: ['street'],
      desc: 'Corner an adult mark and demand what they are carrying.'
    },
    {
      id: 'bike_theft', name: 'Bike Theft', tier: 2, cl: 2, nerve: 2,
      base: 0.65, jail: [5, 10], wanted: 1, reward: [200, 10000],
      target: 'vehicle', tags: ['lock'],
      desc: 'Cut a lock, ride off, hope nobody looks up.'
    },
    {
      id: 'phone_snatch', name: 'Phone Snatching', tier: 2, cl: 2, nerve: 2,
      base: 0.70, jail: [5, 10], wanted: 1, reward: [300, 1000],
      target: 'person', tags: ['street'],
      desc: 'Take the device and sprint. Keep the sprint short.'
    },
    {
      id: 'car_theft', name: 'Car Theft', tier: 3, cl: 3, nerve: 5,
      base: 0.45, jail: [20, 40], wanted: 3, reward: [5000, 500000],
      target: 'vehicle', tags: ['lock', 'vehicle'],
      desc: 'Hotwire something with four wheels and a resale value.'
    },
    {
      id: 'store_robbery', name: 'Store Robbery', tier: 3, cl: 3, nerve: 6,
      base: 0.50, jail: [20, 40], wanted: 3, reward: [2000, 100000],
      target: 'store', tags: ['armed'],
      desc: 'Empty the till and whatever is in the back safe.'
    },
    {
      id: 'burglary', name: 'Burglary', tier: 4, cl: 4, nerve: 7,
      base: 0.40, jail: [30, 60], wanted: 4, reward: [5000, 500000],
      target: 'residence', tags: ['lock', 'stealth'],
      desc: 'Enter a home that is supposed to be empty right now.'
    },
    {
      id: 'gas_station', name: 'Gas Station Robbery', tier: 4, cl: 4, nerve: 5,
      base: 0.55, jail: [15, 30], wanted: 3, reward: [2000, 50000],
      target: 'store', tags: ['armed'],
      desc: 'A quick late-shift till grab on the dock road.'
    },
    {
      id: 'armed_robbery', name: 'Armed Robbery', tier: 5, cl: 5, nerve: 10,
      base: 0.35, jail: [45, 90], wanted: 5, reward: [2000, 5000000],
      target: 'store', tags: ['armed', 'vehicle'],
      desc: 'Go in loud, go in fast, go in with a plan for the exit.'
    },
    {
      id: 'atm_skimming', name: 'ATM Skimming', tier: 5, cl: 5, nerve: 3,
      base: 0.60, jail: [10, 20], wanted: 2, reward: [5000, 50000],
      target: 'atm', tags: ['electronics'],
      desc: 'Fit a skimmer, wait, harvest the card data.'
    },
    {
      id: 'card_skimming', name: 'Card Skimming', tier: 6, cl: 6, nerve: 4,
      base: 0.55, jail: [15, 30], wanted: 2, reward: [5000, 50000],
      target: 'atm', tags: ['electronics'],
      desc: 'Clone cards from a terminal somebody already compromised.'
    },
    {
      id: 'forgery', name: 'Forgery', tier: 6, cl: 6, nerve: 3,
      base: 0.50, jail: [10, 20], wanted: 2, reward: [500, 100000],
      target: 'document', tags: ['forgery'],
      desc: 'Print paper that survives a bored clerk and a bad lamp.'
    }
  ];

  D.crimeById = {};
  D.crimes.forEach(function (c) { D.crimeById[c.id] = c; });

  D.crimesByTier = {};
  D.crimes.forEach(function (c) {
    if (!D.crimesByTier[c.tier]) D.crimesByTier[c.tier] = [];
    D.crimesByTier[c.tier].push(c);
  });

  /* Short flavour lines written to the activity log after a job. */
  D.crimeFlavour = {
    ok: [
      'Clean. Nobody looked up.',
      'In and out before the street noticed.',
      'You walk away at a normal pace. Normal paces matter.',
      'The take is thin but the job was quiet.',
      'Somebody two blocks away is only now realising.'
    ],
    fail: [
      'A hand closes on your wrist.',
      'Someone shouts. Someone always shouts.',
      'The plan lasted eleven seconds.',
      'A camera you did not see was doing its job.',
      'You are halfway through the window when the light comes on.'
    ],
    crit: [
      'It goes wrong in a way that needs a doctor.',
      'You get clear of the scene but not of the damage.',
      'A fall, a crack, and a very long night.'
    ]
  };
})(window.CALIGO);
