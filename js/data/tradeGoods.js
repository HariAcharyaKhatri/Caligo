/* CALIGO — trade goods available only through foreign travel.
   homeValue is what the item sells for back in Caligo. foreignCost comes
   from the destination's goods list. The margin is the profit.           */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* Format: [id, name, homeValue, origin, description] */
  var DEFS = [
    ['trade_spices',     'Spice Crate',       5200,  'mexico',   'A sealed crate of dried spice. Smells like money.'],
    ['trade_textiles',   'Bolt of Cloth',     3200,  'mexico',   'Heavy cotton weave, still warm from the sun.'],
    ['trade_electronics','Electronics Case',  7800,  'usa',      'Consumer hardware, no paperwork, no warranty.'],
    ['trade_pharma',     'Pharma Case',       11200, 'usa',      'Sealed medical stock. Do not open it near customs.'],
    ['trade_coffee',     'Coffee Sack',       4200,  'brazil',   'Green beans from a farm nobody has heard of.'],
    ['trade_gems',       'Cut Stones',        14500, 'brazil',   'Loose stones in a canvas bag.'],
    ['trade_tea',        'Tea Chest',         2900,  'uk',       'Loose leaf, still smelling of the warehouse.'],
    ['trade_fashion',    'Fashion Crate',     9400,  'uk',       'Sample garments from a house that never discounts.'],
    ['trade_wine',       'Wine Case',         6300,  'france',   'Twelve bottles, no labels, very old vines.'],
    ['trade_tech',       'Tech Pallet',       16200, 'japan',    'Prototype components, factory sealed.'],
    ['trade_gold',       'Gold Bar',          21500, 'uae',      'One bar, one kilogram, one very quiet deal.'],
    ['trade_metals',     'Metal Ingots',      6700,  'safrica',  'Rare-earth ingots from an old mine.']
  ];

  DEFS.forEach(function (d) {
    D.items[d[0]] = {
      id: d[0],
      name: d[1],
      cat: 'trade',
      sub: 'good',
      rarity: 'uncommon',
      price: 0,               // not sold in normal shops
      sell: d[2],             // what a buyer in Caligo pays
      stack: true,
      origin: d[3],
      homeValue: d[2],
      desc: d[4]
    };
  });

  /* Register 'trade' as a category so the inventory groups it. */
  D.itemCategories.push({ id: 'trade', label: 'Trade goods' });
})(window.CALIGO);
