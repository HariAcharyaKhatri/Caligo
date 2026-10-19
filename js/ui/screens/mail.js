window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.mail = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Mail', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var rows = (sv.mail || []).map(function (m) {
        return {
          cells: [m.from, m.subject, U.dur(m.t) + ' ago', m.read ? '✓' : '●'],
          onClick: function () {
            m.read = true;
            UI.modal({ title: m.subject, body: h('div', null,
              h('p', { class: 'small muted', text: 'From ' + m.from }),
              h('p', { text: m.body })
            ), actions: [{ label: 'Close', primary: true }] });
          }
        };
      });
      if (!rows.length) rows.push({ cells: ['—', 'No mail yet.', '', ''] });

      root.appendChild(UI.section('Inbox', [
        UI.table([{ label: 'From' }, { label: 'Subject' }, { label: 'Received' }, { label: 'Read' }], rows)
      ]));
      return root;
    }
  };
})(window.CALIGO);
