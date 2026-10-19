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

      /* ---- GROUP BY CATEGORY ---- */
      var list = A.inventoryList();
      if (!list.length) {
        root.appendChild(UI.card('Empty', null, h('p', { class: 'muted', text: 'You are carrying nothing.' })));
        return root;
      }

      D.itemCategories.forEach(function (cat) {
        var entries = list.filter(function (e) { return e.item.cat === cat.id; });
        if (!entries.length) return;

        var body = h('div');
        entries.forEach(function (e) {
          body.appendChild(itemRow(e));
        });

        root.appendChild(UI.details(
          h('span', null,
            h('span', { text: cat.label + ' ' }),
            UI.pill(String(entries.reduce(function (a, e) { return a + e.qty; }, 0)), 'grey')
          ),
          body,
          cat.id === 'medical' || cat.id === 'weapon'
        ));
      });

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
