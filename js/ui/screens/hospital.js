window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;
  C.screens = C.screens || {};
  C.screens.hospital = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Hospital', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var body = h('div');
      root.appendChild(UI.card('Your condition', null, body));

      function live(s) {
        C.dom.clear(body);
        var left = S.hospitalLeft(s);
        var p = s.player;

        body.appendChild(h('p', { class: 'small muted',
          text: 'Life ' + Math.floor(p.life) + ' / ' + S.maxLife(p) }));

        if (left <= 0) {
          body.appendChild(h('p', { class: 'good', text: 'You are discharged. Walk it off.' }));
        } else {
          body.appendChild(h('p', { class: 'bad', text: 'Another ' + U.dur(left) + ' in a bed.' }));
        }

        var tiers = [
          { id: 'basic', label: 'Basic treatment', cut: '50% of your stay' },
          { id: 'advanced', label: 'Advanced treatment', cut: '80% of your stay' },
          { id: 'experimental', label: 'Experimental treatment', cut: 'all of your stay' }
        ];
        tiers.forEach(function (t) {
          var cost = A.hospitalCost(t.id);
          body.appendChild(h('div', { class: 'row between', style: { marginBottom: '6px' } },
            h('span', null,
              h('span', { text: t.label + ' ' }),
              h('span', { class: 'small muted', text: '(−' + t.cut + ')' })
            ),
            h('button', {
              class: 'small', text: U.money(cost), disabled: p.cash < cost || left <= 0,
              onclick: function () {
                var r = A.hospitalTreat(t.id);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Discharged ' + U.dur(r.removed) + ' early.', 'good');
                C.router.go('hospital');
              }
            })
          ));
        });

        /* Medical items work in the bed too. */
        var meds = s.inventory.filter(function (st) {
          var it = D.items[st.id];
          return it && it.cat === 'medical' && it.heal != null;
        });
        if (meds.length) {
          body.appendChild(h('hr', { class: 'sep' }));
          body.appendChild(h('div', { class: 'small muted', text: 'Use what you are carrying:' }));
          meds.forEach(function (st) {
            var it = D.items[st.id];
            body.appendChild(h('div', { class: 'row between', style: { marginBottom: '6px' } },
              h('span', { text: it.name + ' ×' + st.qty }),
              h('button', {
                class: 'small', text: 'Use',
                onclick: function () {
                  var r = A.useItem(it.id);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast(r.text, 'good');
                  C.router.go('hospital');
                }
              })
            ));
          });
        }
      }
      live(sv);
      C.engine.live(live);

      return root;
    }
  };
})(window.CALIGO);
