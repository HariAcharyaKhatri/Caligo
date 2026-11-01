window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util;
  C.screens = C.screens || {};
  C.screens.events = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('City Intelligence & Events Blotter', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var activeFilter = 'all';
      var currentPage = 1;
      var pageSize = 10;

      var filterTabs = [
        { id: 'all', label: 'All Activity', count: sv.events ? sv.events.length : 0 },
        { id: 'combat', label: 'Combat & Duels' },
        { id: 'crime', label: 'Underworld Crime' },
        { id: 'economy', label: 'Market & Vault' }
      ];

      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var tableContainer = h('div', { class: 'events-table-wrap' });

      function renderEventsList() {
        C.dom.clear(tableContainer);
        var allEvents = sv.events || [];

        var filtered = allEvents.filter(function (e) {
          if (activeFilter === 'all') return true;
          var text = ((e.title || '') + ' ' + (e.text || '')).toLowerCase();
          if (activeFilter === 'combat') {
            return text.indexOf('fight') !== -1 || text.indexOf('combat') !== -1 || text.indexOf('attack') !== -1 || text.indexOf('hospital') !== -1;
          }
          if (activeFilter === 'crime') {
            return text.indexOf('crime') !== -1 || text.indexOf('jail') !== -1 || text.indexOf('arrest') !== -1 || text.indexOf('nerve') !== -1;
          }
          if (activeFilter === 'economy') {
            return text.indexOf('cash') !== -1 || text.indexOf('bank') !== -1 || text.indexOf('market') !== -1 || text.indexOf('bought') !== -1 || text.indexOf('sold') !== -1;
          }
          return true;
        });

        if (!filtered.length) {
          tableContainer.appendChild(UI.emptyState('📜', 'City Blotter Clear', 'No event logs match the selected filter.'));
          return;
        }

        var totalPages = Math.ceil(filtered.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * pageSize;
        var paged = filtered.slice(startIdx, startIdx + pageSize);

        var rows = paged.map(function (e) {
          return {
            cells: [
              h('span', { style: { fontWeight: 'bold' }, text: e.title || 'Event' }),
              e.text || '—',
              h('span', { class: 'small muted', text: U.dur(e.t) + ' ago' })
            ]
          };
        });

        tableContainer.appendChild(UI.table([{ label: 'Category' }, { label: 'Intelligence Detail' }, { label: 'Timestamp' }], rows));

        var pag = UI.pagination(currentPage, totalPages, function (p) {
          currentPage = p;
          renderEventsList();
        });
        if (pag) tableContainer.appendChild(pag);
      }

      tabsContainer.appendChild(UI.tabBar(filterTabs, activeFilter, function (fId) {
        activeFilter = fId;
        currentPage = 1;
        renderEventsList();
      }));

      renderEventsList();
      root.appendChild(tabsContainer);
      root.appendChild(UI.section('Recent Intelligence Log', [tableContainer]));

      return root;
    }
  };
})(window.CALIGO);
