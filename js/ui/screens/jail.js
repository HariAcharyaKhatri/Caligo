window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util;
  C.screens = C.screens || {};
  C.screens.jail = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Jail', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var body = h('div');
      root.appendChild(UI.card('Your sentence', null, body));

      function live(s) {
        C.dom.clear(body);
        var left = S.jailLeft(s);
        if (left <= 0) {
          body.appendChild(h('p', { class: 'good', text: 'You are a free person. For now.' }));
          body.appendChild(h('button', { class: 'small', text: 'Back to the city', onclick: function () { C.router.go('home'); } }));
          return;
        }

        body.appendChild(h('p', { class: 'bad', text: 'Another ' + U.dur(left) + ' in a cell.' }));
        body.appendChild(h('p', { class: 'small muted',
          text: 'Time passes in real time. Bail clears the rest of your sentence immediately.' }));

        var cost = A.bailCost();
        var canPay = s.player.cash >= cost;
        body.appendChild(h('button', {
          class: 'primary', text: 'Post bail — ' + U.money(cost),
          disabled: !canPay,
          onclick: function () {
            UI.confirm('Post bail of ' + U.money(cost) + '?', function () {
              var r = A.payBail();
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              UI.toast('You walk out the side door.', 'good');
              C.router.go('home');
            });
          }
        }));
        if (!canPay) {
          body.appendChild(h('div', { class: 'small dim', text: 'You do not have enough cash on hand.' }));
        }
      }
      live(sv);
      C.engine.live(live);

      /* Wanted clearance is available from anywhere, including a cell. */
      var fineBody = h('div');
      root.appendChild(UI.card('Wanted level', 'A fine clears your record.', fineBody));
      function liveFine(s) {
        C.dom.clear(fineBody);
        if (s.player.wanted <= 0) {
          fineBody.appendChild(h('p', { class: 'muted small', text: 'Nobody is looking for you.' }));
          return;
        }
        var cost = A.fineCost();
        fineBody.appendChild(h('p', { class: 'small muted',
          text: 'Wanted ' + Math.floor(s.player.wanted) + ' · fine ' + U.money(cost) }));
        fineBody.appendChild(h('button', {
          class: 'small', text: 'Pay fine', disabled: s.player.cash < cost,
          onclick: function () {
            var r = A.payFine();
            if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
            UI.toast('Record cleared.', 'good');
            C.router.go('jail');
          }
        }));
      }
      liveFine(sv);
      C.engine.live(liveFine);

      return root;
    }
  };
})(window.CALIGO);
