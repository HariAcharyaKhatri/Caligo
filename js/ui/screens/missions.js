window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.missions = {
    render: function () {
      var sv = C.state.save;
      A.rollDailyMissions();
      var root = h('div');
      root.appendChild(UI.pageHead('Missions', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      /* Story arc NPC chain. */
      var npcRow = h('div', { style: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' } });
      D.storyMissions.forEach(function (m, i) {
        var done = i < sv.missions.story;
        var active = i === sv.missions.story;
        npcRow.appendChild(h('div', { class: 'tile', style: {
          minWidth: '110px', cursor: 'default',
          opacity: done || active ? 1 : 0.4
        }},
          h('div', { class: 'tile-icon', text: done ? '✓' : (active ? '!' : '?') }),
          h('div', { class: 'tile-name', text: m.npc }),
          h('div', { class: 'tile-sub', text: done ? 'complete' : (active ? 'available' : 'locked') })
        ));
      });
      root.appendChild(UI.section('Contacts', [npcRow]));

      var cur = D.storyMissions[sv.missions.story];
      if (cur) {
        var prog = A.missionProgress(cur);
        var canClaim = prog >= cur.goal.target;
        root.appendChild(UI.section(cur.name + ' — ' + cur.npc, [
          h('p', { class: 'small', text: cur.text }),
          h('div', { class: 'small' },
            h('div', null, 'Goal: ' + goalText(cur.goal)),
            h('div', { class: canClaim ? 'good' : 'muted' },
              'Progress: ' + prog + ' / ' + cur.goal.target)
          ),
          h('div', { class: 'row', style: { marginTop: '8px' } },
            h('button', { class: 'green', text: 'Claim ' + U.money(cur.reward),
              disabled: !canClaim,
              onclick: function () {
                var r = A.claimStoryMission();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Story advance. ' + U.money(cur.reward), 'money');
                C.router.go('missions');
              }
            })
          )
        ]));
      } else {
        root.appendChild(UI.section('Story complete', [
          h('p', { class: 'good', text: 'You have reached the end of the current story arc.' })
        ]));
      }

      /* Daily missions. */
      var dlist = (sv.missions.daily && sv.missions.daily.list) || [];
      var rows = dlist.map(function (m) {
        var prog = A.missionProgress(m);
        var canClaim = prog >= m.goal.target && !sv.missions.dailyClaimed[m.id];
        var claimed = !!sv.missions.dailyClaimed[m.id];
        return {
          cells: [
            m.text,
            prog + ' / ' + m.goal.target,
            U.money(m.reward),
            claimed
              ? h('span', { class: 'good small', text: '✓' })
              : h('button', { class: 'small ' + (canClaim ? 'green' : ''),
                  text: 'Claim', disabled: !canClaim,
                  onclick: function () {
                    var r = A.claimDailyMission(m.id);
                    if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                    UI.toast('Claimed ' + U.money(m.reward), 'money');
                    C.router.go('missions');
                  }
                })
          ]
        };
      });
      root.appendChild(UI.section('Daily Missions', [
        UI.table([{ label: 'Mission' }, { label: 'Progress' }, { label: 'Reward', num: true }, { label: '' }], rows)
      ]));

      return root;
    }
  };

  function goalText(g) {
    switch (g.type) {
      case 'cash': return 'Hold ' + U.money(g.target);
      case 'crimes': return 'Succeed ' + g.target + ' crimes';
      case 'wins': return 'Win ' + g.target + ' fights';
      case 'trains': return 'Train ' + g.target + ' times';
      case 'spend': return 'Spend ' + U.money(g.target);
      case 'works': return 'Work ' + g.target + ' shift(s)';
      case 'courses': return 'Complete ' + g.target + ' course(s)';
      case 'marketBuys': return 'Buy from the item market ' + g.target + ' time(s)';
      case 'debt': return 'Pay off your starting debt of ' + U.money(g.target);
      case 'faction': return 'Join a faction';
      case 'level_cash': return 'Reach level ' + g.target + ' with ' + U.money(100000);
    }
    return '';
  }
})(window.CALIGO);
