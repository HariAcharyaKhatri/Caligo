/* CALIGO — NPC shops. */
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

  C.screens.shops = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Shops', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      var cashEl = h('span', { class: 'pill gold', text: U.money(sv.player.cash) });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Local suppliers and street merchants' }),
        cashEl
      ));

      function live(s) { C.dom.setText(cashEl, U.money(s.player.cash)); }
      live(sv);
      C.engine.live(live);

      /* ---- SHOP SELECTION TABS & STOREFRONT ---- */
      var activeShopId = 'all';
      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var shopsContainer = h('div', { class: 'shops-container' });

      var shopTabs = [{ id: 'all', label: 'All Merchants' }];
      D.shops.forEach(function (s) {
        shopTabs.push({ id: s.id, label: s.name });
      });

      function renderShops() {
        C.dom.clear(shopsContainer);

        D.shops.forEach(function (shop) {
          if (activeShopId !== 'all' && activeShopId !== shop.id) return;

          var body = h('div', { class: 'shop-catalog' });

          if (shop.happiness) {
            shop.happiness.forEach(function (id) {
              var src = null;
              D.happinessSources.forEach(function (s) { if (s.id === id) src = s; });
              if (!src) return;
              body.appendChild(row(src.name + ' (+' + src.happiness + ' happiness)', src.cost, 'Buy',
                function () {
                  var r = A.buyHappiness(src.id);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast(src.text, 'good');
                  C.router.go('shops');
                }));
            });
          }

          shop.stock.forEach(function (id) {
            var it = D.items[id];
            if (!it) return;
            body.appendChild(row(
              it.name + ' — ' + (it.desc || ''),
              it.price,
              'Buy',
              function () {
                var r = A.buyItem(shop.id, id, 1);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Bought ' + it.name + ' for ' + U.money(r.cost), 'money');
                C.router.go('shops');
              },
              it
            ));
          });

          if (!body.firstChild) {
            body.appendChild(h('p', { class: 'muted small', text: 'The shelves are bare right now.' }));
          }

          if (activeShopId === 'all') {
            shopsContainer.appendChild(UI.details(
              h('span', null,
                h('span', { text: shop.name + ' ' }),
                UI.pill(D.platforms[shop.platform].name, 'grey')
              ),
              [h('p', { class: 'small muted', text: shop.blurb }), body],
              true
            ));
          } else {
            var storeCard = UI.card(shop.name, D.platforms[shop.platform].name + ' Platform', [
              h('p', { class: 'small muted', style: { marginBottom: '12px' }, text: shop.blurb }),
              body
            ]);
            shopsContainer.appendChild(storeCard);
          }
        });
      }

      tabsContainer.appendChild(UI.tabBar(shopTabs, activeShopId, function (sId) {
        activeShopId = sId;
        renderShops();
      }));

      renderShops();
      root.appendChild(tabsContainer);
      root.appendChild(shopsContainer);

      return root;
    }
  };

  function row(label, price, buttonText, onClick, item) {
    var inner = h('div', null,
      h('div', null,
        h('span', { class: item ? 'rarity-' + item.rarity : '', text: label }),
        item && item.stack === false && item.dmg ? h('span', { class: 'small muted', text: '  DMG ' + item.dmg }) : null,
        item && item.def ? h('span', { class: 'small muted', text: '  DEF ' + item.def }) : null
      )
    );
    return h('div', { class: 'row between', style: { marginBottom: '6px' } },
      h('div', { style: { flex: '1 1 60%' } }, inner),
      h('button', { class: 'small', text: buttonText + ' ' + U.money(price), onclick: onClick })
    );
  }
})(window.CALIGO);
