/* CALIGO — story and daily missions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  /* Story arc — the player progresses by hitting checkpoints. */
  D.storyMissions = [
    { id: 'm_welcome', name: 'Welcome to Caligo', npc: 'The Contact', reward: 500,
      text: 'You step off the ferry and someone hands you a cheap business card. "Pay your first debt," they say. "Then we talk."',
      goal: { type: 'cash', target: 500 } },
    { id: 'm_first', name: 'First Contact', npc: 'Anonymous',
      reward: 2500,
      text: 'Anonymous wants proof you can move quietly. Five pocket jobs, no fuss.',
      goal: { type: 'crimes', target: 5 } },
    { id: 'm_debt', name: 'Pay Your Debt', npc: 'Duke', reward: 5000,
      text: 'Duke is not patient. Settle the tab or find somewhere else to sleep.',
      goal: { type: 'debt', target: 2500 } },
    { id: 'm_faction', name: 'Choose a Side', npc: 'The Broker', reward: 15000,
      text: 'The city rewards those who belong to something. Pick a faction and show your colours.',
      goal: { type: 'faction', target: 1 } },
    { id: 'm_rise', name: 'Rise in the Vertical City', npc: 'The Broker', reward: 100000,
      text: 'Reach level 10 and hold $100,000. Then we talk about the top of the Spire.',
      goal: { type: 'level_cash', target: 10 } }
  ];

  /* Daily missions rotate each real day based on the day-of-year. */
  D.dailyMissions = [
    { id: 'd_crimes5',  text: 'Commit 5 crimes',           goal: { type: 'crimes',   target: 5 },   reward: 1500 },
    { id: 'd_fights3',  text: 'Win 3 fights',              goal: { type: 'wins',     target: 3 },   reward: 2500 },
    { id: 'd_train3',   text: 'Train 3 times',             goal: { type: 'trains',   target: 3 },   reward: 1000 },
    { id: 'd_spend5k',  text: 'Spend $5,000 in shops',     goal: { type: 'spend',    target: 5000 }, reward: 2000 },
    { id: 'd_work1',    text: 'Work one shift at any job', goal: { type: 'works',    target: 1 },   reward: 1200 },
    { id: 'd_course1',  text: 'Complete one education course', goal: { type: 'courses', target: 1 }, reward: 8000 },
    { id: 'd_market1',  text: 'Buy something on the item market', goal: { type: 'marketBuys', target: 1 }, reward: 800 }
  ];
})(window.CALIGO);
