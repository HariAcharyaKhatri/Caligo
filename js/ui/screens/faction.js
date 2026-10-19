window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.faction = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Faction', [
        { label: 'Territories', onClick: function () { C.router.go('territory'); } }
      ]));

      var f = S.faction(sv);

      if (!f) {
        root.appendChild(UI.section('Found your own', [
          h('p', { class: 'small muted', text: 'Once you have proven yourself, the option to found a faction unlocks.' })
        ]));

        root.appendChild(UI.section('Factions looking for members', [
          UI.table(
            [{ label: 'Faction' }, { label: 'Perk' }, { label: 'Req' }, { label: '' }],
            D.factions.map(function (x) {
              var reqText = 'Level ' + x.req.level + ', ' + U.titleCase(x.req.stat) + ' ' + x.req.value;
              var canJoin = sv.player.level >= x.req.level && sv.player.stats[x.req.stat] >= x.req.value;
              return {
                cells: [
                  h('div', null,
                    h('div', { text: x.name }),
                    h('div', { class: 'small muted', text: x.blurb })
                  ),
                  x.perk,
                  reqText,
                  h('button', { class: 'small ' + (canJoin ? 'green' : ''), text: canJoin ? 'Join' : 'Locked',
                    disabled: !canJoin,
                    onclick: function () {
                      UI.confirm('Join ' + x.name + '?', function () {
                        var r = A.joinFaction(x.id);
                        if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                        UI.toast('Joined ' + x.name, 'good');
                        C.router.go('faction');
                      });
                    }
                  })
                ]
              };
            })
          )
        ]));
        return root;
      }

      /* In-faction view. */
      root.appendChild(UI.section('Faction Information', [
        h('div', { class: 'grid two' },
          h('div', null,
            h('div', { class: 'small muted', text: 'Faction' }),
            h('div', { text: f.name }),
            h('div', { class: 'small muted', text: 'Role' }),
            h('div', { text: sv.faction.role }),
            h('div', { class: 'small muted', text: 'Perk' }),
            h('div', { class: 'small good', text: f.perk })
          ),
          h('div', null,
            h('div', { class: 'small muted', text: 'Respect' }),
            h('div', { class: 'gold', text: U.num(sv.faction.respect) }),
            h('div', { class: 'small muted', text: 'Chain' }),
            h('div', { text: sv.faction.chain + (sv.faction.chain > 0 ? ' (expires in ' + U.dur(sv.faction.chainExpires - sv.meta.gameTime) + ')' : '') })
          )
        ),
        h('div', { class: 'row', style: { marginTop: '8px' } },
          h('button', { class: 'danger small', text: 'Leave faction',
            onclick: function () {
              UI.confirm('Leave ' + f.name + '? Your respect is lost.', function () {
                A.leaveFaction(); C.router.go('faction');
              });
            }
          })
        )
      ]));

      /* War section. */
      if (sv.faction.war) {
        var war = sv.faction.war;
        var enemy = D.factions.filter(function (x) { return x.id === war.enemyId; })[0];
        root.appendChild(UI.section('Active war vs ' + (enemy ? enemy.name : '—'), [
          h('div', { class: 'grid two' },
            h('div', null,
              h('div', { class: 'small muted', text: 'Your score' }),
              h('div', { class: 'good', text: war.score }),
              h('div', { class: 'small muted', text: 'Enemy score' }),
              h('div', { class: 'bad', text: war.enemyScore })
            ),
            h('div', null,
              h('div', { class: 'small muted', text: 'Chain' }),
              h('div', { text: sv.faction.chain }),
              h('div', { class: 'small muted', text: 'Time remaining' }),
              h('div', { text: U.dur(war.endsAt - sv.meta.gameTime) })
            )
          ),
          h('div', { class: 'row', style: { marginTop: '10px' } },
            h('button', { class: 'green', text: 'Launch a hit (5 energy)',
              onclick: function () {
                var r = A.warAttack();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast(r.success ? 'Hit! Chain ' + r.chain : 'Failed.', r.success ? 'good' : 'bad');
                C.router.go('faction');
              }
            })
          )
        ]));
      } else {
        var enemies = D.factions.filter(function (x) { return x.id !== f.id; });
        root.appendChild(UI.section('Declare war', [
          h('p', { class: 'small muted', text: 'Wars last ' + C.config.FACTIONS.warDurationHours + ' hours. Score more than the enemy to win.' }),
          UI.table(
            [{ label: 'Faction' }, { label: 'Perk' }, { label: '' }],
            enemies.map(function (x) {
              return {
                cells: [
                  x.name, x.perk,
                  h('button', { class: 'small', text: 'Declare war',
                    onclick: function () {
                      UI.confirm('Declare war on ' + x.name + '?', function () {
                        var r = A.declareWar(x.id);
                        if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                        UI.toast('War declared.', 'bad');
                        C.router.go('faction');
                      });
                    }
                  })
                ]
              };
            })
          )
        ]));
      }

      /* Members list. */
      var members = A.factionMembers();
      root.appendChild(UI.section('Members', [
        UI.table([{ label: 'Name' }, { label: 'Role' }, { label: 'Level', num: true }],
          members.map(function (m) { return { cells: [m.name, m.role, m.level] }; }))
      ]));

      return root;
    }
  };
})(window.CALIGO);
