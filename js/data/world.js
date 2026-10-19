/* CALIGO — gyms, shops, happiness sources and platform flavour. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* ---- PLATFORMS ----------------------------------------------------- */
  D.platforms = {
    docks:     { name: 'The Docks',     blurb: 'Smuggling hub and neutral ground. Where goods enter the city and reputations leave it.' },
    exchange:  { name: 'The Exchange',  blurb: 'Banks, brokers and people who charge you for counting.' },
    undercity: { name: 'The Undercity', blurb: 'Drug dens, fight pits and chop shops. The floor everyone else stands on.' },
    spire:     { name: 'The Spire',     blurb: 'Corporate towers and council chambers. The air up here is filtered.' },
    hollows:   { name: 'The Hollows',   blurb: 'Abandoned rigs outside the law. Nobody asks who you are.' }
  };

  /* ---- GYMS ----------------------------------------------------------
     mult      multiplies every stat gain from a session
     fee       cost to buy a 24 hour membership
     energy    energy spent per session
     happyRegen  happiness gained per hour of game time while a member    */
  D.gyms = [
    { id: 'basic',       name: 'Basic Gym',        mult: 1.0, fee: 0,     energy: 10,
      desc: 'Free weights, broken fans, no membership desk.' },
    { id: 'fitness',     name: 'Fitness Center',   mult: 1.5, fee: 500,   energy: 10, happyRegen: 2,
      desc: 'Clean machines and a small happiness bump while you are a member.' },
    { id: 'vr',          name: 'VR Gym',           mult: 2.0, fee: 1000,  energy: 5,
      desc: 'Half the energy cost, twice the gains of the basic floor.' },
    { id: 'combat',      name: 'Combat Gym',       mult: 2.5, fee: 2000,  energy: 10,
      desc: 'Padded floors, heavy bags, and people who spar too hard.' },
    { id: 'underground', name: 'Underground Gym',  mult: 3.5, fee: 5000,  energy: 10, injuryRisk: 0.10,
      desc: 'Real gains, real injuries. Ten percent chance of hurting yourself.' },
    { id: 'elite',       name: 'Elite Gym',        mult: 4.0, fee: 10000, energy: 10, happyRegen: 4,
      desc: 'Spire-grade equipment and staff who remember your name.' }
  ];

  D.gymById = {};
  D.gyms.forEach(function (g) { D.gymById[g.id] = g; });

  /* ---- TRAINERS ------------------------------------------------------ */
  D.trainers = [
    { id: 'none',  name: 'No trainer',      cost: 0,     bonus: 0 },
    { id: 'basic', name: 'Basic Trainer',   cost: 500,   bonus: 0.05 },
    { id: 'ai',    name: 'AI Coach',        cost: 2000,  bonus: 0.15 },
    { id: 'excon', name: 'Ex-Con Coach',    cost: 10000, bonus: 0.20 },
    { id: 'pro',   name: 'Pro Trainer',     cost: 5000,  bonus: 0.15 },
    { id: 'elite', name: 'Elite Trainer',   cost: 25000, bonus: 0.30 }
  ];

  D.trainerById = {};
  D.trainers.forEach(function (t) { D.trainerById[t.id] = t; });

  /* ---- TRAINABLE STATS AND EXERCISE FLAVOUR --------------------------- */
  D.trainableStats = [
    { id: 'strength',  label: 'Strength',  exercises: ['bench press', 'squats', 'deadlifts', 'pull-ups'] },
    { id: 'defense',   label: 'Defense',   exercises: ['planks', 'sit-ups', 'yoga', 'medicine ball work'] },
    { id: 'speed',     label: 'Speed',     exercises: ['sprints', 'jump rope', 'box jumps', 'ladder drills'] },
    { id: 'dexterity', label: 'Dexterity', exercises: ['speed bag', 'shadow boxing', 'sparring', 'juggling'] },
    { id: 'all',       label: 'All-Round', exercises: ['circuit training', 'swimming', 'rowing', 'the obstacle course'] }
  ];

  /* ---- HAPPINESS SOURCES (bought from the gym page) ------------------- */
  D.happinessSources = [
    { id: 'beer',       name: 'Beer',        cost: 10,    happiness: 10,  text: 'A cold one at the Rusty Anchor.' },
    { id: 'movie',      name: 'Movie',       cost: 20,    happiness: 20,  text: 'Two hours in a dark room with strangers.' },
    { id: 'wine',       name: 'Wine',        cost: 50,    happiness: 25,  text: 'A glass of something imported.' },
    { id: 'concert',    name: 'Concert',     cost: 100,   happiness: 50,  text: 'Loud, crowded, briefly perfect.' },
    { id: 'whiskey',    name: 'Whiskey',     cost: 100,   happiness: 40,  text: 'Single malt, no ice, no conversation.' },
    { id: 'party',      name: 'Party',       cost: 1000,  happiness: 100, text: 'You rent a floor and fill it.' },
    { id: 'champagne',  name: 'Champagne',   cost: 1000,  happiness: 100, text: 'A bottle that costs more than a week of rent.' },
    { id: 'vacation',   name: 'Vacation',    cost: 10000, happiness: 500, text: 'A week somewhere the sea is a different colour.' }
  ];

  /* ---- NPC SHOPS ------------------------------------------------------
     Phase 1 stocks the Docks. More shops arrive with their platforms.    */
  D.shops = [
    {
      id: 'harbor_supply',
      name: 'Harbor Supply Co.',
      platform: 'docks',
      blurb: 'Everything a dockhand needs at two in the morning. No questions, no receipts.',
      stock: ['bandage', 'first_aid', 'med_kit', 'trauma_kit',
              'coffee', 'energy_drink', 'happy_candy',
              'gloves', 'ski_mask', 'burner_phone', 'lockpick_set',
              'ammo_standard']
    },
    {
      id: 'docks_arms',
      name: 'Docks Arms & Blades',
      platform: 'docks',
      blurb: 'A counter, a ledger, and a rack that has been restocked more than it should have been.',
      stock: ['brass_knuckles', 'knife', 'bat', 'crowbar', 'machete', 'nunchucks', 'whip',
              'taser', 'stun_gun',
              'pistol_glock', 'pistol_beretta',
              'leather_jacket', 'kevlar_vest', 'ballistic_vest',
              'ammo_standard', 'ammo_hollow', 'ammo_tracer']
    },
    {
      id: 'rusty_anchor',
      name: 'The Rusty Anchor',
      platform: 'docks',
      blurb: 'A bar with a floor that has seen things. Drinks fix morale and nothing else.',
      stock: [],
      happiness: ['beer', 'wine', 'whiskey', 'champagne', 'movie', 'concert', 'party', 'vacation']
    },
    {
      id: 'back_counter',
      name: 'The Back Counter',
      platform: 'docks',
      blurb: 'Behind the bar, past the curtain. Cash only, and the prices move with the tide.',
      stock: ['weed', 'stim_pills', 'anxiolytic', 'painkiller', 'antidote', 'nerve_booster', 'flowers']
    }
  ];

  D.shopById = {};
  D.shops.forEach(function (s) { D.shopById[s.id] = s; });

  /* ---- ACTIVITY LOG COLOURS ------------------------------------------ */
  D.logKinds = ['info', 'good', 'bad', 'money'];

  /* ---- OFFLINE / MISC FLAVOUR ---------------------------------------- */
  D.awayLines = [
    'The city kept moving without you.',
    'The tide came in and went out again.',
    'Somewhere below, a deal closed without you in the room.'
  ];
})(window.CALIGO);
