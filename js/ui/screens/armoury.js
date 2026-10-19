/* CALIGO — weapons, armour and ammunition in one place. */
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

  /* A dedicated dealer in the Docks. Sells at 10% over shop price. */
  var DEALER = {
    name: 'Harrow & Sons, Arms',
    blurb: 'Three generations of selling the same problem to different people.',
    surcharge: 1.10,
    stock: [
      'brass_knuckles', 'knife', 'bat', 'crowbar', 'machete', 'nunchucks', 'whip',
      'katana', 'sledgehammer', 'chainsaw', 'taser', 'stun_gun',
      'pistol_glock', 'pistol_beretta', 'pistol_compact', 'pistol_heavy',
      'revolver', 'revolver_large', 'pistol_silenced',
      'smg_a', 'smg_b', 'smg_c',
      'ar_a', 'ar_b', 'ar_c', 'ar_d',
      'sg_a', 'sg_b', 'sg_c',
      'sn_a', 'sn_b',
      'leather_jacket', 'kevlar_vest', 'ballistic_vest', 'riot_gear',
      'military_armour', 'composite_vest',
      'ammo_standard', 'ammo_hollow', 'ammo_tracer', 'ammo_piercing',
      'ammo_incendiary', 'ammo_subsonic'
    ]
  };

  C.screens.armoury = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Armoury', [
        { label: 'Items', onClick: function () { C.router.go('inventory'); } }
      ]));

      var cashEl = h('span', { class: 'pill gold' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Weapons, armour and ammunition' }),
        cashEl
      ));
      function live(s) { C.dom.setText(cashEl, U.money(s.player.cash)); }
      live(sv);
      C.engine.live(live);

      /* Equipped summary. */
      var weapon = S.equippedWeapon(sv);
      var armour = S.equippedArmour(sv);
      root.appendChild(UI.card('Equipped', null, [
        h('div', { class: 'row between' },
          h('span', null, h('span', { class: 'small muted', text: 'Weapon  ' }),
            h('span', { text: weapon ? weapon.name + ' (dmg ' + weapon.dmg + ')' : 'none' })),
          h('span', null, h('span', { class: 'small muted', text: 'Armour  ' }),
            h('span', { text: armour ? armour.name + ' (def ' + armour.def + ')' : 'none' }))
        ),
        h('div', { class: 'small muted', style: { marginTop: '8px' },
          text: 'Battle power ' + Math.round(S.playerPower(sv)) +
                ' · defence ' + Math.round(S.playerDefence(sv)) })
      ]));

      /* ---- STOCK, GROUPED ---- */
      var groups = {
        'Melee': function (it) { return it.cat === 'weapon' && it.sub === 'melee'; },
        'Pistols': function (it) { return it.cat === 'weapon' && it.sub === 'pistol'; },
        'Submachine guns': function (it) { return it.cat === 'weapon' && it.sub === 'smg'; },
        'Assault rifles': function (it) { return it.cat === 'weapon' && it.sub === 'rifle'; },
        'Shotguns': function (it) { return it.cat === 'weapon' && it.sub === 'shotgun'; },
        'Snipers': function (it) { return it.cat === 'weapon' && it.sub === 'sniper'; },
        'Armour': function (it) { return it.cat === 'armour'; },
        'Ammunition': function (it) { return it.cat === 'ammo'; }
      };

      Object.keys(groups).forEach(function (label) {
        var test = groups[label];
        var stock = DEALER.stock
          .map(function (id) { return D.items[id]; })
          .filter(function (it) { return it && test(it); });
        if (!stock.length) return;

        var body = h('div');
        stock.forEach(function (it) {
          var price = Math.round(it.price * DEALER.surcharge);
          body.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
            h('div', null,
              h('div', { class: 'rarity-' + it.rarity,
                text: it.name + (it.dmg ? '  dmg ' + it.dmg : '') + (it.def ? '  def ' + it.def : '') }),
              h('div', { class: 'small muted', text: it.desc || '' })
            ),
            h('div', { class: 'row' },
              h('span', { class: 'small gold', text: U.money(price) }),
              h('button', { class: 'small primary', text: 'Buy',
                disabled: sv.player.cash < price,
                onclick: function () {
                  var r = buyDirect(sv, it.id, price, 1);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast('Bought ' + it.name, 'money');
                  C.router.go('armoury');
                }
              })
            )
          ));
        });

        root.appendChild(UI.details(h('span', { text: label }), [
          h('p', { class: 'small muted', text: DEALER.blurb }),
          body
        ], label === 'Melee' || label === 'Armour'));
      });

      return root;
    }
  };

  function buyDirect(sv, itemId, price, qty) {
    if (sv.player.cash < price * qty) return { ok: false, reason: 'Not enough cash on hand.' };
    sv.player.cash -= price * qty;
    C.actions.addItem(itemId, qty);
    C.actions.log('Bought ' + qty + '× ' + D.items[itemId].name + ' for ' +
      U.money(price * qty) + ' at ' + DEALER.name + '.', 'money');
    return { ok: true };
  }
})(window.CALIGO);
