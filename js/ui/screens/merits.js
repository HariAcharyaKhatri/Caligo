/* CALIGO — Merits Upgrade Center screen.
   Allocates earned merits into permanent character progression upgrades. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var S = C.state;
  var UI = C.ui;
  var A = C.actions;
  var U = C.util;
  var cfg = C.config;

  C.screens = C.screens || {};

  C.screens.merits = {
    render: function () {
      var sv = C.state.save;
      var p = sv.player;
      p.meritUpgrades = p.meritUpgrades || {
        sharpness: 0, brawn: 0, protection: 0, evasion: 0,
        crit: 0, nerve_bar: 0, ce: 0, edu: 0, bank: 0, mug: 0, life: 0
      };

      var root = h('div');

      root.appendChild(UI.pageHead('Merits Upgrade Center', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      /* ---- TOP OVERVIEW BAR ---- */
      var overview = h('div', {
        class: 'card',
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          background: 'var(--panel2)',
          border: '1px solid var(--line2)'
        }
      },
        h('div', {},
          h('div', { style: { fontSize: '18px', fontWeight: 'bold', color: 'var(--gold)' } },
            'Available Merits: ' + (p.merits || 0)
          ),
          h('div', { class: 'small muted', style: { marginTop: '4px' } },
            'Total Allocated: ' + (p.meritsSpent || 0) + ' merits | Permanent stat & perk upgrades'
          )
        ),
        h('div', { style: { display: 'flex', gap: '8px' } },
          h('button', {
            class: 'btn small',
            disabled: !p.meritsSpent,
            style: { border: '1px solid var(--red)', color: 'var(--red)' },
            onClick: function () {
              if (confirm('Reset and refund all ' + p.meritsSpent + ' allocated merits?')) {
                A.resetMerits();
                C.router.refresh();
              }
            }
          }, 'Reset All Merits')
        )
      );
      root.appendChild(overview);

      /* ---- CATEGORIES LIST ---- */
      var cats = cfg.MERITS.categories;
      var grid = h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '12px'
        }
      });

      var icons = {
        sharpness: '⚡', brawn: '🥊', protection: '🛡', evasion: '💨',
        crit: '🎯', nerve_bar: '⚡', ce: '🕵', edu: '🎓',
        bank: '🏦', mug: '💰', life: '❤️'
      };

      Object.keys(cats).forEach(function (k) {
        var cat = cats[k];
        var tier = p.meritUpgrades[k] || 0;
        var isMax = tier >= cat.max;
        var pct = Math.round((tier / cat.max) * 100);

        var card = h('div', {
          class: 'card',
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--panel)',
            border: isMax ? '1px solid var(--gold)' : '1px solid var(--line)',
            padding: '14px'
          }
        });

        var head = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
          h('div', { style: { fontWeight: 'bold', fontSize: '15px' } },
            (icons[k] || '◈') + ' ' + cat.name
          ),
          h('span', { class: isMax ? 'pill gold' : 'pill muted' },
            isMax ? 'MAX (10/10)' : 'Rank ' + tier + '/' + cat.max
          )
        );

        var desc = h('div', { class: 'small muted', style: { marginBottom: '10px', lineHeight: '1.4' } },
          cat.desc
        );

        /* Progress track */
        var barTrack = h('div', {
          style: {
            height: '6px',
            background: 'var(--line2)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '12px'
          }
        },
          h('div', {
            style: {
              height: '100%',
              width: pct + '%',
              background: isMax ? 'var(--gold)' : 'var(--blue)',
              transition: 'width 0.2s'
            }
          })
        );

        /* Current Effect Readout */
        var effectText = '';
        if (k === 'nerve_bar') effectText = '+' + tier + ' Max Nerve';
        else if (k === 'ce') effectText = '+' + (tier * 3) + '% Crime Exp';
        else if (k === 'edu') effectText = '−' + (tier * 2) + '% Course Time';
        else if (k === 'bank' || k === 'mug') effectText = '+' + (tier * 5) + '% Bonus';
        else if (k === 'life') effectText = '+' + (tier * 3) + '% Max Life';
        else effectText = '+' + tier + '% Stat Multiplier';

        var foot = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' } },
          h('div', { class: 'small', style: { color: 'var(--text)' } },
            tier > 0 ? ('Active: ' + effectText) : 'No bonus yet'
          ),
          h('button', {
            class: isMax ? 'btn small disabled' : (p.merits >= 1 ? 'btn small primary' : 'btn small'),
            disabled: isMax || p.merits < 1,
            onClick: function () {
              var res = A.upgradeMerit(k);
              if (res.ok) {
                C.router.refresh();
              }
            }
          }, isMax ? 'Mastered' : 'Upgrade (1 Merit)')
        );

        card.appendChild(head);
        card.appendChild(desc);
        card.appendChild(barTrack);
        card.appendChild(foot);
        grid.appendChild(card);
      });

      root.appendChild(grid);
      return root;
    }
  };
})(window.CALIGO);
