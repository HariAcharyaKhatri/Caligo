/* CALIGO — City Wiki & Knowledgebase Screen.
   Comprehensive reference manual for combat formulas, crimes, training,
   trade arbitrage, and city syndicate mechanics.                        */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var UI = C.ui;
  var U = C.util;

  C.screens = C.screens || {};

  var activeTab = 'overview';
  var searchQuery = '';

  var ARTICLES = {
    overview: {
      title: 'City Overview & Citizen Basics',
      icon: '🏙',
      sections: [
        {
          title: 'Welcome to Caligo: The Vertical City',
          content: 'Caligo is a gritty, persistent text-based underworld RPG set in a stratified vertical metropolis. As an unknown rookie stepping off the ferry at The Docks, your goal is to amass wealth, train formidable battle power, climb syndicate ranks, and carve your name into the Hall of Fame.'
        },
        {
          title: 'The Four Core Vitals',
          content: 'Every citizen relies on four vital resources that regenerate over real time:',
          list: [
            '<b>Energy (⚡)</b>: Used to train in Gyms and fight citizens or syndicate bots on the street. Caps at 100+ (scales with player level). Regenerates 5 units every 5 minutes.',
            '<b>Nerve (☠)</b>: Fuel for criminal operations. Caps start at 18 and grow via player leveling and secret Hidden Nerve milestones. Regenerates 1 unit every 5 minutes.',
            '<b>Happy (★)</b>: Multiplies gym training stat gains and provides a modest bonus to crime success. Boosted by luxury housing, candy, and leisure. Decays smoothly toward your property habitat cap.',
            '<b>Life (✚)</b>: Your combat hit points. Determines survival in gunfights, brawls, and muggings. Regenerates continuously unless hospitalized.'
          ]
        },
        {
          title: 'Custody: Jail and Hospital',
          content: 'Failing crimes can alert council enforcers, landing you in <b>City Jail</b> for real-time minutes. Sustaining critical crime injuries or losing street fights lands you in a <b>Clinic/Hospital</b> bed. Both prevent training, crimes, and street combat until time expires or bail/treatment is acquired.'
        }
      ]
    },
    combat: {
      title: 'Combat Mechanics & Battle Formulas',
      icon: '⚔',
      sections: [
        {
          title: 'The Four Battle Stats',
          content: 'Combat in Caligo is governed by four interdependent battle attributes:',
          table: [
            ['Stat', 'Combat Role', 'Formula Influence'],
            ['Strength', 'Damage Output', 'Multiplies raw outgoing kinetic damage in playerAttack'],
            ['Defense', 'Damage Mitigation', 'Reduces incoming damage via soft curve: dmg = raw * (1 - Def / (Def + 120))'],
            ['Speed', 'Accuracy & Turn Speed', 'Raises hit chance and evades enemy counter-strikes'],
            ['Dexterity', 'Stealth & Evasion', 'Increases dodge probability and disarm success chance']
          ]
        },
        {
          title: 'Damage Calculation',
          content: 'Damage is calculated dynamically each round using the attacker\'s weapon, battle strength, defender\'s armor rating, and current defense soften values. Power moves deal +35% damage with a slight accuracy penalty, while Aimed strikes maximize hit probability against agile targets.'
        },
        {
          title: 'Post-Fight Choices',
          content: 'When you knock out a rival bot or player, you decide their fate:',
          list: [
            '<b>Leave (Respect)</b>: Walk away cleanly. Generates Syndicate Respect, awards maximum experience, and grants +5 Happiness.',
            '<b>Mug (Cash)</b>: Seize a share (up to 12%) of the target\'s pocket cash. Generates +1 Wanted star and awards moderate XP.',
            '<b>Hospitalise</b>: Leave the target incapacitated in a critical clinic ward for 30–90 real minutes. Generates +2 Wanted stars and +8 XP.'
          ]
        }
      ]
    },
    crimes: {
      title: 'Crimes & Underworld Operations',
      icon: '☠',
      sections: [
        {
          title: 'Crime Tiers & Progression',
          content: 'Crimes are organized into five escalating tiers ranging from petty street theft (Pickpocketing, Shoplifting) to high-stakes syndicate heists (Bank Robbery, Vault Infiltration, Supercar Hijack). Higher tiers require greater Nerve and higher Crime Experience (CE).'
        },
        {
          title: 'Success Probability Formula',
          content: 'Success probability is mathematically assembled and clamped between 5% and 95%:',
          list: [
            '<b>Base Chance</b>: Native difficulty rating of the target crime (e.g., 85% for pickpocketing, 28% for bank robbery).',
            '<b>Dexterity + Speed Bonus</b>: Diminishing exponential curve up to +25% bonus points: <code>25 * (1 - exp(-(Dex+Spd)/800))</code>.',
            '<b>Crime Level Multiplier</b>: +1.5% chance per level above the crime requirement, up to +15% cap.',
            '<b>Happiness Impact</b>: High happiness adds up to +10%, while depressed morale penalizes success.',
            '<b>Wanted Level Penalty</b>: Council heat deducts up to -30% chance. Keep wanted stars low by resting.',
            '<b>Specialized Tools</b>: Carrying burglary lockpicks, burner laptops, or skimming tools adds up to +20% success.'
          ]
        },
        {
          title: 'Hidden Nerve Progression',
          content: 'Committing crimes grants invisible Crime Experience points. At secret exponential thresholds (base 25, exponent 1.9), your maximum Nerve bar permanently expands by +5, unlocking larger operation sprees.'
        }
      ]
    },
    gyms: {
      title: 'Gymnasiums & Training Science',
      icon: '⚡',
      sections: [
        {
          title: 'Gym Tiers',
          content: 'Caligo houses five official training facilities: The Rustworks Pit (Entry free), Apex Iron Gym, Velvet Lounge Gym, Spire High Performance Center, and The Underground Foundry. Higher gyms offer up to 2.4x stat gains per energy spent.'
        },
        {
          title: 'The Happiness Multiplier ("Happy Jumps")',
          content: 'Your gym stat gain formula scales directly with current Happiness: <code>gain = base * gymMult * trainerBonus * (0.5 + Happy/200) * (1 / (1 + currentStat / 15000))</code>. Boosting happiness above 100 using candy or luxury estates doubles your stat growth rate!'
        },
        {
          title: 'Specialized Trainers',
          content: 'Hire specialized coaches (Heavy Bag Coach, Conditioning Specialist, Olympic Drillmaster) to add up to +20% bonus gains for modest training fees.'
        }
      ]
    },
    economy: {
      title: 'Economy, Banking & Trade Arbitrage',
      icon: '$',
      sections: [
        {
          title: 'City Vault & Fixed-Term Deposits',
          content: 'Protect your liquid cash from street mugs by depositing into the <b>Caligo Municipal Vault</b>. For long-term wealth building, lock funds into Fixed Deposits for 7, 14, 30, or 60 days to yield guaranteed returns between 1.2% and 8.5%.'
        },
        {
          title: 'Loan Sharks & Credit',
          content: 'Need fast liquidity for property or arms? Three loan tiers (Quick Loan, Syndicate Credit, Apex High Rollers) lend up to $500,000 at daily interest rates. Unpaid debts increase council wanted status.'
        },
        {
          title: 'Travel & International Smuggling',
          content: 'Fly between 5 platforms and 8 foreign destinations (Tokyo, London, Zurich, Cayman Islands, Dubai, Hawaii, Johannesburg, Singapore). Buy regional delicacies, electronics, and rare artifacts abroad, then resell them in Caligo\'s Item Market for lucrative profit margins.'
        }
      ]
    },
    syndicates: {
      title: 'Jobs, Education & Factions',
      icon: '✦',
      sections: [
        {
          title: 'Careers & Work Stats',
          content: 'Advance through six career paths (Medical, Law, Security, Casino, Tech, Syndicate) requiring Manual Labor (MAN), Intelligence (INT), and Endurance (END). Careers grant daily wages and passive perks like medical treatment discounts.'
        },
        {
          title: 'Higher Education',
          content: 'Enroll in courses at Caligo Central Academy across Combat, Commerce, Law, and Science. Courses run over real-time hours and permanently augment your character with merit points, critical strike chance, and banking rates.'
        },
        {
          title: 'Factions & Territory Wars',
          content: 'Join or lead a syndicate faction. Coordinate organized crime, participate in territory turf wars across the vertical sectors, build chain attack multipliers, and access shared faction armoury supplies.'
        }
      ]
    }
  };

  C.screens.wiki = {
    render: function () {
      var root = h('div', { class: 'wiki-screen' });

      root.appendChild(UI.pageHead('Caligo Knowledgebase & City Wiki', [
        { label: 'City Rules', onClick: function () { C.router.go('rules'); } },
        { label: 'Credits & Staff', onClick: function () { C.router.go('credits'); } },
        { label: 'Dispatch Support', onClick: function () { C.router.go('contact'); } }
      ]));

      // Search bar
      var searchInput = h('input', {
        type: 'search',
        placeholder: 'Search topics, formulas, combat stats, crimes...',
        value: searchQuery,
        style: {
          width: '100%',
          padding: '10px 14px',
          background: 'var(--panel2)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r)',
          color: '#fff',
          fontSize: '14px',
          marginBottom: '16px'
        },
        oninput: function (e) {
          searchQuery = e.target.value.toLowerCase().trim();
          renderContent();
        }
      });
      root.appendChild(searchInput);

      // Tabs
      var tabNav = h('div', { class: 'row', style: { gap: '6px', marginBottom: '16px', flexWrap: 'wrap' } });
      var tabKeys = Object.keys(ARTICLES);
      tabKeys.forEach(function (key) {
        var art = ARTICLES[key];
        var btn = h('button', {
          class: (activeTab === key ? 'primary' : '') + ' small',
          text: art.icon + ' ' + art.title.split('&')[0].trim(),
          onclick: function () {
            activeTab = key;
            searchQuery = '';
            searchInput.value = '';
            renderTabs();
            renderContent();
          }
        });
        btn.dataset.tab = key;
        tabNav.appendChild(btn);
      });
      root.appendChild(tabNav);

      function renderTabs() {
        C.dom.qsa('[data-tab]', tabNav).forEach(function (b) {
          if (b.dataset.tab === activeTab) b.classList.add('primary');
          else b.classList.remove('primary');
        });
      }

      var contentBox = h('div', { id: 'wiki-content' });
      root.appendChild(contentBox);

      function renderContent() {
        C.dom.clear(contentBox);
        var art = ARTICLES[activeTab];
        if (!art) return;

        var headerCard = h('div', { class: 'card', style: { marginBottom: '16px', borderLeft: '4px solid var(--red)' } },
          h('div', { class: 'row between' },
            h('h2', { style: { margin: '0' }, text: art.icon + ' ' + art.title }),
            h('span', { class: 'tag', text: 'VERIFIED ARCHIVE' })
          )
        );
        contentBox.appendChild(headerCard);

        var visibleCount = 0;
        art.sections.forEach(function (sec) {
          if (searchQuery) {
            var matchTitle = sec.title.toLowerCase().indexOf(searchQuery) !== -1;
            var matchContent = (sec.content || '').toLowerCase().indexOf(searchQuery) !== -1;
            if (!matchTitle && !matchContent) return;
          }
          visibleCount++;

          var bodyChildren = [];
          if (sec.content) {
            bodyChildren.push(h('p', { innerHTML: sec.content }));
          }

          if (sec.list) {
            var ul = h('ul', { style: { paddingLeft: '20px', lineHeight: '1.6' } });
            sec.list.forEach(function (liText) {
              ul.appendChild(h('li', { innerHTML: liText }));
            });
            bodyChildren.push(ul);
          }

          if (sec.table) {
            var rows = sec.table.slice(1).map(function (r) {
              return { cells: r };
            });
            var headers = sec.table[0].map(function (c) {
              return { label: c };
            });
            bodyChildren.push(UI.table(headers, rows));
          }

          contentBox.appendChild(UI.section(sec.title, bodyChildren));
        });

        if (visibleCount === 0) {
          contentBox.appendChild(h('div', { class: 'empty-box' },
            h('div', { class: 'empty-icon', text: '🔍' }),
            h('div', { class: 'empty-text', text: 'No articles matching "' + searchQuery + '" in this section.' })
          ));
        }
      }

      renderContent();
      return root;
    }
  };
})(window.CALIGO);
