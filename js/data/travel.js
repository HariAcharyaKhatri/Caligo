/* CALIGO — foreign destinations and their exclusive trade goods.
   Prices are listed so the player can see the margin before flying.     */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* Each destination:
       id, name, country flavour, flight time in GAME minutes,
       economy/business/first/private ticket multipliers,
       goods: [{ id, cost }]  where cost is the local buy price.         */
  D.destinations = [
    { id: 'mexico',   name: 'Puerto Viejo',   blurb: 'A port town that smells of charcoal and diesel.',
      minutes: 120, ticket: 2000,
      goods: [ { id: 'trade_spices', cost: 2200 }, { id: 'trade_textiles', cost: 1400 } ] },
    { id: 'usa',      name: 'New Ardent',     blurb: 'A grid city with a permanent electrical hum.',
      minutes: 180, ticket: 3000,
      goods: [ { id: 'trade_electronics', cost: 3400 }, { id: 'trade_pharma', cost: 5000 } ] },
    { id: 'brazil',   name: 'Sao Rafael',     blurb: 'Coffee hills and a coastline of sharp deals.',
      minutes: 180, ticket: 3500,
      goods: [ { id: 'trade_coffee', cost: 1800 }, { id: 'trade_gems', cost: 6500 } ] },
    { id: 'uk',       name: 'Northolt',       blurb: 'Grey, damp, and very good at paperwork.',
      minutes: 240, ticket: 5000,
      goods: [ { id: 'trade_tea', cost: 1200 }, { id: 'trade_fashion', cost: 4200 } ] },
    { id: 'france',   name: 'Val Auren',      blurb: 'Vineyards, old money, and quiet knives.',
      minutes: 300, ticket: 6000,
      goods: [ { id: 'trade_wine', cost: 2800 }, { id: 'trade_fashion', cost: 4200 } ] },
    { id: 'japan',    name: 'Kaido',          blurb: 'Neon, precision, and a very polite police force.',
      minutes: 360, ticket: 8000,
      goods: [ { id: 'trade_tech', cost: 7200 }, { id: 'trade_electronics', cost: 3400 } ] },
    { id: 'uae',      name: 'Al Sahra',       blurb: 'Glass towers above sand that never cools.',
      minutes: 300, ticket: 7000,
      goods: [ { id: 'trade_gold', cost: 9500 }, { id: 'trade_spices', cost: 2200 } ] },
    { id: 'safrica',  name: 'Kaapstad',       blurb: 'A harbour under a very large sky.',
      minutes: 600, ticket: 12000,
      goods: [ { id: 'trade_gems', cost: 6500 }, { id: 'trade_metals', cost: 3000 } ] }
  ];

  D.destById = {};
  D.destinations.forEach(function (d) { D.destById[d.id] = d; });

  /* Flight classes multiply the ticket price and cut the flight time. */
  D.flightClasses = [
    { id: 'economy',  label: 'Economy',  costMult: 1.00, timeMult: 1.00 },
    { id: 'business', label: 'Business', costMult: 2.20, timeMult: 0.85 },
    { id: 'first',    label: 'First',    costMult: 5.00, timeMult: 0.70 },
    { id: 'private',  label: 'Private',  costMult: 20.0, timeMult: 0.40 }
  ];
})(window.CALIGO);
