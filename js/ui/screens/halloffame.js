window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.halloffame = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Caligo Hall of Fame & City Leaderboards', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      root.appendChild(h('p', { class: 'small muted', text: 'Real-time city standings across all registered citizens and syndicates. High ranking unlocks prestige titles and faction perks.' }));

      var activeTab = 'level';
      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var tableContainer = h('div');

      var leaderTabs = [
        { id: 'level', label: 'Citizens by Level', icon: '★' },
        { id: 'wealth', label: 'Wealth & Net Worth', icon: '$' },
        { id: 'power', label: 'Battle Power', icon: '⚔' },
        { id: 'crimes', label: 'Notoriety & Crimes', icon: '☠' }
      ];

      function renderBoard() {
        C.dom.clear(tableContainer);

        var playerPower = (sv.player.stats.strength + sv.player.stats.defense + sv.player.stats.speed + sv.player.stats.dexterity);
        var allEntities = (sv.bots || []).map(function (b) {
          var botPower = (b.stats.strength + b.stats.defense + b.stats.speed + b.stats.dexterity);
          return {
            name: b.name,
            level: b.level,
            wealth: b.cash,
            power: Math.round(botPower),
            crimes: Math.floor(b.level * 4.5),
            isPlayer: false
          };
        });

        allEntities.push({
          name: sv.player.name + ' (You)',
          level: sv.player.level,
          wealth: S.netWorth(sv),
          power: Math.round(playerPower),
          crimes: sv.counters.crimes || 0,
          isPlayer: true
        });

        if (activeTab === 'level') {
          allEntities.sort(function (a, b) { return b.level - a.level; });
        } else if (activeTab === 'wealth') {
          allEntities.sort(function (a, b) { return b.wealth - a.wealth; });
        } else if (activeTab === 'power') {
          allEntities.sort(function (a, b) { return b.power - a.power; });
        } else if (activeTab === 'crimes') {
          allEntities.sort(function (a, b) { return b.crimes - a.crimes; });
        }

        var topRows = allEntities.slice(0, 10).map(function (p, i) {
          var rowCls = p.isPlayer ? 'bold gold' : '';
          var valCell = '';
          if (activeTab === 'level') valCell = 'Level ' + p.level;
          else if (activeTab === 'wealth') valCell = U.money(p.wealth);
          else if (activeTab === 'power') valCell = p.power + ' BP';
          else if (activeTab === 'crimes') valCell = p.crimes + ' Offenses';

          return {
            cells: [
              h('span', { class: (i === 0 ? 'gold bold' : (i < 3 ? 'bold' : '')), text: '#' + (i + 1) }),
              h('span', { class: rowCls, text: p.name }),
              h('span', { class: rowCls, text: String(p.level) }),
              h('span', { class: (activeTab === 'wealth' ? 'gold ' : '') + rowCls, text: valCell })
            ]
          };
        });

        tableContainer.appendChild(UI.table([
          { label: 'Rank', num: true },
          { label: 'Citizen Alias' },
          { label: 'Level', num: true },
          { label: activeTab === 'level' ? 'Tier' : (activeTab === 'wealth' ? 'Net Worth' : (activeTab === 'power' ? 'Battle Power' : 'Crimes Committed')), num: true }
        ], topRows));
      }

      tabsContainer.appendChild(UI.tabBar(leaderTabs, activeTab, function (tId) {
        activeTab = tId;
        renderBoard();
      }));

      renderBoard();
      root.appendChild(tabsContainer);
      root.appendChild(UI.section('Top Standings', [tableContainer]));

      /* Personal Standing Summary Tiles */
      var boxes = [
        ['Overall Level', '#' + Math.max(1, 1000 - sv.player.level * 12)],
        ['Crime Record', '#' + Math.max(1, 100000 - (sv.counters.crimes || 0))],
        ['Street Combat', '#' + Math.max(1, 100000 - ((sv.counters.fightsWon || 0) + (sv.counters.fightsLost || 0)))],
        ['Net Worth', '#' + Math.max(1, 100000 - Math.floor(S.netWorth(sv) / 100))],
        ['Battle Power', '#' + Math.max(1, 100000 - Math.floor((sv.player.stats.strength + sv.player.stats.defense + sv.player.stats.speed + sv.player.stats.dexterity) / 4))]
      ];
      var grid = h('div', { class: 'card-grid', style: { marginTop: '16px' } });
      boxes.forEach(function (b) {
        grid.appendChild(h('div', { class: 'tile', style: { cursor: 'default' } },
          h('div', { class: 'tile-name', text: b[0] }),
          h('div', { class: 'tile-sub gold bold', text: b[1] })
        ));
      });
      root.appendChild(UI.section('Your Personal Standings', [grid]));

      return root;
    }
  };
})(window.CALIGO);
