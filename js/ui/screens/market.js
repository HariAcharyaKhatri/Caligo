/* CALIGO — the item market. Bots list items at drifting prices. */
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

  C.screens.market = {
    render: function () {
      var sv = C.state.save;

      /* Refresh bot listings if enough game time has passed. */
      A.refreshMarket(false);

      var root = h('div');

      root.appendChild(UI.pageHead('Item Market', [
        { label: 'Shops', onClick: function () { C.router.go('shops'); } }
      ]));

      var cashEl = h('span', { class: 'pill gold' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Public exchange of goods between citizens' }),
        cashEl
      ));
      function live(s) { C.dom.setText(cashEl, U.money(s.player.cash)); }
      live(sv);
      C.engine.live(live);

      /* ---- FILTERS ---- */
      var filterInput = h('input', { type: 'text', placeholder: 'Filter by name…', value: '' });

      /* ---- LISTINGS ---- */
      var listBody = h('div');
      root.appendChild(UI.card('Bot listings',
        'Prices move every hour of game time. Buy low, list high.',
        [h('label', { text: 'Search' }), filterInput, h('div', { style: { height: '10px' } }), listBody]));

      function renderList() {
        C.dom.clear(listBody);
        var q = filterInput.value.trim().toLowerCase();
        var rows = [];

        sv.market.listings.forEach(function (l) {
          var it = D.items[l.itemId];
          if (!it) return;
          if (q && it.name.toLowerCase().indexOf(q) === -1) return;
          var ratio = l.price / Math.max(1, it.price);
          var cls = ratio < 0.85 ? 'good' : (ratio > 1.15 ? 'bad' : 'muted');
          rows.push({
            cells: [
              h('span', { class: 'rarity-' + it.rarity, text: it.name + ' ×' + l.qty }),
              h('span', { class: 'small dim', text: l.sellerName }),
              h('span', { class: cls, text: U.money(l.price) }),
              h('button', {
                class: 'small primary', text: 'Buy 1',
                disabled: sv.player.cash < l.price,
                onclick: function () {
                  var r = A.buyListing(l.id, 1);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast('Bought for ' + U.money(r.cost), 'money');
                  C.router.go('market');
                }
              })
            ]
          });
        });

        if (!rows.length) {
          listBody.appendChild(h('p', { class: 'muted small', text: 'Nothing matches.' }));
          return;
        }
        listBody.appendChild(UI.table(
          [{ label: 'Item' }, { label: 'Seller' }, { label: 'Price', num: true }, { label: '' }],
          rows
        ));
      }
      renderList();
      filterInput.addEventListener('input', renderList);

      /* ---- PLAYER LISTINGS ---- */
      var listForm = h('div', { class: 'stack' });

      var itemSel = h('select', null,
        A.inventoryList()
          .filter(function (e) { return e.item.price > 0 || e.item.cat === 'trade'; })
          .map(function (e) {
            return h('option', { value: e.id, text: e.item.name + ' ×' + e.qty });
          })
      );

      var qtyInput = h('input', { type: 'number', min: '1', value: '1' });
      var priceInput = h('input', { type: 'number', min: '1', value: '100' });

      listForm.appendChild(h('div', { class: 'row' },
        h('div', { style: { flex: '1 1 200px' } }, h('label', { text: 'Item' }), itemSel),
        h('div', { style: { flex: '1 1 80px' } }, h('label', { text: 'Qty' }), qtyInput),
        h('div', { style: { flex: '1 1 120px' } }, h('label', { text: 'Price each' }), priceInput)
      ));

      listForm.appendChild(h('button', {
        class: 'primary small', text: 'List on the market',
        onclick: function () {
          var id = itemSel.value;
          var qty = Number(qtyInput.value);
          var price = Number(priceInput.value);
          if (!id) { UI.toast('Pick an item first.', 'bad'); return; }
          var r = A.listOnMarket(id, qty, price);
          if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
          UI.toast('Listed.', 'good');
          C.router.go('market');
        }
      }));

      if (sv.market.playerListings.length) {
        listForm.appendChild(h('hr', { class: 'sep' }));
        listForm.appendChild(h('div', { class: 'small muted', text: 'Your active listings' }));
        sv.market.playerListings.forEach(function (l) {
          var it = D.items[l.itemId];
          var avg = S.marketAverage(sv, l.itemId) || it.price;
          var priceTag = l.price <= avg * 0.9 ? 'good' : (l.price >= avg * 1.15 ? 'bad' : 'muted');
          listForm.appendChild(h('div', { class: 'row between', style: { marginBottom: '6px' } },
            h('div', null,
              h('div', { text: it.name + ' ×' + l.qty }),
              h('div', { class: 'small ' + priceTag,
                text: U.money(l.price) + ' each (market avg ' + U.money(Math.round(avg)) + ')' })
            ),
            h('button', { class: 'small ghost', text: 'Cancel',
              onclick: function () {
                var r = A.cancelListing(l.id);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                C.router.go('market');
              }
            })
          ));
        });
      }

      root.appendChild(UI.card('Sell your own',
        'Listings sell over time. Under-cutting the market average sells fastest.',
        listForm));

      return root;
    }
  };
})(window.CALIGO);
