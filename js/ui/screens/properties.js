window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, UI = C.ui, U = C.util, A = C.actions, S = C.state, D = C.data;

  C.screens = C.screens || {};
  C.screens.properties = {
    render: function () {
      var save = S.save;
      var player = save.player;
      player.propertiesOwned = player.propertiesOwned || ['shack'];
      player.property = player.property || 'shack';

      var currentProp = (D.propertyById && D.propertyById[player.property]) || { name: 'Shack', happyCap: 100, upkeep: 0, desc: 'A damp concrete cubicle.' };

      var root = h('div');
      root.appendChild(UI.pageHead('Properties & Real Estate', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      // Active Residence Card
      var activeCard = UI.section('Active Residence', [
        h('div', { class: 'p-12', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' } }, [
          h('div', {}, [
            h('h3', { style: { margin: '0 0 6px 0', fontSize: '1.2em' }, text: '⌂ ' + currentProp.name }),
            h('p', { class: 'small muted', style: { margin: '0 0 8px 0' }, text: currentProp.desc }),
            h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
              UI.pill('Cap: ' + S.maxHappiness(player) + ' Happy', 'good'),
              UI.pill('Upkeep: ' + U.money(currentProp.upkeep) + '/day', 'grey'),
              UI.pill('Status: Primary Home', 'blue')
            ])
          ]),
          h('div', { style: { textAlign: 'right' } }, [
            h('div', { class: 'small muted', text: 'Properties Owned' }),
            h('div', { style: { fontSize: '1.3em', fontWeight: 'bold', color: 'var(--accent)' }, text: player.propertiesOwned.length + ' / ' + (D.properties ? D.properties.length : 14) })
          ])
        ])
      ]);
      root.appendChild(activeCard);

      // Property Listing
      var rows = [];
      (D.properties || []).forEach(function (p) {
        var isCurrent = (player.property === p.id);
        var isOwned = (player.propertiesOwned.indexOf(p.id) !== -1);
        var canAfford = (player.cash >= p.cost);

        var statusBadge;
        if (isCurrent) {
          statusBadge = UI.pill('Active Home', 'good');
        } else if (isOwned) {
          statusBadge = UI.pill('Owned', 'blue');
        } else {
          statusBadge = UI.pill(U.money(p.cost), canAfford ? 'gold' : 'grey');
        }

        var actionsWrap = h('div', { style: { display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' } });

        if (isCurrent) {
          actionsWrap.appendChild(h('button', { class: 'small', disabled: true, text: 'Current' }));
        } else if (isOwned) {
          actionsWrap.appendChild(h('button', {
            class: 'small primary',
            text: 'Move In',
            onclick: function () {
              var res = A.moveProperty(p.id);
              if (res.ok) {
                UI.toast('Moved into ' + p.name + '!', 'good');
                C.router.render();
              } else {
                UI.toast(res.reason, 'bad');
              }
            }
          }));
          if (p.id !== 'shack') {
            actionsWrap.appendChild(h('button', {
              class: 'small danger',
              text: 'Sell (' + U.money(Math.floor(p.cost * 0.75)) + ')',
              onclick: function () {
                UI.modal({
                  title: 'Sell ' + p.name + '?',
                  body: 'Are you sure you want to sell this property for ' + U.money(Math.floor(p.cost * 0.75)) + ' (75% market value)?',
                  actions: [
                    { label: 'Cancel' },
                    {
                      label: 'Sell Property',
                      danger: true,
                      onClick: function () {
                        var res = A.sellProperty(p.id);
                        if (res.ok) {
                          UI.toast('Sold ' + p.name + ' for ' + U.money(res.refund) + '!', 'money');
                          C.router.render();
                        } else {
                          UI.toast(res.reason, 'bad');
                        }
                      }
                    }
                  ]
                });
              }
            }));
          }
        } else {
          actionsWrap.appendChild(h('button', {
            class: 'small' + (canAfford ? ' primary' : ''),
            disabled: !canAfford,
            text: 'Buy ' + U.money(p.cost),
            onclick: function () {
              UI.modal({
                title: 'Purchase ' + p.name + '?',
                body: 'Buy ' + p.name + ' for ' + U.money(p.cost) + '? This will raise your base happiness capacity to ' + p.happyCap + ' and move you in immediately.',
                actions: [
                  { label: 'Cancel' },
                  {
                    label: 'Confirm Purchase',
                    primary: true,
                    onClick: function () {
                      var res = A.buyProperty(p.id);
                      if (res.ok) {
                        UI.toast('Purchased ' + p.name + '!', 'money');
                        C.router.render();
                      } else {
                        UI.toast(res.reason, 'bad');
                      }
                    }
                  }
                ]
              });
            }
          }));
        }

        var row = h('tr', {
          class: 'property-row',
          dataset: {
            propId: p.id,
            owned: isOwned ? 'true' : 'false',
            tier: p.cost >= 5000000 ? 'luxury' : (p.cost >= 200000 ? 'mid' : 'starter')
          }
        }, [
          h('td', {}, [
            h('div', { style: { fontWeight: 'bold' }, text: p.name }),
            h('div', { class: 'small muted', text: p.desc })
          ]),
          h('td', { style: { textAlign: 'center' } }, [
            h('span', { style: { fontWeight: 'bold', color: '#55efc4' }, text: p.happyCap })
          ]),
          h('td', { style: { textAlign: 'center', whiteSpace: 'nowrap' } }, [
            h('span', { class: 'small muted', text: U.money(p.upkeep) + '/d' })
          ]),
          h('td', { style: { textAlign: 'center' } }, [statusBadge]),
          h('td', { style: { textAlign: 'right' } }, [actionsWrap])
        ]);
        rows.push(row);
      });

      var propTabs = [
        { id: 'all', label: 'All Estates', count: 14 },
        { id: 'owned', label: 'Owned', count: player.propertiesOwned.length },
        { id: 'starter', label: 'Starter & Budget' },
        { id: 'mid', label: 'Mid-Tier Flats' },
        { id: 'luxury', label: 'Luxury & Island' }
      ];

      var propFilterBar = UI.tabBar(propTabs, 'all', function (tabId) {
        rows.forEach(function (r) {
          if (tabId === 'all') {
            r.style.display = '';
          } else if (tabId === 'owned') {
            r.style.display = r.dataset.owned === 'true' ? '' : 'none';
          } else {
            r.style.display = r.dataset.tier === tabId ? '' : 'none';
          }
        });
      });

      var table = h('table', { class: 'table-torn', style: { width: '100%' } }, [
        h('thead', {}, [
          h('tr', {}, [
            h('th', { style: { textAlign: 'left' }, text: 'Property' }),
            h('th', { style: { textAlign: 'center', width: '80px' }, text: 'Happy Cap' }),
            h('th', { style: { textAlign: 'center', width: '90px' }, text: 'Upkeep' }),
            h('th', { style: { textAlign: 'center', width: '90px' }, text: 'Status' }),
            h('th', { style: { textAlign: 'right', width: '150px' }, text: 'Action' })
          ])
        ]),
        h('tbody', {}, rows)
      ]);

      root.appendChild(UI.section('Real Estate Listings', [
        h('p', { class: 'small muted p-8', style: { margin: 0, marginBottom: '8px' }, text: 'Owning higher-tier properties permanently elevates your maximum happiness bar, multiplying gym stat gains and crime success rates. Resale recovers 75% of purchase value.' }),
        propFilterBar,
        table
      ]));

      return root;
    }
  };
})(window.CALIGO);
