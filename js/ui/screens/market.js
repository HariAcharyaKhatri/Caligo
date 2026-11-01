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

      /* ---- MARKET TABS & VIEWS ---- */
      var activeTab = 'browse';
      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var contentContainer = h('div', { class: 'market-content-wrap' });

      var marketTabs = [
        { id: 'browse', label: 'Browse Exchange', count: sv.market.listings.length },
        { id: 'create', label: 'Create Listing' },
        { id: 'my_listings', label: 'My Listings', count: sv.market.playerListings.length }
      ];

      /* ---- 1. BROWSE LISTINGS WITH PAGINATION ---- */
      var filterInput = h('input', { type: 'text', placeholder: 'Filter listings by item name…', value: '' });
      var browseBody = h('div');
      var browseCard = UI.card('Market Exchange Listings',
        'Prices drift periodically based on local demand. Buy low, list high.',
        [h('label', { text: 'Search' }), filterInput, h('div', { style: { height: '10px' } }), browseBody]);

      var currentPage = 1;
      var pageSize = 10;

      function renderList() {
        C.dom.clear(browseBody);
        var q = filterInput.value.trim().toLowerCase();
        var matching = sv.market.listings.filter(function (l) {
          var it = D.items[l.itemId];
          if (!it) return false;
          if (q && it.name.toLowerCase().indexOf(q) === -1) return false;
          return true;
        });

        if (!matching.length) {
          browseBody.appendChild(UI.emptyState('📦', 'No Listings Found', 'No market listings currently match your search criteria.'));
          return;
        }

        var totalPages = Math.ceil(matching.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * pageSize;
        var paged = matching.slice(startIdx, startIdx + pageSize);

        var rows = paged.map(function (l) {
          var it = D.items[l.itemId];
          var ratio = l.price / Math.max(1, it.price);
          var cls = ratio < 0.85 ? 'good' : (ratio > 1.15 ? 'bad' : 'muted');
          return {
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
          };
        });

        browseBody.appendChild(UI.table(
          [{ label: 'Item' }, { label: 'Seller' }, { label: 'Price', num: true }, { label: '' }],
          rows
        ));

        var pag = UI.pagination(currentPage, totalPages, function (p) {
          currentPage = p;
          renderList();
        });
        if (pag) browseBody.appendChild(pag);
      }
      renderList();
      filterInput.addEventListener('input', function () {
        currentPage = 1;
        renderList();
      });

      /* ---- 2. PLAYER CREATE LISTING ---- */
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
      var createCard = UI.card('Sell Your Own Items',
        'Listings sell over time to citizens and bots. Under-cutting the market average sells fastest.',
        listForm);

      /* ---- 3. MY ACTIVE LISTINGS ---- */
      var myListingsBody = h('div');
      if (sv.market.playerListings.length) {
        sv.market.playerListings.forEach(function (l) {
          var it = D.items[l.itemId];
          var avg = S.marketAverage(sv, l.itemId) || it.price;
          var priceTag = l.price <= avg * 0.9 ? 'good' : (l.price >= avg * 1.15 ? 'bad' : 'muted');
          myListingsBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px', padding: '8px', background: 'var(--panel2)', borderRadius: '4px' } },
            h('div', null,
              h('div', { style: { fontWeight: '700' }, text: it.name + ' ×' + l.qty }),
              h('div', { class: 'small ' + priceTag,
                text: U.money(l.price) + ' each (market average: ' + U.money(Math.round(avg)) + ')' })
            ),
            h('button', { class: 'small ghost danger', text: 'Cancel Listing',
              onclick: function () {
                var r = A.cancelListing(l.id);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Listing cancelled.', 'good');
                C.router.go('market');
              }
            })
          ));
        });
      } else {
        myListingsBody.appendChild(UI.emptyState('🏷', 'No Active Listings', 'You have no items currently listed for sale on the market exchange.'));
      }
      var myListingsCard = UI.card('Your Active Market Listings', null, myListingsBody);

      function renderMarketView() {
        C.dom.clear(contentContainer);
        if (activeTab === 'browse') {
          contentContainer.appendChild(browseCard);
        } else if (activeTab === 'create') {
          contentContainer.appendChild(createCard);
        } else if (activeTab === 'my_listings') {
          contentContainer.appendChild(myListingsCard);
        }
      }

      tabsContainer.appendChild(UI.tabBar(marketTabs, activeTab, function (tId) {
        activeTab = tId;
        renderMarketView();
      }));

      renderMarketView();
      root.appendChild(tabsContainer);
      root.appendChild(contentContainer);

      return root;
    }
  };
})(window.CALIGO);
