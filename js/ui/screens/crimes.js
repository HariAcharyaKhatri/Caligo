/* CALIGO — Crime Hub with Dynamic Mark Scoping & Sound FX. */
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

  C.screens.crimes = {
    render: function () {
      var sv = C.state.save;
      var p = sv.player;
      var root = h('div');

      root.appendChild(UI.pageHead('Underground Crime Hub', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      var nerveEl = h('span', { class: 'pill red', id: 'crime-nerve' });
      var tools = h('div', { class: 'small muted' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '14px', background: 'var(--panel2)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' } }, tools, nerveEl));

      function liveNerve(s) {
        C.dom.setText(nerveEl, '☠ Nerve: ' + Math.floor(s.player.nerve) + ' / ' + S.maxNerve(s.player));
        var carried = [];
        s.inventory.forEach(function (st) {
          var it = D.items[st.id];
          if (it && it.bonusTags) carried.push(it.name + ' (+' + it.bonus + ')');
        });
        C.dom.setText(tools, carried.length ? 'Carried Kit: ' + carried.join(', ') : 'No crime tools carried in luggage.');
      }
      liveNerve(sv);
      C.engine.live(liveNerve);

      if (S.isJailed(sv)) {
        root.appendChild(UI.card('Holding Cell Lockdown', null,
          h('p', { class: 'bad', text: 'You are locked in a holding cell and cannot work illegal street jobs.' })));
        return root;
      }
      if (S.isHospital(sv)) {
        root.appendChild(UI.card('Clinic Ward Recovery', null,
          h('p', { class: 'bad', text: 'You are recovering from physical trauma and cannot commit crimes.' })));
        return root;
      }

      /* Group crimes by tier */
      var tiers = Object.keys(D.crimesByTier).map(Number).sort(function (a, b) { return a - b; });

      tiers.forEach(function (tier) {
        var crimes = D.crimesByTier[tier];
        var unlocked = p.crimeLevel >= crimes[0].cl;
        var body = h('div');

        if (!unlocked) {
          body.appendChild(h('p', { class: 'dim small',
            text: 'Locked: Requires Crime Level ' + crimes[0].cl + ' (' + S.crimeLevelName(crimes[0].cl) +
                  '). Your Current Rank: ' + S.crimeLevelName(p.crimeLevel) + '.' }));
        }

        crimes.forEach(function (crime) {
          body.appendChild(crimeCard(crime, unlocked));
        });

        root.appendChild(UI.details(
          h('span', null,
            h('span', { style: { fontWeight: '700' }, text: 'Tier ' + tier + ' Operations ' }),
            UI.pill(unlocked ? '✓ UNLOCKED' : '🔒 LOCKED', unlocked ? 'good' : 'grey'),
            h('span', { class: 'small muted', text: '  (' + crimes.length + ' Available Jobs)' })
          ),
          body,
          tier === 1 || (unlocked && p.crimeLevel <= crimes[0].cl + 1)
        ));
      });

      return root;
    }
  };

  /* ---- ONE CRIME CARD ------------------------------------------------- */
  function crimeCard(crime, unlocked) {
    var sv = C.state.save;
    var p = sv.player;

    var canAfford = p.nerve >= crime.nerve;
    var state = h('span', { class: 'small' });

    var info = h('div', { class: 'small muted', style: { margin: '4px 0 8px' } },
      h('span', { style: { color: 'var(--red)', fontWeight: '700' }, text: crime.nerve + ' Nerve Cost · ' }),
      h('span', { text: 'Base Odds ' + Math.round(crime.base * 100) + '% · ' }),
      h('span', { class: 'gold bold', text: 'Reward ' + U.compact(crime.reward[0]) + '–' + U.compact(crime.reward[1]) }),
      h('span', { text: ' · Jail ' + crime.jail[0] + '–' + crime.jail[1] + 'm' })
    );

    var card = h('div', { class: 'card' + (unlocked ? '' : ' locked') },
      h('div', { class: 'row between' },
        h('div', null,
          h('div', { style: { fontFamily: 'var(--font-display)', fontSize: '1.1em', fontWeight: '700', color: '#fff' }, text: crime.name }),
          h('div', { class: 'small muted', text: crime.desc })
        ),
        state
      ),
      info,
      h('div', { class: 'row' },
        h('button', {
          class: unlocked ? 'primary small' : 'small',
          text: '🔍 Scope Out Target Marks',
          disabled: !unlocked || !canAfford,
          onclick: function () { openTargets(crime); }
        })
      )
    );

    function live(s) {
      var ok = s.player.nerve >= crime.nerve && unlocked;
      var btn = card.querySelector('button');
      if (btn) btn.disabled = !ok;
      C.dom.setText(state, ok ? '' : (unlocked ? 'Low Nerve' : 'Locked'));
      state.className = 'pill ' + (ok ? 'good' : (unlocked ? 'bad' : 'grey'));
    }
    live(sv);
    C.engine.live(live);

    return card;
  }

  /* ---- TARGET SELECTION MODAL ------------------------------------------ */
  function openTargets(crime) {
    var targets = A.rollTargets(crime.id, 4);
    var modalRef = null;

    function build() {
      var body = h('div');
      body.appendChild(h('p', { class: 'small muted', text:
        'Select a mark to hit. Target traits, security, and wealth influence success probability and payout.' }));

      targets.forEach(function (t) {
        body.appendChild(targetCard(crime, t, function () {
          if (modalRef) modalRef.close();
          commit(crime, t);
        }));
      });

      body.appendChild(h('div', { class: 'row', style: { marginTop: '12px' } },
        h('button', {
          class: 'small ghost', text: '↻ Re-Scope New Marks (Free)',
          onclick: function () {
            targets = A.rollTargets(crime.id, 4);
            if (modalRef) modalRef.close();
            openTargets(crime);
          }
        })
      ));

      return body;
    }

    modalRef = UI.modal({
      title: crime.name + ' — Target Marks',
      body: build(),
      actions: [{ label: 'Abort Mission' }]
    });
  }

  function targetCard(crime, target, onGo) {
    var calc = A.crimeChance(crime, target);
    var pct = Math.round(calc.chance * 100);

    var traits = h('div', { class: 'row', style: { gap: '4px', margin: '6px 0' } });
    traits.appendChild(UI.pill(target.wealth.label, 'gold'));
    target.traits.forEach(function (t) {
      var cls = t.mod > 0 ? 'good' : (t.mod < 0 ? 'bad' : 'grey');
      traits.appendChild(UI.pill(t.label + ' ' + (t.mod > 0 ? '+' : '') + t.mod, cls));
    });

    var low = Math.round(crime.reward[0] * target.rewardMult);
    var high = Math.round(crime.reward[1] * target.rewardMult);

    return h('div', { class: 'crime-mark-card' },
      h('div', { class: 'row between' },
        h('strong', { style: { color: '#fff', fontSize: '1.05em' }, text: target.title }),
        h('span', { class: 'chance-big ' + UI.chanceClass(calc.chance), text: pct + '% Success Odds' })
      ),
      traits,
      h('div', { class: 'row between', style: { marginTop: '8px' } },
        h('span', { class: 'small gold', text: 'Est. Take: ' + U.compact(low) + ' – ' + U.compact(high) }),
        h('button', { class: 'primary small', text: '⚡ Execute Operation', onclick: onGo })
      )
    );
  }

  /* ---- RESOLVE ---------------------------------------------------------- */
  function commit(crime, target) {
    var res = A.attemptCrime(crime.id, target);

    if (!res.ok) {
      UI.toast(res.reason, 'bad');
      return;
    }

    var body = h('div');
    var cls = res.success ? 'good bold' : 'bad bold';
    body.appendChild(h('p', { style: { fontSize: '1.1em' }, class: cls, text: res.text }));

    if (res.success) {
      if (C.audio) C.audio.play('cash');
    } else {
      if (res.jailSeconds > 0 && C.audio) C.audio.play('siren');
      else if (C.audio) C.audio.play('loss');
    }

    var rows = [
      ['Calculated Odds', Math.round(res.chance * 100) + '%'],
      ['Mark', target.title]
    ];
    if (res.success) {
      rows.push(['Cash Looted', U.money(res.payout)]);
      rows.push(['Experience Earned', '+' + res.xp + ' XP']);
    } else {
      if (res.jailSeconds > 0) rows.push(['Sentence Incurred', U.dur(res.jailSeconds) + ' Holding Cell']);
      if (res.hospitalSeconds) rows.push(['Clinic Recovery', U.dur(res.hospitalSeconds) + ' Trauma Ward']);
    }
    rows.push(['Wanted Stars Added', '+' + res.wanted]);
    rows.push(['Crime Expertise', '+' + res.crimeXp]);

    body.appendChild(UI.table([{ label: 'Operation Metric' }, { label: 'Outcome', num: true }],
      rows.map(function (r) { return { cells: [r[0], r[1]] }; })));

    /* Breakdown */
    var breakdown = h('div', { class: 'small', style: { marginTop: '10px' } });
    breakdown.appendChild(h('div', { class: 'muted bold', text: 'Statistical Odds Calculation:' }));
    res.parts.forEach(function (part) {
      if (Math.abs(part.value) < 0.05) return;
      var sign = part.value > 0 ? '+' : '';
      breakdown.appendChild(h('div', { class: 'row between' },
        h('span', { class: 'muted', text: part.label }),
        h('span', { class: part.value > 0 ? 'good' : 'bad', text: sign + part.value.toFixed(1) + '%' })
      ));
    });
    body.appendChild(h('hr', { class: 'sep' }));
    body.appendChild(breakdown);

    if (!res.success && (res.jailSeconds > 0 || res.hospitalSeconds > 0)) {
      var dest = res.hospitalSeconds > 0 ? 'hospital' : 'jail';
      UI.modal({
        title: res.success ? '✓ Job Accomplished' : '⚠ Operation Blown',
        body: body,
        actions: [
          { label: 'Stay at Crime Board' },
          { label: 'Proceed to ' + U.titleCase(dest), primary: true, onClick: function () { C.router.go(dest); } }
        ]
      });
    } else {
      UI.modal({
        title: res.success ? '✓ Clean Operation' : '⚠ Hit Failed',
        body: body,
        actions: [{ label: 'Back to Board', primary: true, onClick: function () { C.router.go('crimes'); } }]
      });
    }

    UI.toast(res.success ? 'Secured ' + U.money(res.payout) : 'Operation compromised!',
      res.success ? 'money' : 'bad');
  }
})(window.CALIGO);
