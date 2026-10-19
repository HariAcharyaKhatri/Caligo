/* CALIGO — City Hub Screen with Torn-style Interactive Districts & Tabs. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.city = {
    render: function () {
      var sv = C.state.save;
      var p = sv.player;
      var root = h('div');

      root.appendChild(UI.pageHead('Vertical City Districts', [
        { label: 'City Map Intel', onClick: function () {
          UI.modal({
            title: 'Vertical City Architecture',
            body: 'Caligo is structured into 5 vertical tiers stacked above the sea. Higher tiers offer wealth, prestigious jobs and luxury banks; lower tiers offer black markets, illicit fight rings and lucrative crime networks.',
            actions: [{ label: 'Understood', primary: true }]
          });
        }}
      ]));

      /* Current District Banner */
      var currPlatformId = p.location || 'docks';
      var plat = D.platforms[currPlatformId] || D.platforms.docks;
      var wx = C.engine.weather ? C.engine.weather(sv) : { label: 'Clear' };

      var districtCard = h('div', { class: 'card', style: {
        background: 'linear-gradient(135deg, rgba(37,40,45,0.95) 0%, rgba(20,22,25,0.95) 100%)',
        borderLeft: '4px solid var(--gold)',
        marginBottom: '14px'
      }},
        h('div', { class: 'row between', style: { marginBottom: '8px' } },
          h('div', null,
            h('span', { class: 'pill gold', text: 'Current Sector' }),
            h('h2', { style: { margin: '4px 0 2px', color: '#fff' }, text: plat.name }),
            h('div', { class: 'small muted', text: plat.blurb })
          ),
          h('div', { style: { textAlign: 'right' } },
            h('span', { class: 'pill blue', text: 'Weather: ' + wx.label }),
            h('div', { style: { marginTop: '6px' } },
              h('button', { class: 'small primary', text: '✈ Platform Transit', onclick: function () { C.router.go('travel'); } })
            )
          )
        )
      );
      root.appendChild(districtCard);

      /* Categorized Location Tabs */
      var activeTab = 'all';
      var gridContainer = h('div');

      var allLocations = [
        { id: 'crimes',       name: 'Crimes Board',      sub: 'Work illegal jobs & street scams', icon: '☠', cat: 'underworld' },
        { id: 'gym',          name: 'The Gym',           sub: 'Train battle stats & hire coaches', icon: '⚡', cat: 'civilian' },
        { id: 'combat',       name: 'Combat Arena',      sub: 'Challenge bots & live fighters',   icon: '⚔', cat: 'underworld' },
        { id: 'casino',       name: 'The Casino',        sub: 'Slots, roulette, dice & cards',   icon: '🎰', cat: 'underworld' },
        { id: 'bank',         name: 'Central Bank',      sub: 'Safe deposits, notes & loans',     icon: '$',  cat: 'finance' },
        { id: 'market',       name: 'Item Market',       sub: 'Autonomous player & bot listings', icon: '⇄',  cat: 'finance' },
        { id: 'armoury',      name: 'Armoury',           sub: 'Harrow & Sons arms dealer',        icon: '🛡', cat: 'finance' },
        { id: 'shops',        name: 'District Shops',    sub: 'Platform vendors & supplies',      icon: '🛍', cat: 'finance' },
        { id: 'inventory',    name: 'Inventory',         sub: 'Equipment, backpacks & drugs',     icon: '▣',  cat: 'civilian' },
        { id: 'job',          name: 'Employment',        sub: 'Career ladders & salaries',        icon: '💼', cat: 'civilian' },
        { id: 'education',    name: 'City Academy',      sub: 'Courses & stat perks',             icon: '✎',  cat: 'civilian' },
        { id: 'hospital',     name: 'Clinic Ward',       sub: 'Medical fast-track & revives',     icon: '✚',  cat: 'civilian' },
        { id: 'jail',         name: 'Holding Cells',     sub: 'Post bail or bust inmates out',   icon: '⚿',  cat: 'civilian' },
        { id: 'properties',   name: 'Properties',        sub: 'Rent trailers, lofts & spires',   icon: '🏠', cat: 'civilian' },
        { id: 'travel',       name: 'Transit Terminal',  sub: 'Ferries & foreign flights',       icon: '✈',  cat: 'civilian' },
        { id: 'faction',      name: 'Faction Gangs',     sub: 'Syndicates, territory wars & vaults', icon: '✦', cat: 'syndicate' },
        { id: 'territory',    name: 'Territories',       sub: 'Control platforms & earn cuts',    icon: '▧',  cat: 'syndicate' },
        { id: 'companies',    name: 'Companies',         sub: 'Start or manage businesses',       icon: '◈',  cat: 'syndicate' },
        { id: 'missions',     name: 'Contracts',         sub: 'Duke\'s hits & daily targets',     icon: '◎',  cat: 'underworld' },
        { id: 'newspaper',    name: 'Caligo Times',      sub: 'Breaking news & market prices',   icon: '❐',  cat: 'community' },
        { id: 'forums',       name: 'City Forums',       sub: 'Underground chatter & boards',     icon: '☰',  cat: 'community' },
        { id: 'halloffame',   name: 'Hall of Fame',      sub: 'City rankings & top syndicates',   icon: '♛',  cat: 'community' },
        { id: 'calendar',     name: 'Event Calendar',    sub: 'Seasonal events & tournaments',    icon: '▦',  cat: 'community' }
      ];

      function renderGrid() {
        C.dom.clear(gridContainer);
        var grid = h('div', { class: 'card-grid' });
        var filtered = allLocations.filter(function (loc) {
          if (activeTab === 'all') return true;
          return loc.cat === activeTab;
        });

        filtered.forEach(function (loc) {
          grid.appendChild(UI.tile(loc.icon, loc.name, loc.sub, function () {
            if (C.audio) C.audio.play('click');
            C.router.go(loc.id);
          }));
        });
        gridContainer.appendChild(grid);
      }

      var tabs = [
        { id: 'all',        label: 'All Locations' },
        { id: 'underworld', label: '☠ Underworld' },
        { id: 'finance',    label: '$ Financial' },
        { id: 'civilian',   label: '🏙 Civilian' },
        { id: 'syndicate',  label: '✦ Syndicate' },
        { id: 'community',  label: '📰 Community' }
      ];

      var tabStrip = UI.tabs(tabs, 'all', function (tabId) {
        activeTab = tabId;
        renderGrid();
      });

      root.appendChild(tabStrip);
      root.appendChild(gridContainer);
      renderGrid();

      return root;
    }
  };
})(window.CALIGO);
