/* CALIGO — Home Dashboard & Character Dossier Screen. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};

  var TOP_FEATURES = [
    { id: 'crimes', icon: '☠', title: 'Crimes 2.0', desc: 'Over 50 staged crimes across 5 tiers with realistic target attributes and risk factors.', screen: 'crimes' },
    { id: 'gym', icon: '⚡', title: 'Gyms & Battle Stats', desc: 'Train Defense, Dexterity, Speed, and Strength across stratified facilities.', screen: 'gym' },
    { id: 'combat', icon: '⚔', title: 'Street Combat', desc: 'Fight rival bots, build attack chains, and choose to mug or hospitalize them.', screen: 'combat' },
    { id: 'travel', icon: '✈', title: 'International Travel', desc: 'Fly to 8 foreign cities to buy exclusive goods and execute trade arbitrage.', screen: 'travel' },
    { id: 'market', icon: '⇄', title: 'Item Market', desc: 'Buy and sell items, drugs, and munitions on a player-driven open exchange.', screen: 'market' },
    { id: 'bank', icon: '$', title: 'Municipal Vault Bank', desc: 'Store cash securely, open fixed-term investment accounts, or take loans.', screen: 'bank' },
    { id: 'casino', icon: '🎰', title: 'The Casino', desc: 'Try your luck at Slots, Roulette, Craps, Blackjack, High-Low, and Keno.', screen: 'casino' },
    { id: 'armoury', icon: '🛡', title: 'Weapons & Armoury', desc: 'Equip melee blades, firearms, combat vests, and specialized attachments.', screen: 'armoury' },
    { id: 'shops', icon: '🛍', title: 'City Shops & Malls', desc: 'Visit pharmaceutical clinics, pawn shops, and weapons dealers across sectors.', screen: 'shops' },
    { id: 'jobs', icon: '💼', title: 'Careers & Work Stats', desc: 'Work across Medical, Law, Security, Casino, and Syndicate enterprise roles.', screen: 'job' },
    { id: 'education', icon: '✎', title: 'Central Academy', desc: 'Take courses in Combat, Law, and Commerce to unlock permanent character perks.', screen: 'education' },
    { id: 'factions', icon: '✦', title: 'Factions & Gang Wars', desc: 'Band together in syndicates, launch coordinated wars, and capture territory.', screen: 'faction' },
    { id: 'territories', icon: '▧', title: 'Territory Control', desc: 'Fight for control of valuable sectors across the vertical city platforms.', screen: 'territory' },
    { id: 'companies', icon: '◈', title: 'Company Management', desc: 'Found and manage business corporations, hire citizens, and collect revenues.', screen: 'companies' },
    { id: 'properties', icon: '🏠', title: 'Housing & Properties', desc: 'Upgrade from docks trailers to luxury penthouses and spire mansions.', screen: 'properties' },
    { id: 'hospital', icon: '✚', title: 'Clinic & Hospital', desc: 'Recover from critical fight wounds, use medical items, or inspect casualties.', screen: 'hospital' },
    { id: 'jail', icon: '⚿', title: 'City Jail', desc: 'Serve council detention time, pay bail bonds, or bust fellow syndicate mates.', screen: 'jail' },
    { id: 'missions', icon: '◎', title: 'Underworld Contracts', desc: 'Accept contracts from anonymous fixers for special rewards and mission points.', screen: 'missions' },
    { id: 'newspaper', icon: '❐', title: 'Caligo Gazette', desc: 'Read city crime blotters, economy reports, and syndicated classified ads.', screen: 'newspaper' },
    { id: 'forums', icon: '☰', title: 'Discussion Boards', desc: 'Discuss faction strategies, market trading tips, and underworld rumors.', screen: 'forums' },
    { id: 'halloffame', icon: '♛', title: 'Hall of Fame', desc: 'Rankings of the wealthiest, strongest, and most notorious syndicate bosses.', screen: 'halloffame' },
    { id: 'bounties', icon: '⌖', title: 'Bounty Board', desc: 'Place bounties on street enemies or hunt down wanted targets for payouts.', screen: 'lists' },
    { id: 'drugs', icon: '🧪', title: 'Enhancers & Narcotics', desc: 'Consume tactical enhancers and pharmaceuticals for rapid energy bursts.', screen: 'inventory' },
    { id: 'wiki', icon: '📖', title: 'City Knowledgebase', desc: 'Complete Torn-style wiki detailing combat formulas, crime tables, and stats.', screen: 'wiki' }
  ];

  C.screens.home = {
    render: function () {
      var sv = S === null ? null : C.state.save;
      var p = sv.player;
      var root = h('div');

      root.appendChild(UI.pageHead('Character Dossier & Dashboard', [
        { label: 'Wiki', onClick: function () { C.router.go('wiki'); } },
        { label: 'Rules', onClick: function () { C.router.go('rules'); } },
        { label: 'Leaderboards', onClick: function () { C.router.go('halloffame'); } },
        { label: 'City Blotter', onClick: function () { C.router.go('events'); } },
        { label: 'Help', onClick: function () { C.router.go('contact'); } }
      ]));

      /* Users Online Live Counter (Torn Style) */
      root.appendChild(renderUsersOnline());

      var platform = D.platforms[sv.player.location] || D.platforms.docks;
      var wx = C.engine.weather ? C.engine.weather(sv) : { label: 'Clear' };

      /* Quick Action Bar */
      var quickBar = h('div', { class: 'row', style: { marginBottom: '14px', gap: '8px' } },
        h('button', { class: 'primary small', text: '☠ Commit Crimes', onclick: function () { C.router.go('crimes'); } }),
        h('button', { class: 'green small', text: '⚡ Train Gym', onclick: function () { C.router.go('gym'); } }),
        h('button', { class: 'primary small', text: '⚔ Street Combat', onclick: function () { C.router.go('combat'); } }),
        h('button', { class: 'gold small', text: '🎰 The Casino', onclick: function () { C.router.go('casino'); } }),
        h('button', { class: 'blue small', text: '$ Vault Bank', onclick: function () { C.router.go('bank'); } }),
        h('button', { class: 'small', text: '🛍 Item Market', onclick: function () { C.router.go('market'); } })
      );
      root.appendChild(quickBar);

      var grid = h('div', { class: 'grid two' });

      /* Left: general info. */
      grid.appendChild(UI.section('Citizen Dossier', [
        UI.table([{ label: 'Metric' }, { label: 'Record', num: true }], [
          { cells: ['Street Alias', p.name + ' [ID: ' + (p.id || '94021') + ']'] },
          { cells: ['Liquid Cash', '<span class="p-money">' + U.money(p.cash) + '</span>'] },
          { cells: ['Level & Rank', 'Level ' + p.level + ' (' + rankLabel(p.level) + ')'] },
          { cells: ['Net Worth', '<span class="gold bold">' + U.money(S.netWorth(sv)) + '</span>'] },
          { cells: ['Career / Job', S.currentJob(sv) ? S.currentJob(sv).name + ' (' + (S.jobRank(sv) ? S.jobRank(sv).title : '—') + ')' : 'Unemployed'] },
          { cells: ['Faction Affiliation', S.faction(sv) ? S.faction(sv).name + ' [' + sv.faction.role + ']' : 'Unaffiliated Rogue'] },
          { cells: ['Current Sector', platform.name] },
          { cells: ['Atmosphere', wx.label + ' • ' + D.timeOfDay(new Date()).label] }
        ])
      ]));

      /* Right: Property & Daily Streak */
      var rightCol = h('div', { class: 'stack' });

      var propCard = h('div', { class: 'card', style: { marginBottom: '0' } },
        h('div', { class: 'section-title top-round', text: 'Property & Residence' }),
        h('div', { class: 'cont-gray bottom-round' },
          h('p', { class: 'small', text: 'Current Habitat: <b style="color:#fff">Trailer near The Docks</b>' }),
          h('p', { class: 'small muted', text: 'Rent a luxury penthouse or spire mansion to boost daily happiness and stats.' }),
          h('button', { class: 'small', text: 'Manage Properties', onclick: function () { C.router.go('properties'); } })
        )
      );
      rightCol.appendChild(propCard);

      var dailyBox = h('div');
      var dailyCard = h('div', { class: 'card', style: { marginBottom: '0' } },
        h('div', { class: 'section-title top-round', text: 'Daily Syndicate Take' }),
        h('div', { class: 'cont-gray bottom-round' }, dailyBox)
      );
      rightCol.appendChild(dailyCard);
      renderDaily(dailyBox);

      grid.appendChild(rightCol);
      root.appendChild(grid);

      /* Vitals Highlight Cards */
      var vitals = h('div', { class: 'grid four', style: { margin: '14px 0' } });
      [
        ['Energy', '#2ecc71', 'energy', '⚡'],
        ['Nerve', '#ff4757', 'nerve', '☠'],
        ['Happy', '#ffa502', 'happy', '★'],
        ['Life', '#1e90ff', 'life', '✚']
      ].forEach(function (v) {
        vitals.appendChild(h('div', { class: 'card tight', style: { borderLeft: '3px solid ' + v[1] } },
          h('div', { class: 'row between' },
            h('span', { class: 'small muted', text: v[0].toUpperCase() }),
            h('span', { style: { color: v[1] }, text: v[3] })
          ),
          h('div', { style: { fontSize: '1.25em', fontWeight: '700', color: v[1], fontFamily: 'monospace', marginTop: '4px' } }, barText(v[2]))
        ));
      });
      root.appendChild(vitals);

      /* Top Features Showcase Gallery */
      root.appendChild(renderTopFeatures());

      /* Activity Feed */
      root.appendChild(UI.section('Recent Intelligence & Event Blotter', [UI.logPanel(sv, 8)]));

      /* Offline catch-up report modal */
      if (C.engine.offlineReport) {
        var rep = C.engine.offlineReport;
        C.engine.offlineReport = null;
        window.setTimeout(function () { showAway(rep); }, 80);
      }
      return root;
    }
  };

  function renderUsersOnline() {
    var card = h('div', { class: 'users-online-card' });
    card.appendChild(h('div', { class: 'section-title top-round', text: 'SYNDICATE NETWORK & CITIZENS ONLINE' }));

    var content = h('div', { class: 'users-online-content' });

    function makeDigitRow(num) {
      var row = h('div', { class: 'digits-row' });
      var str = num.toLocaleString('en-US');
      for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (ch === ',') {
          row.appendChild(h('span', { class: 'digit-tile comma', text: ',' }));
        } else {
          row.appendChild(h('span', { class: 'digit-tile', text: ch }));
        }
      }
      return row;
    }

    var jitter = Math.floor(Math.sin(Date.now() / 4000) * 18);
    var nowCount = 14980 + jitter;
    var hourCount = 35570 + Math.floor(jitter * 1.5);
    var dayCount = 113760 + Math.floor(jitter * 2);

    content.appendChild(h('div', { class: 'users-counter-col' },
      h('div', { class: 'counter-title-label', text: 'Online Now' }),
      makeDigitRow(nowCount)
    ));
    content.appendChild(h('div', { class: 'users-counter-col' },
      h('div', { class: 'counter-title-label', text: 'Last Hour' }),
      makeDigitRow(hourCount)
    ));
    content.appendChild(h('div', { class: 'users-counter-col' },
      h('div', { class: 'counter-title-label', text: 'Last 24 Hours' }),
      makeDigitRow(dayCount)
    ));

    card.appendChild(content);
    return card;
  }

  function renderTopFeatures() {
    var card = h('div', { class: 'top-features-card' });
    card.appendChild(h('div', { class: 'section-title top-round', text: 'TOP CITY FEATURES & UNDERWORLD OPERATIONS (24 SYSTEMS)' }));

    var activeCat = 'all';
    var featureTabs = [
      { id: 'all', label: 'All Operations', count: 24 },
      { id: 'combat', label: 'Combat & Crimes', icon: '⚔' },
      { id: 'economy', label: 'Economy & Wealth', icon: '$' },
      { id: 'syndicate', label: 'Syndicates & Empire', icon: '✦' },
      { id: 'city', label: 'City Intel & Public', icon: '◉' }
    ];

    var featureCategories = {
      crimes: 'combat', gym: 'combat', combat: 'combat', armoury: 'combat', bounties: 'combat', drugs: 'combat',
      travel: 'economy', market: 'economy', bank: 'economy', casino: 'economy', shops: 'economy', properties: 'economy',
      factions: 'syndicate', territories: 'syndicate', companies: 'syndicate', missions: 'syndicate', jobs: 'syndicate', education: 'syndicate',
      hospital: 'city', jail: 'city', newspaper: 'city', forums: 'city', halloffame: 'city', wiki: 'city'
    };

    var grid = h('div', { class: 'features-grid' });

    function renderFilteredFeatures() {
      C.dom.clear(grid);
      TOP_FEATURES.forEach(function (f) {
        var cat = featureCategories[f.id] || 'city';
        if (activeCat !== 'all' && cat !== activeCat) return;

        var fCard = h('div', {
          class: 'feature-card',
          style: { cursor: f.screen ? 'pointer' : 'default' },
          onclick: function () {
            if (f.screen) C.router.go(f.screen);
          }
        },
          h('div', { class: 'feature-icon-bubble', text: f.icon }),
          h('div', { class: 'feature-body' },
            h('div', { class: 'feature-title-row' },
              h('span', { class: 'feature-title', text: f.title }),
              f.screen ? h('span', { class: 'tag', text: 'ENTER' }) : null
            ),
            h('p', { class: 'feature-desc', text: f.desc })
          )
        );
        grid.appendChild(fCard);
      });
    }

    var tabBar = UI.tabBar(featureTabs, activeCat, function (catId) {
      activeCat = catId;
      renderFilteredFeatures();
    });

    card.appendChild(h('div', { style: { padding: '8px 12px 0 12px' } }, tabBar));
    renderFilteredFeatures();
    card.appendChild(grid);
    return card;
  }

  function rankLabel(level) {
    if (level < 3) return 'Rookie';
    if (level < 7) return 'Street Thug';
    if (level < 15) return 'Enforcer';
    if (level < 25) return 'Lieutenant';
    if (level < 40) return 'Underboss';
    return 'Syndicate Boss';
  }

  function barText(kind) {
    var p = C.state.save.player;
    switch (kind) {
      case 'energy': return Math.floor(p.energy) + ' / ' + S.maxEnergy(p);
      case 'nerve':  return Math.floor(p.nerve) + ' / ' + S.maxNerve(p);
      case 'happy':  return Math.floor(p.happiness) + ' / ' + S.maxHappiness(p);
      case 'life':   return Math.floor(p.life) + ' / ' + S.maxLife(p);
    }
    return '';
  }

  function renderDaily(box) {
    var st = A.dailyStatus();
    if (st.ready) {
      box.appendChild(h('div', { class: 'stack' },
        h('div', { class: 'small gold bold', text: '★ Streak: ' + st.streak + ' Days Active' }),
        h('button', {
          class: 'green',
          style: { width: '100%' },
          text: '🎁 Claim Daily Take (' + U.money(2500 + st.streak * 500) + ')',
          onclick: function () {
            var r = A.claimDaily();
            if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
            if (C.audio) C.audio.play('cash');
            UI.toast('Claimed daily take: ' + U.money(r.cash), 'money');
            C.router.go('home');
          }
        })
      ));
    } else {
      var left = h('div', { class: 'small muted' });
      box.appendChild(h('div', { class: 'stack' },
        h('div', { class: 'small bold', text: 'Streak: ' + st.streak + ' Days Active' }),
        left
      ));
      function upd() {
        var s2 = A.dailyStatus();
        C.dom.setText(left, 'Next daily stipend ready in ' + U.dur(s2.left));
      }
      upd();
      C.engine.live(upd);
    }
  }

  function showAway(rep) {
    if (rep.awayReal < 60) return;
    var body = h('div');
    body.appendChild(h('p', { class: 'muted', text: U.pick(D.awayLines) }));
    body.appendChild(h('p', { text: 'You were away from Caligo for ' + U.dur(rep.appliedReal) + '.' }));
    var list = h('div', { class: 'row', style: { gap: '6px' } });
    var g = rep.gained || {};
    if (g.energy) list.appendChild(UI.pill('+' + g.energy + ' Energy', 'good'));
    if (g.nerve) list.appendChild(UI.pill('+' + g.nerve + ' Nerve', 'good'));
    if (g.life) list.appendChild(UI.pill('+' + g.life + ' Life', 'good'));
    body.appendChild(list);
    UI.modal({ title: 'While You Were Away Report', body: body, actions: [{ label: 'Back to Streets', primary: true }] });
  }
})(window.CALIGO);
