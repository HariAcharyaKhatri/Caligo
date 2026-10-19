window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, UI = C.ui;
  C.screens = C.screens || {};
  C.screens.calendar = {
    render: function () {
      var root = h('div');
      root.appendChild(UI.pageHead('Calendar', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var year = new Date().getFullYear();
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var grid = h('div', { class: 'card-grid' });
      months.forEach(function (m) {
        grid.appendChild(h('div', { class: 'tile', style: { cursor: 'default', alignItems: 'flex-start', textAlign: 'left' } },
          h('div', { class: 'tile-name', text: m }),
          h('div', { class: 'tile-sub', text: 'Events in ' + m + ' are managed by the Council.' })
        ));
      });
      root.appendChild(UI.section(String(year) + ' — Events', [grid]));
      return root;
    }
  };
})(window.CALIGO);
