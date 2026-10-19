window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;
  C.screens = C.screens || {};
  C.screens.companies = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Company', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));
      var owned = S.company(sv);
      if (owned) {
        var last = sv.companies.lastCollected || sv.companies.foundedAt;
        var days = Math.min(7, (sv.meta.gameTime - last) / 86400);
        var accrued = Math.max(0, Math.floor((owned.dailyIncome - owned.dailyCost) * days));
        root.appendChild(UI.section('Your company — ' + owned.name, [
          h('p', { text: owned.bonus }),
          UI.table([{ label: 'Metric' }, { label: 'Value', num: true }], [
            { cells: ['Daily income', U.money(owned.dailyIncome)] },
            { cells: ['Daily cost', U.money(owned.dailyCost)] },
            { cells: ['Accrued profit', U.money(accrued)] },
            { cells: ['Days accrued', days.toFixed(1)] }
          ]),
          h('div', { class: 'row', style: { marginTop: '8px' } },
            h('button', { class: 'green', text: 'Collect profit',
              onclick: function () {
                var r = A.collectCompany();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Collected ' + U.money(r.amount), 'money');
                C.router.go('companies');
              }
            }),
            h('button', { class: 'danger', text: 'Sell company (60%)',
              onclick: function () {
                UI.confirm('Sell ' + owned.name + ' for ' + U.money(owned.cost * 0.6) + '?', function () {
                  A.sellCompany(); C.router.go('companies');
                });
              }
            })
          )
        ]));
      } else {
        var rows = D.companies.map(function (c) {
          return {
            cells: [
              h('div', null, h('div', { text: c.name }), h('div', { class: 'small muted', text: c.bonus })),
              U.money(c.cost),
              U.money(c.dailyIncome),
              U.money(c.dailyCost),
              h('button', { class: 'small green', text: 'Found',
                disabled: sv.player.cash < c.cost,
                onclick: function () {
                  UI.confirm('Found ' + c.name + ' for ' + U.money(c.cost) + '?', function () {
                    var r = A.foundCompany(c.id);
                    if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                    UI.toast(c.name + ' founded.', 'money');
                    C.router.go('companies');
                  });
                }
              })
            ]
          };
        });
        root.appendChild(UI.section('Found a company', [
          h('p', { class: 'small muted', text: 'Companies produce passive income. You can own one at a time.' }),
          UI.table([{ label: 'Company' }, { label: 'Cost', num: true }, { label: 'Daily income', num: true }, { label: 'Daily cost', num: true }, { label: '' }], rows)
        ]));
      }
      return root;
    }
  };
})(window.CALIGO);
