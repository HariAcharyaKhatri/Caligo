/* CALIGO — High-Tech Gym Training Facility with Multi-Train & Audio. */
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

  C.screens.gym = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Underground & Iron Gyms', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      var energyEl = h('span', { class: 'pill green', id: 'gym-energy' });
      var statLine = h('div', { class: 'small' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '14px', background: 'var(--panel2)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' } }, statLine, energyEl));

      function liveHeader(s) {
        C.dom.setText(energyEl, '⚡ Energy: ' + Math.floor(s.player.energy) + ' / ' + S.maxEnergy(s.player));
        var parts = ['strength', 'defense', 'speed', 'dexterity'].map(function (k) {
          return '<span class="muted">' + U.titleCase(k).slice(0,3) + ':</span> <b style="color:#fff">' + Math.floor(s.player.stats[k]) + '</b>';
        });
        statLine.innerHTML = parts.join(' &nbsp;•&nbsp; ') + ' &nbsp;•&nbsp; <span class="muted">Happy:</span> <b class="gold">' + Math.floor(s.player.happiness) + '</b>';
      }
      liveHeader(sv);
      C.engine.live(liveHeader);

      if (S.isJailed(sv)) {
        root.appendChild(UI.card('Holding Cell Lockdown', null,
          h('p', { class: 'bad', text: 'You cannot train while locked up in a jail cell.' })));
        return root;
      }
      if (S.isHospital(sv)) {
        root.appendChild(UI.card('Clinic Recovery Ward', null,
          h('p', { class: 'bad', text: 'You cannot exert physical effort while recovering from trauma.' })));
        return root;
      }

      /* ---- GYM FACILITIES ---- */
      D.gyms.forEach(function (gym) {
        root.appendChild(gymCard(gym));
      });

      /* ---- HAPPINESS RESTORATION ---- */
      var happyBox = h('div');
      D.happinessSources.forEach(function (src) {
        happyBox.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' } },
          h('span', null,
            h('span', { style: { fontWeight: '600' }, text: src.name + ' ' }),
            h('span', { class: 'small gold', text: '(+' + src.happiness + ' happy)' })
          ),
          h('button', {
            class: 'small green', text: 'Buy ' + U.money(src.cost),
            onclick: function () {
              var r = A.buyHappiness(src.id);
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              if (C.audio) C.audio.play('cash');
              UI.toast(src.name + ': +' + src.happiness + ' happiness', 'good');
            }
          })
        ));
      });
      root.appendChild(UI.details(
        h('span', { text: '★ Happiness Boosters (Higher Happy = Faster Stat Gains)' }),
        happyBox,
        false
      ));

      root.appendChild(UI.card('Recent Gym Activity', null, UI.logPanel(sv, 15)));

      return root;
    }
  };

  function gymCard(gym) {
    var sv = C.state.save;
    var member = S.hasMembership(sv, gym.id);

    var statusEl = h('span', { class: 'pill ' + (member || gym.fee === 0 ? 'good' : 'grey') });
    var controls = h('div', { class: 'stack' });

    var statSelect = h('select', null,
      D.trainableStats.map(function (s) {
        return h('option', { value: s.id, text: s.label });
      })
    );

    var trainerSelect = h('select', null,
      D.trainers.map(function (t) {
        return h('option', { value: t.id, text: t.name + (t.cost ? ' — ' + U.money(t.cost) : ' (Solo)') });
      })
    );

    function executeTrain(multiplier) {
      var statId = statSelect.value;
      var trainerId = trainerSelect.value;
      var totalCost = gym.energy * multiplier;

      if (sv.player.energy < totalCost) {
        UI.toast('Not enough energy for ' + multiplier + 'x sessions (' + totalCost + ' required).', 'bad');
        return;
      }

      var totalGains = {};
      var totalInjuries = 0;
      var lastRes = null;

      for (var i = 0; i < multiplier; i++) {
        var res = A.train(gym.id, statId, trainerId);
        if (!res.ok) {
          if (i === 0) UI.toast(res.reason, 'bad');
          break;
        }
        lastRes = res;
        Object.keys(res.gains).forEach(function (k) {
          totalGains[k] = (totalGains[k] || 0) + res.gains[k];
        });
        if (res.injury) {
          totalInjuries++;
          break; // Stop on injury
        }
      }

      if (lastRes) {
        if (C.audio) C.audio.play(totalInjuries > 0 ? 'punch' : 'levelUp');
        var lines = h('div');
        lines.appendChild(h('p', { class: 'good bold', text: 'Completed ' + (i) + ' workout sessions!' }));

        var rows = Object.keys(totalGains).map(function (k) {
          return { cells: [U.titleCase(k), '+' + totalGains[k].toFixed(2)] };
        });
        lines.appendChild(UI.table([{ label: 'Stat' }, { label: 'Total Gained', num: true }], rows));

        if (totalInjuries > 0 && lastRes.injury) {
          lines.appendChild(h('p', { class: 'bad bold',
            text: '⚠ INJURY OCCURRED: -' + lastRes.injury.damage + ' life, rushed to clinic!' }));
        }

        UI.modal({ title: gym.name + ' Training Results', body: lines, actions: [{ label: 'Nice!', primary: true }] });
      }
    }

    var train1Btn = h('button', { class: 'primary small', text: 'Train 1× (' + gym.energy + '⚡)', onclick: function () { executeTrain(1); } });
    var train5Btn = h('button', { class: 'primary small', text: 'Train 5× (' + (gym.energy * 5) + '⚡)', onclick: function () { executeTrain(5); } });
    var trainAllBtn = h('button', {
      class: 'gold small', text: 'Train Max Energy',
      onclick: function () {
        var maxSessions = Math.floor(sv.player.energy / gym.energy);
        if (maxSessions <= 0) { UI.toast('Not enough energy to train.', 'bad'); return; }
        executeTrain(maxSessions);
      }
    });

    controls.appendChild(h('div', { class: 'row' },
      h('div', { style: { flex: '1 1 140px' } }, h('label', { text: 'Attribute Target' }), statSelect),
      h('div', { style: { flex: '1 1 160px' } }, h('label', { text: 'Personal Coach' }), trainerSelect)
    ));

    controls.appendChild(h('div', { class: 'row', style: { marginTop: '4px' } },
      train1Btn, train5Btn, trainAllBtn
    ));

    if (gym.fee > 0 && !member) {
      controls.appendChild(h('button', {
        class: 'green small',
        style: { marginTop: '6px' },
        text: '💳 Buy 24h Pass — ' + U.money(gym.fee),
        onclick: function () {
          UI.confirm('Buy a 24-hour pass at ' + gym.name + ' for ' + U.money(gym.fee) + '?',
            function () {
              var r = A.buyMembership(gym.id);
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              if (C.audio) C.audio.play('cash');
              UI.toast('Membership unlocked at ' + gym.name, 'money');
              C.router.go('gym');
            });
        }
      }));
    }

    var card = h('div', { class: 'card' },
      h('div', { class: 'row between', style: { marginBottom: '8px' } },
        h('div', null,
          h('div', { style: { fontFamily: 'var(--font-display)', fontSize: '1.15em', fontWeight: '700', color: '#fff' }, text: gym.name }),
          h('div', { class: 'small muted', text: gym.desc })
        ),
        statusEl
      ),
      h('div', { class: 'small muted', style: { marginBottom: '10px' } },
        'Stat Multiplier: <b style="color:var(--gold)">×' + gym.mult.toFixed(1) + '</b>' +
        (gym.fee ? ' · ' + U.money(gym.fee) + '/day' : ' · Free access') +
        ' · ' + gym.energy + '⚡ per session' +
        (gym.injuryRisk ? ' · <span class="bad">' + Math.round(gym.injuryRisk * 100) + '% injury risk</span>' : '')
      ),
      controls
    );

    function live(s) {
      var isMember = S.hasMembership(s, gym.id);
      C.dom.setText(statusEl, isMember || gym.fee === 0 ? '✓ ACCESS GRANTED' : 'LOCKED (PASS REQUIRED)');
      statusEl.className = 'pill ' + (isMember || gym.fee === 0 ? 'good' : 'grey');
      var canAfford = s.player.energy >= gym.energy && (gym.fee === 0 || isMember);
      train1Btn.disabled = !canAfford;
      train5Btn.disabled = !canAfford || s.player.energy < gym.energy * 5;
      trainAllBtn.disabled = !canAfford;
    }
    live(sv);
    C.engine.live(live);

    return card;
  }
})(window.CALIGO);
