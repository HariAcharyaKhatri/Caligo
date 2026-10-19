/* CALIGO — bot tiers, name pools and behaviour flavour. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* Seven tiers. Stats are rolled per bot between statRange[0] and [1],
     so a low-tier bot can still surprise and a high-tier one can be soft. */
  D.botTiers = [
    { id: 'thug',     name: 'Street Thug',      levelRange: [1, 5],   statRange: [8, 30],    cashRange: [200, 2500],         lifeBase: 80 },
    { id: 'mugger',   name: 'Mugger',           levelRange: [3, 8],   statRange: [18, 55],   cashRange: [600, 6000],         lifeBase: 100 },
    { id: 'gang',     name: 'Gang Member',      levelRange: [6, 12],  statRange: [40, 110],  cashRange: [2500, 25000],       lifeBase: 130 },
    { id: 'enforcer', name: 'Enforcer',         levelRange: [10, 18], statRange: [85, 240],  cashRange: [12000, 120000],     lifeBase: 180 },
    { id: 'hitman',   name: 'Hitman',           levelRange: [15, 25], statRange: [190, 430], cashRange: [60000, 600000],     lifeBase: 250 },
    { id: 'boss',     name: 'Crime Boss',       levelRange: [25, 35], statRange: [380, 780], cashRange: [250000, 2500000],   lifeBase: 350 },
    { id: 'kingpin',  name: 'Cartel Kingpin',   levelRange: [35, 50], statRange: [700, 1500], cashRange: [1200000, 12000000], lifeBase: 500 }
  ];

  D.botTierById = {};
  D.botTiers.forEach(function (t) { D.botTierById[t.id] = t; });

  /* Tier weights, lower tiers are far more common. */
  D.botTierWeights = [30, 25, 18, 12, 8, 5, 2];

  D.botBuilds = ['wiry', 'heavy', 'average', 'small', 'tall', 'stocky'];

  D.botAwareness = [
    { id: 'distracted', label: 'Distracted', mod: 15,  w: 25 },
    { id: 'normal',     label: 'Normal',     mod: 0,   w: 50 },
    { id: 'alert',      label: 'Alert',      mod: -15, w: 20 },
    { id: 'paranoid',   label: 'Paranoid',   mod: -25, w: 5 }
  ];

  D.botActivities = [
    'walking the waterfront', 'unloading crates', 'arguing with a vendor',
    'counting a stack of bills', 'drinking alone', 'smoking by the fence',
    'checking a burner phone', 'pacing near the ferry',
    'watching the dock traffic', 'talking to a customs clerk',
    'loading a van nobody owns', 'reading a shipping manifest'
  ];

  D.botOccupations = [
    'Dockhand', 'Broker', 'Courier', 'Security guard', 'Bartender',
    'Customs clerk', 'Freelancer', 'Street vendor', 'Bookkeeper',
    'Mechanic', 'Rigger', 'Off-duty officer', 'Smuggler', 'Fence',
    'Rumour merchant', 'Debt collector'
  ];

  /* Short lines added to combat logs to keep fights legible. */
  D.combatFlavour = {
    playerHit: [
      'You land clean.',
      'The strike connects.',
      'A short, ugly impact.',
      'Your shot goes where you meant it.',
      'A hit. Small mercy.'
    ],
    botHit: [
      'They answer hard.',
      'A solid reply.',
      'You feel that one.',
      'Their shot finds you.',
      'A hit you will remember.'
    ],
    miss: [
      'You swing at air.',
      'A miss, wide left.',
      'You hear it pass.',
      'Nothing but the pavement.',
      'A clean miss.'
    ],
    koWin: [
      'They fold and stop moving.',
      'The floor takes them.',
      'Their knees give out.'
    ],
    koLose: [
      'The floor comes up fast.',
      'Your legs stop answering.',
      'Everything narrows to a point.'
    ],
    escape: [
      'You break contact and walk, then jog, then run.',
      'You take the first alley and do not look back.',
      'You slip the fight and disappear into the crowd.'
    ]
  };
})(window.CALIGO);
