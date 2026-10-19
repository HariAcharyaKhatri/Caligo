window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util, D = C.data;
  C.screens = C.screens || {};
  C.screens.newspaper = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Newspaper', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      /* Deterministic headlines derived from the save. */
      function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }
      var seed = Math.floor(sv.meta.gameTime / 86400);
      var stories = [
        { title: pick(D.headlines.crime, seed).replace('{place}', pick(D.placeNames, seed * 3)), cat: 'Crime' },
        { title: pick(D.headlines.market, seed + 1), cat: 'Markets' },
        { title: pick(D.headlines.world, seed + 2), cat: 'City' },
        { title: pick(D.headlines.bot, seed + 3).replace('{name}', sv.bots[0] ? sv.bots[0].name : 'Anonymous'), cat: 'People' }
      ];

      stories.forEach(function (s) {
        root.appendChild(UI.section(s.title, [
          h('p', { class: 'small muted', text: 'Category: ' + s.cat + ' · Edition ' + (seed + 1) }),
          h('p', { class: 'small', text: 'Full report continues on an inside page that was, unfortunately, misprinted.' })
        ]));
      });

      return root;
    }
  };
})(window.CALIGO);
