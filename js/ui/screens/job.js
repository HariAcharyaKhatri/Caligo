window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.job = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Job', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var job = S.currentJob(sv);

      if (job) {
        var rank = S.jobRank(sv);
        root.appendChild(UI.section('Job Information',
          [h('div', { class: 'grid two' },
            h('div', null,
              h('div', { class: 'small muted', text: 'Employer' }),
              h('div', { text: job.name }),
              h('div', { class: 'small muted', text: 'Rank' }),
              h('div', { text: rank.title })
            ),
            h('div', null,
              h('div', { class: 'small muted', text: 'Pay per shift' }),
              h('div', { class: 'gold', text: U.money(rank.pay) }),
              h('div', { class: 'small muted', text: 'Accrued pay' }),
              h('div', { class: 'gold', text: U.money(sv.job.payAccrued) })
            )
          ),
          h('div', { class: 'small muted', style: { marginTop: '8px' } },
            'Work stats — Manual: ' + Math.floor(sv.player.work.manual) +
            ' · Intelligence: ' + Math.floor(sv.player.work.intelligence) +
            ' · Endurance: ' + Math.floor(sv.player.work.endurance)),
          h('div', { class: 'row', style: { marginTop: '10px' } },
            h('button', { class: 'green', text: 'Work a shift (' + C.config.JOBS.energyPerShift + ' energy)',
              onclick: function () {
                var r = A.workShift();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Shift done. ' + U.money(r.pay) + ' accrued.' + (r.promoted ? ' PROMOTED!' : ''), 'money');
                C.router.go('job');
              }
            }),
            h('button', { class: 'blue', text: 'Collect pay',
              onclick: function () {
                var r = A.collectPay();
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Collected ' + U.money(r.amount), 'money');
                C.router.go('job');
              }
            }),
            h('button', { text: 'Quit job',
              onclick: function () {
                UI.confirm('Quit this job?', function () {
                  A.quitJob();
                  C.router.go('job');
                });
              }
            })
          )
        ]));

        /* Rank progression table. */
        root.appendChild(UI.section('Rank & Benefits',
          [UI.table(
            [{ label: 'Rank' }, { label: 'Income', num: true }, { label: 'Manual', num: true }, { label: 'Intelligence', num: true }, { label: 'Endurance', num: true }],
            job.ranks.map(function (r, i) {
              return {
                cells: [
                  r.title + (i === sv.job.rank ? ' ◄' : ''),
                  U.money(r.pay),
                  r.req.manual || 0,
                  r.req.intelligence || 0,
                  r.req.endurance || 0
                ]
              };
            })
          )]
        ));
      } else {
        root.appendChild(UI.section('Available jobs', [
          h('p', { class: 'small muted', text: 'Apply to any job you meet the requirements for. You must quit your current job to change.' }),
          UI.table(
            [{ label: 'Job' }, { label: 'Entry rank' }, { label: 'Pay', num: true }, { label: 'Req' }, { label: '' }],
            D.jobs.map(function (j) {
              var entry = j.ranks[0];
              var req = entry.req;
              var reqText = [];
              if (req.manual) reqText.push('Manual ' + req.manual);
              if (req.intelligence) reqText.push('Int ' + req.intelligence);
              if (req.endurance) reqText.push('End ' + req.endurance);
              return {
                cells: [
                  h('span', null,
                    h('div', { text: j.name }),
                    h('div', { class: 'small muted', text: j.blurb + ' — ' + j.perk })
                  ),
                  entry.title,
                  U.money(entry.pay),
                  reqText.join(', ') || '—',
                  h('button', { class: 'small green', text: 'Apply', onclick: function () {
                    var r = A.applyForJob(j.id);
                    if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                    UI.toast('Hired at ' + j.name, 'good');
                    C.router.go('job');
                  }})
                ]
              };
            })
          )
        ]));
      }

      return root;
    }
  };
})(window.CALIGO);
