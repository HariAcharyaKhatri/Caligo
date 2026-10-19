/* CALIGO — Turn-Based Street Combat & Bot Duels with Modern Arena UI. */
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

  C.screens.combat = {
    render: function () {
      var sv = C.state.save;
      if (sv.combat) return renderFight(sv);
      return renderBotList(sv);
    }
  };

  /* ---- BOT LIST -------------------------------------------------------- */
  function renderBotList(sv) {
    var root = h('div');

    root.appendChild(UI.pageHead('Street Combat & Duels', [
      { label: 'City', onClick: function () { C.router.go('city'); } }
    ]));

    var energyPill = h('span', { class: 'pill green' });
    root.appendChild(h('div', { class: 'row between', style: { marginBottom: '14px', background: 'var(--panel2)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' } },
      h('span', { class: 'small muted', text: 'Encounter street thugs, rival enforcers & cartel bosses' }),
      energyPill
    ));

    function live(s) {
      C.dom.setText(energyPill, '⚡ Energy: ' + Math.floor(s.player.energy) + ' / ' + S.maxEnergy(s.player));
    }
    live(sv);
    C.engine.live(live);

    if (!S.canAct(sv)) {
      root.appendChild(UI.card('Cannot Fight Right Now', null, h('p', { class: 'bad',
        text: S.inTransit(sv) ? 'You are currently in transit.' :
              (S.isJailed(sv) ? 'You are in a holding cell.' : 'You are recovering in the clinic.') })));
      return root;
    }
    if (sv.player.abroad) {
      root.appendChild(UI.card('International Turf', null, h('p', { class: 'muted',
        text: 'Foreign street fighting is restricted. Buy local goods or fly back to Caligo.' })));
      return root;
    }

    var bannerCard = h('div', { class: 'card', style: {
      background: 'linear-gradient(135deg, rgba(231,76,60,0.12) 0%, rgba(20,22,25,0.95) 100%)',
      borderLeft: '4px solid var(--red)'
    }},
      h('div', { class: 'row between' },
        h('div', null,
          h('h3', { style: { margin: 0, color: '#fff' }, text: 'Active Street Population' }),
          h('p', { class: 'small muted', style: { margin: '2px 0 0' }, text: 'Cost: ' + C.config.COMBAT.energyCost + '⚡ per duel. Losers are hospitalized; victors claim respect, cash mugs, or hospitalizations.' })
        ),
        h('button', { class: 'small primary', text: '↻ Find New Targets', onclick: function () { C.router.go('combat'); } })
      )
    );
    root.appendChild(bannerCard);

    var grid = h('div', { class: 'grid two' });
    A.botSample(12).forEach(function (bot) {
      grid.appendChild(botCard(sv, bot));
    });
    root.appendChild(grid);

    root.appendChild(UI.card('Recent Combat Blotter', null, UI.logPanel(sv, 15)));

    return root;
  }

  function botCard(sv, bot) {
    var winChance = A.estimatedWinChance(bot);
    var canFight = sv.player.energy >= C.config.COMBAT.energyCost;

    var card = h('div', { class: 'card' },
      h('div', { class: 'row between', style: { marginBottom: '6px' } },
        h('div', null,
          h('div', { style: { fontFamily: 'var(--font-display)', fontSize: '1.1em', fontWeight: '700', color: '#fff' }, text: bot.name }),
          h('div', { class: 'small muted', text: C.bots.tierLabel(bot) + ' · Level ' + bot.level })
        ),
        UI.pill(Math.round(winChance * 100) + '% Chance', UI.chanceClass(winChance))
      ),
      h('div', { class: 'small muted', html:
        bot.age + ', ' + bot.build + ', ' + bot.occupation + '. ' +
        (bot.online ? '<span class="good">● Online</span>' : '<span class="dim">○ Offline</span>') + ', ' + bot.activity }),
      h('div', { class: 'small dim', style: { marginTop: '6px', fontFamily: 'monospace' }, text:
        'STR ' + Math.floor(bot.stats.strength) + ' · DEF ' + Math.floor(bot.stats.defense) +
        ' · SPD ' + Math.floor(bot.stats.speed) + ' · DEX ' + Math.floor(bot.stats.dexterity) +
        ' · Life ' + Math.floor(bot.life) }),
      h('div', { class: 'row', style: { marginTop: '10px' } },
        h('button', {
          class: 'primary small',
          style: { width: '100%' },
          text: '⚔ Attack ' + bot.name + ' (' + C.config.COMBAT.energyCost + '⚡)',
          disabled: !canFight,
          onclick: function () {
            UI.confirm('Initiate street duel against ' + bot.name + '? Costs ' +
              C.config.COMBAT.energyCost + ' energy.', function () {
              var r = A.startFight(bot.id);
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              if (C.audio) C.audio.play('crit');
              C.router.go('combat');
            });
          }
        })
      )
    );
    return card;
  }

  /* ---- FIGHT ARENA SCREEN ----------------------------------------------- */
  function renderFight(sv) {
    var combat = sv.combat;
    var bot = C.bots.find(sv, combat.botId);
    var root = h('div');

    root.appendChild(UI.pageHead(combat.over ? 'Combat Duel Ended' : 'Combat Arena — Round ' + combat.round, [
      { label: 'City', onClick: function () { C.router.go('city'); } }
    ]));

    var playerPct = Math.max(0, Math.min(100, (combat.playerLife / combat.playerMaxLife) * 100));
    var botPct = Math.max(0, Math.min(100, (combat.botLife / combat.botMaxLife) * 100));

    /* Arena Visual Display */
    var arena = h('div', { class: 'combat-arena' },
      h('div', { class: 'combat-fighters-row' },
        /* Player */
        h('div', { class: 'fighter-card player-fighter' },
          h('div', { class: 'fighter-name', text: sv.player.name }),
          h('div', { class: 'small muted', text: 'You (Lvl ' + sv.player.level + ')' }),
          h('div', { class: 'fighter-health-track' },
            h('div', { class: 'fighter-health-fill player', style: { width: playerPct + '%' } })
          ),
          h('div', { style: { fontFamily: 'monospace', fontWeight: '700', fontSize: '0.85em' },
            text: Math.max(0, Math.floor(combat.playerLife)) + ' / ' + Math.floor(combat.playerMaxLife) + ' HP' })
        ),
        /* VS Badge */
        h('div', { class: 'vs-badge' }, 'VS'),
        /* Bot */
        h('div', { class: 'fighter-card bot-fighter' },
          h('div', { class: 'fighter-name', text: bot ? bot.name : combat.botName }),
          h('div', { class: 'small muted', text: bot ? C.bots.tierLabel(bot) + ' (Lvl ' + bot.level + ')' : 'Opponent' }),
          h('div', { class: 'fighter-health-track' },
            h('div', { class: 'fighter-health-fill enemy', style: { width: botPct + '%' } })
          ),
          h('div', { style: { fontFamily: 'monospace', fontWeight: '700', fontSize: '0.85em' },
            text: Math.max(0, Math.floor(combat.botLife)) + ' / ' + Math.floor(combat.botMaxLife) + ' HP' })
        )
      )
    );
    root.appendChild(arena);

    /* Combat Feed Log */
    var logBox = h('div', { class: 'log', style: { maxHeight: '220px' } });
    combat.log.slice(-14).forEach(function (e) {
      var cls = e.side === 'player' ? 'log-good bold' :
                e.side === 'bot' ? 'log-bad' : 'log-info';
      logBox.appendChild(h('div', { class: 'log-line' },
        h('span', { class: cls, text: e.text })
      ));
    });
    root.appendChild(UI.card('Real-Time Combat Log', null, logBox));

    /* Actions or Outcome */
    if (combat.over) {
      root.appendChild(renderOutcome(sv, combat, bot));
    } else {
      root.appendChild(renderMoves(sv, combat));
    }

    return root;
  }

  function renderMoves(sv, combat) {
    var box = h('div', { class: 'grid three' });

    function btn(id, icon, label, hint, colorClass) {
      return h('button', {
        class: colorClass || '',
        style: { padding: '8px 10px', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
        onclick: function () {
          var r = A.fightRound(id);
          if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
          if (C.audio) C.audio.play('punch');
          C.router.go('combat');
        }
      },
        h('span', { style: { fontSize: '1.2em' }, text: icon }),
        h('span', { style: { fontWeight: '700' }, text: label }),
        h('span', { class: 'tiny muted', text: hint })
      );
    }

    box.appendChild(btn('basic',  '⚔', 'Basic Strike', 'Balanced attack', 'primary'));
    box.appendChild(btn('power',  '💥', 'Power Slam',  'High damage, lower accuracy', 'primary'));
    box.appendChild(btn('quick',  '⚡', 'Quick Jab',   'Fast, high accuracy', 'primary'));
    box.appendChild(btn('aimed',  '🎯', 'Aimed Shot',  'High crit rate', 'primary'));
    box.appendChild(btn('wild',   '🌪', 'Wild Swing',  'Risky and unpredictable', ''));
    box.appendChild(btn('block',  '🛡', 'Guard Block', 'Halves incoming blow', 'blue'));
    box.appendChild(btn('dodge',  '💨', 'Evasive Roll','Chance to fully avoid blow', 'blue'));
    box.appendChild(btn('disarm', '🥋', 'Disarm Foe',  'Strip opponent weapon', 'gold'));
    box.appendChild(btn('run',    '🏃', 'Flee Alley',  '50% chance to retreat', 'ghost'));

    return UI.card('Tactical Combat Stance', 'Select your combat move for Round ' + combat.round + ':', box);
  }

  function renderOutcome(sv, combat, bot) {
    var box = h('div');
    var outcome = combat.outcome;
    var isWin = outcome === 'win';
    var isLoss = outcome === 'loss';

    if (isWin && C.audio && !combat.resolved) C.audio.play('win');
    if (isLoss && C.audio && !combat.resolved) C.audio.play('hospital');

    var title = isWin ? '🏆 VICTORY ACHIEVED' : (isLoss ? '💀 DEFEAT — HOSPITALIZED' : '🏃 RETREATED FROM COMBAT');
    var titleColor = isWin ? 'var(--green)' : (isLoss ? 'var(--red)' : 'var(--gold)');

    box.appendChild(h('h2', { style: { color: titleColor, margin: '0 0 10px' }, text: title }));

    if (isWin && !combat.resolved) {
      box.appendChild(h('p', { class: 'small muted', text: 'The opponent is incapacitated on the ground. Decide their fate:' }));
      box.appendChild(h('div', { class: 'row', style: { gap: '10px' } },
        h('button', {
          class: 'primary small',
          style: { flex: '1' },
          text: '🤝 Leave for Respect (+Honor)',
          onclick: function () { A.resolveWin('leave'); C.router.go('combat'); }
        }),
        h('button', {
          class: 'gold small',
          style: { flex: '1' },
          text: '💰 Mug for Cash (' + Math.round(C.config.COMBAT.mugShare * 100) + '%)',
          onclick: function () { A.resolveWin('mug'); if (C.audio) C.audio.play('cash'); C.router.go('combat'); }
        }),
        h('button', {
          class: 'danger small',
          style: { flex: '1' },
          text: '🏥 Hospitalize (Longer Knockout)',
          onclick: function () { A.resolveWin('hospitalise'); C.router.go('combat'); }
        })
      ));
    }

    if (isLoss) {
      box.appendChild(h('p', { class: 'bad bold',
        text: 'You sustained severe trauma and have been rushed to the Clinic Ward for ' + U.dur(combat.hospitalSeconds || 0) + '.' }));
      if (combat.rewardCash) {
        box.appendChild(h('p', { class: 'muted small',
          text: 'The opponent mugged you for ' + U.money(-combat.rewardCash) + '.' }));
      }
    }

    if (isWin && combat.resolved) {
      box.appendChild(h('p', { class: 'good small bold',
        text: 'Combat rewarded: +' + (combat.rewardXp || 0) + ' battle XP.' }));
      if (combat.resolved === 'mug') {
        box.appendChild(h('p', { class: 'good small bold',
          text: 'Mugged cash: +' + U.money(combat.took || 0) }));
      }
    }

    box.appendChild(h('div', { style: { marginTop: '14px' } },
      h('button', {
        class: 'primary',
        style: { width: '100%' },
        text: 'Back to the Streets',
        onclick: function () {
          A.clearCombat();
          C.router.go('combat');
        }
      })
    ));

    return UI.card('Combat Resolution', null, box);
  }
})(window.CALIGO);
