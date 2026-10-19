window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.properties = {
    render: function () {
      var root = h('div');
      root.appendChild(UI.pageHead('Properties', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));
      var list = [
        ['Shack','$0'],['Trailer','$5,000'],['Apartment','$25,000'],
        ['Semi-Detached House','$75,000'],['Detached House','$300,000'],['Beach House','$500,000'],
        ['Chalet','$750,000'],['Villa','$1,250,000'],['Penthouse','$2,000,000'],
        ['Mansion','$3,000,000'],['Ranch','$15,000,000'],['Palace','$65,000,000'],
        ['Castle','$200,000,000'],['Private Island','$500,000,000']
      ];
      var grid = h('div', { class: 'card-grid' });
      list.forEach(function (p, i) {
        grid.appendChild(UI.tile('⌂', p[0], p[1], function () {
          UI.modal({ title: p[0], body: 'Property purchase arrives in Phase 4.', actions: [{ label: 'OK', primary: true }] });
        }));
      });
      root.appendChild(UI.section('All Properties', [
        h('p', { class: 'small muted', text: 'Properties raise max happiness, provide storage and vault space, and act as a home base.' }),
        grid
      ]));
      return root;
    }
  };
})(window.CALIGO);
