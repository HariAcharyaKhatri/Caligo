/* CALIGO — inventory, equipment and quick sales. */
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

  C.screens.inventory = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Items', [
        { label: 'Armoury', onClick: function () { C.router.go('armoury'); } },
        { label: 'Market', onClick: function () { C.router.go('market'); } }
      ]));

      var cashEl = h('span', { class: 'pill gold', text: U.money(sv.player.cash) + ' on hand' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Carried personal belongings' }),
        cashEl
      ));

      /* ---- EQUIPPED ---- */
      var eq = h('div', { class: 'grid two' });
      ['weapon', 'armour'].forEach(function (slot) {
        var id = sv.player.equipped[slot];
        var it = id ? D.items[id] : null;
        var box = h('div', { class: 'card tight' },
          h('div', { class: 'small muted', text: slot === 'weapon' ? 'WEAPON' : 'ARMOUR' }),
          h('div', { class: 'card-title', text: it ? it.name : 'nothing' }),
          it && it.dmg ? h('div', { class: 'small muted', text: 'Damage ' + it.dmg }) : null,
          it && it.def ? h('div', { class: 'small muted', text: 'Defence ' + it.def }) : null,
          it ? h('button', {
            class: 'small ghost', text: 'Unequip',
            onclick: function () { A.unequip(slot); C.router.go('inventory'); }
          }) : null
        );
        eq.appendChild(box);
      });
      root.appendChild(eq);

      /* ---- CATEGORY TABS & PAGINATION ---- */
      var list = A.inventoryList();
      if (!list.length) {
        root.appendChild(UI.emptyState('🎒', 'Empty Inventory', 'You are currently carrying no items in your personal luggage.'));
        return root;
      }

      var activeCat = 'all';
      var currentPage = 1;
      var pageSize = 8;
      var searchQuery = '';

      var searchBox = h('input', {
        type: 'text',
        placeholder: 'Search carried items by name…',
        style: { width: '100%', marginBottom: '10px' }
      });
      root.appendChild(searchBox);

      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var itemsContainer = h('div', { class: 'inventory-items-wrap' });
      var pagContainer = h('div');

      function getCategoryTabs() {
        var tabs = [{ id: 'all', label: 'All Items', count: list.reduce(function (a, e) { return a + e.qty; }, 0) }];
        D.itemCategories.forEach(function (cat) {
          var count = list.filter(function (e) { return e.item.cat === cat.id; })
                          .reduce(function (a, e) { return a + e.qty; }, 0);
          if (count > 0) {
            tabs.push({ id: cat.id, label: cat.label, count: count });
          }
        });
        return tabs;
      }

      function renderItemsList() {
        C.dom.clear(itemsContainer);
        C.dom.clear(pagContainer);

        var filtered = list.filter(function (e) {
          if (activeCat !== 'all' && e.item.cat !== activeCat) return false;
          if (searchQuery && e.item.name.toLowerCase().indexOf(searchQuery) === -1) return false;
          return true;
        });

        if (!filtered.length) {
          itemsContainer.appendChild(UI.emptyState('🔍', 'No matching items', 'No carried items match the active category or search filter.'));
          return;
        }

        var totalPages = Math.ceil(filtered.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * pageSize;
        var pagedItems = filtered.slice(startIdx, startIdx + pageSize);

        var listGrid = h('div', { class: 'grid two', style: { gap: '8px' } });
        pagedItems.forEach(function (e) {
          listGrid.appendChild(itemRow(e));
        });
        itemsContainer.appendChild(listGrid);

        var pag = UI.pagination(currentPage, totalPages, function (p) {
          currentPage = p;
          renderItemsList();
        });
        if (pag) pagContainer.appendChild(pag);
      }

      tabsContainer.appendChild(UI.tabBar(getCategoryTabs(), activeCat, function (catId) {
        activeCat = catId;
        currentPage = 1;
        renderItemsList();
      }));

      searchBox.addEventListener('input', function () {
        searchQuery = searchBox.value.trim().toLowerCase();
        currentPage = 1;
        renderItemsList();
      });

      root.appendChild(tabsContainer);
      root.appendChild(itemsContainer);
      root.appendChild(pagContainer);

      renderItemsList();
      return root;
    }
  };

  function itemRow(entry) {
    var it = entry.item;
    var sv = C.state.save;

    var meta = [];
    if (it.dmg) meta.push('DMG ' + it.dmg);
    if (it.def) meta.push('DEF ' + it.def);
    if (it.heal) meta.push('heals ' + it.heal);
    if (it.energy) meta.push('+' + it.energy + ' energy');
    if (it.nerve) meta.push('+' + it.nerve + ' nerve');
    if (it.happiness) meta.push('+' + it.happiness + ' happiness');
    if (it.bonus) meta.push('+' + it.bonus + ' on ' + it.bonusTags.join('/'));

    var buttons = h('div', { class: 'row' });

    var usable = ['medical', 'booster', 'drug'].indexOf(it.cat) !== -1 && !it.bonusTags;
    if (usable) {
      buttons.appendChild(h('button', {
        class: 'small primary', text: 'Use',
        onclick: function () {
          var r = A.useItem(it.id);
          if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
          UI.toast(r.text, r.overdose ? 'bad' : 'good');
          C.router.go('inventory');
        }
      }));
    }

    if (it.cat === 'weapon' || it.cat === 'armour') {
      var equipped = entry.equipped;
      buttons.appendChild(h('button', {
        class: 'small' + (equipped ? ' ghost' : ''),
        text: equipped ? 'Equipped' : 'Equip',
        disabled: equipped,
        onclick: function () {
          var r = A.equipItem(it.id);
          if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
          UI.toast('Equipped ' + it.name, 'good');
          C.router.go('inventory');
        }
      }));
    }

    if (it.sell > 0) {
      buttons.appendChild(h('button', {
        class: 'small', text: 'Sell ' + U.money(it.sell),
        onclick: function () {
          UI.confirm('Sell 1× ' + it.name + ' for ' + U.money(it.sell) + '?', function () {
            var r = A.sellItem(it.id, 1);
            if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
            UI.toast('Sold ' + it.name + ' for ' + U.money(r.value), 'money');
            C.router.go('inventory');
          });
        }
      }));
    }

    return h('div', { class: 'card tight' },
      h('div', { class: 'row between' },
        h('div', null,
          h('div', null,
            h('span', { class: 'rarity-' + it.rarity, text: it.name }),
            entry.qty > 1 ? h('span', { class: 'small muted', text: ' ×' + entry.qty }) : null
          ),
          h('div', { class: 'small muted', text: it.desc || '' }),
          meta.length ? h('div', { class: 'small dim', text: meta.join(' · ') }) : null
        )
      ),
      buttons
    );
  }
})(window.CALIGO);
