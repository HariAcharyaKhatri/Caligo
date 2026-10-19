/* CALIGO — territories. Capture via faction wars. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.territories = [
    { id: 'docks_harbor',    name: 'Docks Harbor',     platform: 'docks',     income: 5000,  defense: 100 },
    { id: 'exchange_bank',   name: 'Exchange Plaza',   platform: 'exchange',  income: 12000, defense: 180 },
    { id: 'undercity_market',name: 'Undercity Market', platform: 'undercity', income: 9000,  defense: 150 },
    { id: 'spire_lobby',     name: 'Spire Lobby',      platform: 'spire',     income: 25000, defense: 280 },
    { id: 'hollows_rigs',    name: 'Hollows Rigs',     platform: 'hollows',   income: 15000, defense: 200 },
    { id: 'central_market',  name: 'Central Market',   platform: 'docks',     income: 20000, defense: 240 },
    { id: 'airport',         name: 'Airport',          platform: 'spire',     income: 35000, defense: 320 },
    { id: 'prison_road',     name: 'Prison Road',      platform: 'undercity', income: 80000, defense: 500 }
  ];
})(window.CALIGO);
