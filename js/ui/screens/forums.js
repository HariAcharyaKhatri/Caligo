window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, UI = C.ui;
  C.screens = C.screens || {};
  C.screens.forums = {
    render: function () {
      var root = h('div');
      root.appendChild(UI.pageHead('Forums', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var cats = [
        ['General Discussion', 27642],
        ['Non-related Forums', 16744],
        ['Questions & Answers', 50572],
        ['Tutorials & Guides', 2343],
        ['Trading Post', 67581],
        ['Fun & Games', 9091],
        ['Achievements', 9786],
        ['Faction Discussion', 5225],
        ['Faction Recruitment', 18983],
        ['Company Discussion', 18759]
      ];
      root.appendChild(UI.section('Forums', [
        UI.table([{ label: 'Board' }, { label: 'Threads', num: true }, { label: 'Last Poster' }],
          cats.map(function (c, i) {
            return {
              cells: [c[0], U_num(c[1]), 'Player' + i],
              onClick: function () { UI.toast('Static board — Phase 4 will add live threads.', 'info'); }
            };
          }))
      ]));
      return root;
    }
  };
  function U_num(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
})(window.CALIGO);
