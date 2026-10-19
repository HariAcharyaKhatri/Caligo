/* CALIGO — travel: platforms and foreign destinations. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var S = C.state;
  var UI = C.ui;
  var A = C.actions;
  var U = C.util;
  var D = C.data;

  C.screens = C.screens || {};

  C.screens.travel = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Travel', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      var locEl = h('span', { class: 'pill blue' });
      var cashEl = h('span', { class: 'pill gold' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Transit network & international departures' }),
        h('div', { class: 'row' }, locEl, cashEl)
      ));

      function live(s) {
        C.dom.setText(locEl, S.platformName(s));
        C.dom.setText(cashEl, U.money(s.player.cash));
      }
      live(sv);
      C.engine.live(live);

      /* ---- IN TRANSIT ---- */
      if (S.inTransit(sv)) {
        var body = h('div');
        root.appendChild(UI.card('In transit', null, body));
        function liveTransit(s) {
          C.dom.clear(body);
          body.appendChild(h('p', { class: 'bad',
            text: 'Arriving in ' + U.dur(S.transitLeft(s)) + '.' }));
        }
        liveTransit(sv);
        C.engine.live(liveTransit);
        return root;
      }

      /* ---- ABROAD ---- */
      if (sv.player.abroad) {
        var dest = D.destById[sv.player.abroad];
        root.appendChild(UI.card(dest.name, dest.blurb, [
          h('p', { class: 'small muted', text:
            'You are abroad. You can shop here but not commit crimes, train or fight until you fly home.' })
        ]));

        var goodsBody = h('div');
        dest.goods.forEach(function (g) {
          var it = D.items[g.id];
          var margin = it.homeValue - g.cost;
          var marginPct = Math.round(margin / g.cost * 100);
          goodsBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
            h('div', null,
              h('div', { text: it.name }),
              h('div', { class: 'small muted',
                text: 'Cost ' + U.money(g.cost) + ' · sells at home for ' + U.money(it.homeValue) +
                      ' · margin ' + marginPct + '%' })
            ),
            h('button', { class: 'small primary', text: 'Buy',
              disabled: sv.player.cash < g.cost,
              onclick: function () {
                var r = A.buyTradeGood(dest.id, g.id, 1);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Bought for ' + U.money(r.cost), 'money');
                C.router.go('travel');
              }
            })
          ));
        });
        root.appendChild(UI.card('Local goods', 'Bring them home and sell them for a margin.', goodsBody));

        root.appendChild(h('div', { class: 'row' },
          h('button', { class: 'primary', text: 'Fly home to Caligo',
            onclick: function () {
              UI.confirm('Book a flight back to Caligo?', function () {
                var r = A.travelHome();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Boarded.', 'good');
                C.router.go('travel');
              });
            }
          })
        ));

        return root;
      }

      /* ---- PLATFORM HOPS ---- */
      var pfBody = h('div');
      Object.keys(D.platforms).forEach(function (pid) {
        if (pid === sv.player.location) return;
        var cfgP = C.config.TRAVEL.platforms[pid];
        pfBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
          h('div', null,
            h('div', { text: D.platforms[pid].name }),
            h('div', { class: 'small muted', text: D.platforms[pid].blurb }),
            h('div', { class: 'small dim',
              text: U.money(cfgP.cost) + ' · ' + cfgP.minutes + ' minutes of game time' })
          ),
          h('button', { class: 'small',
            text: cfgP.cost === 0 ? 'Go' : U.money(cfgP.cost),
            disabled: sv.player.cash < cfgP.cost,
            onclick: function () {
              UI.confirm('Book passage to ' + D.platforms[pid].name + ' for ' + U.money(cfgP.cost) + '?',
                function () {
                  var r = A.travelPlatform(pid);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast('Booked.', 'good');
                  C.router.go('travel');
                });
            }
          })
        ));
      });
      root.appendChild(UI.card('Platform ferry', 'Short hops between the five platforms.', pfBody));

      /* ---- FOREIGN DESTINATIONS ---- */
      var destBody = h('div');
      var classSel = h('select', null,
        D.flightClasses.map(function (c) {
          return h('option', { value: c.id,
            text: c.label + ' — ×' + c.costMult.toFixed(2) + ' price, ×' + c.timeMult.toFixed(2) + ' time' });
        })
      );
      destBody.appendChild(h('div', { class: 'stack' }));
      destBody.appendChild(h('label', { text: 'Flight class' }));
      destBody.appendChild(classSel);
      destBody.appendChild(h('div', { style: { height: '12px' } }));

      D.destinations.forEach(function (d) {
        var cls = D.flightClasses[0]; /* preview with economy */
        var cost = Math.round(d.ticket * cls.costMult);
        var mins = Math.round(d.minutes * cls.timeMult);
        destBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
          h('div', null,
            h('div', { text: d.name }),
            h('div', { class: 'small muted', text: d.blurb }),
            h('div', { class: 'small dim', text: 'from ' + U.money(cost) + ' · ' + mins + ' minutes' })
          ),
          h('button', { class: 'small',
            text: 'Fly',
            disabled: sv.player.cash < cost,
            onclick: function () {
              var classId = classSel.value;
              UI.confirm('Fly to ' + d.name + '? You will be locked out of crimes, gym and combat until you return.',
                function () {
                  var r = A.travelAbroad(d.id, classId);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast('Ticket booked. ' + U.dur(r.minutes * 60) + ' to landing.', 'good');
                  C.router.go('travel');
                });
            }
          })
        ));
      });

      root.appendChild(UI.card('Foreign flights', 'Exclusive goods sell for a margin back home.', destBody));

      return root;
    }
  };
})(window.CALIGO);
