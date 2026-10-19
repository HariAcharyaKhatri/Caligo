window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.recruit = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Recruit Citizens', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var code = Math.floor(100000 + Math.random() * 899999);
      var link = 'https://www.caligo.local/' + code;

      root.appendChild(UI.section('Invite your friends', [
        h('p', { class: 'small muted', text: 'Share your referral link. Every 10 levels a player you brought earns gives you points.' }),
        h('div', { class: 'card tight', style: { marginTop: '6px' } },
          h('input', { type: 'text', value: link, readonly: true, onclick: function (e) { e.target.select(); } })
        ),
        h('div', { class: 'row', style: { marginTop: '8px' } },
          h('button', { class: 'small', text: 'Copy link', onclick: function () {
            try { navigator.clipboard.writeText(link); UI.toast('Copied.', 'good'); }
            catch (e) { UI.toast('Copy failed.', 'bad'); }
          }})
        )
      ]));

      root.appendChild(UI.section('Players you have referred', [
        UI.table([{ label: 'Player' }, { label: 'Level', num: true }, { label: 'Last online' }, { label: 'Signed up' }, { label: 'Completion' }],
          [{ cells: ['(none yet)', '—', '—', '—', '0%'] }])
      ]));

      root.appendChild(UI.section('Rewards', [
        h('p', { class: 'small', text: 'For every 10 levels a referred player earns: 250 points, 31 days of donor status, 2 special items.' })
      ]));

      return root;
    }
  };
})(window.CALIGO);
