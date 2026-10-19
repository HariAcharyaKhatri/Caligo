window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.territory = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Territories', [{ label: 'Faction', onClick: function () { C.router.go('faction'); } }]));

      root.appendChild(UI.section('All territories', [
        h('p', { class: 'small muted', text: 'Territories pay daily income to the faction that owns them. Capture during an active war.' }),
        UI.table(
          [{ label: 'Territory' }, { label: 'Platform' }, { label: 'Defense', num: true }, { label: 'Income', num: true }, { label: 'Owner' }, { label: '' }],
          D.territories.map(function (t) {
            var ownerId = sv.territories[t.id];
            var owner = ownerId ? (D.factions.filter(function (f) { return f.id === ownerId; })[0] || { name: ownerId }).name : 'Unclaimed';
            var mine = ownerId === sv.faction.id;
            return {
              cells: [
                t.name,
                D.platforms[t.platform] ? D.platforms[t.platform].name : t.platform,
                t.defense,
                U.money(t.income),
                h('span', { class: mine ? 'good' : '' }, owner),
                h('button', { class: 'small', text: mine ? 'Owned' : 'Capture',
                  disabled: mine || !sv.faction.war,
                  onclick: function () {
                    var r = A.captureTerritory(t.id);
                    if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                    UI.toast(r.success ? 'Captured ' + t.name : 'Failed.', r.success ? 'good' : 'bad');
                    C.router.go('territory');
                  }
                })
              ]
            };
          })
        )
      ]));
      return root;
    }
  };
})(window.CALIGO);
