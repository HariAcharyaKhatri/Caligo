window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions;
  C.screens = C.screens || {};
  ['friends','enemies','targets'].forEach(function (kind) {
    C.screens[kind] = {
      render: function () {
        var sv = C.state.save;
        var root = h('div');
        var title = kind.charAt(0).toUpperCase() + kind.slice(1);
        root.appendChild(UI.pageHead(title + ' List', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

        root.appendChild(UI.section(title + ' List', [
          h('p', { class: 'small muted', text: listBlurb(kind) }),
          UI.table([{ label: 'Name' }, { label: 'Level', num: true }, { label: 'Description' }, { label: 'Status' }],
            (sv.lists[kind] || []).map(function (entry) {
              return { cells: [entry.name, entry.level, entry.note || '—', entry.status || 'Okay'] };
            }).concat([{ cells: [{ html: '<span class="dim small">Nobody added yet.</span>' }, '', '', ''] }]))
        ]));

        /* Add bots from the current roster. */
        var pool = sv.bots.slice(0, 8);
        var rows = pool.map(function (b) {
          var already = (sv.lists[kind] || []).some(function (x) { return x.id === b.id; });
          return {
            cells: [
              b.name, b.level, b.occupation,
              h('button', { class: 'small', text: already ? 'Added' : 'Add', disabled: already,
                onclick: function () {
                  sv.lists[kind] = sv.lists[kind] || [];
                  sv.lists[kind].push({ id: b.id, name: b.name, level: b.level, note: b.occupation, status: 'Okay' });
                  UI.toast('Added to ' + kind, 'good');
                  C.router.go(kind);
                }
              })
            ]
          };
        });
        if (rows.length) {
          root.appendChild(UI.section('Add from the city', [
            UI.table([{ label: 'Name' }, { label: 'Level', num: true }, { label: 'Occupation' }, { label: '' }], rows)
          ]));
        }
        return root;
      }
    };
  });

  function listBlurb(kind) {
    if (kind === 'friends') return 'People you can trust. Profiles one click away.';
    if (kind === 'enemies') return 'People to keep an eye on. Enemies cannot buy your market goods.';
    return 'People you plan to attack in the future.';
  }
})(window.CALIGO);
