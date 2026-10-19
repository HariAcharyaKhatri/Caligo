window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.events = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Events', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var rows = (sv.events || []).map(function (e) {
        return { cells: [e.title, e.text, U.dur(e.t) + ' ago'] };
      });
      if (!rows.length) rows.push({ cells: ['Nothing yet', 'The city has been quiet.', ''] });

      root.appendChild(UI.section('Recent events', [
        UI.table([{ label: 'Event' }, { label: 'Detail' }, { label: 'When' }], rows)
      ]));
      return root;
    }
  };
})(window.CALIGO);
