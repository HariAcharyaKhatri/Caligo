window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui;
  C.screens = C.screens || {};
  C.screens.halloffame = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Hall of Fame', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      root.appendChild(h('p', { class: 'small muted', text: 'You are ranked against the rest of the city in 12 different categories. Ranks move as you gain levels, wealth and reputation.' }));

      var board = sv.bots.slice(0, 5).map(function (b) {
        return { name: b.name, level: b.level, wealth: b.cash };
      });
      board.push({ name: sv.player.name + ' (you)', level: sv.player.level, wealth: sv.player.cash });

      root.appendChild(UI.section('People ranked by Level', [
        UI.table([{ label: 'Position', num: true }, { label: 'Player' }, { label: 'Level', num: true }, { label: 'Wealth', num: true }],
          board.map(function (p, i) {
            return { cells: ['#' + (i + 1), p.name, p.level, '$' + p.wealth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')] };
          }))
      ]));

      var boxes = [
        ['Level', '#' + (1000 - sv.player.level * 12)],
        ['Offenses', '#' + (100000 - sv.counters.crimes)],
        ['Attacks', '#' + (100000 - sv.counters.fightsWon - sv.counters.fightsLost)],
        ['Net worth', '#' + Math.max(1, 100000 - Math.floor(S.netWorth(sv) / 100))],
        ['Battle stats', '#' + Math.max(1, 100000 - Math.floor((sv.player.stats.strength + sv.player.stats.defense + sv.player.stats.speed + sv.player.stats.dexterity) / 4))]
      ];
      var grid = h('div', { class: 'card-grid' });
      boxes.forEach(function (b) {
        grid.appendChild(h('div', { class: 'tile', style: { cursor: 'default' } },
          h('div', { class: 'tile-name', text: b[0] }),
          h('div', { class: 'tile-sub', text: b[1] })
        ));
      });
      root.appendChild(UI.section('Your positions', [grid]));

      return root;
    }
  };
})(window.CALIGO);
