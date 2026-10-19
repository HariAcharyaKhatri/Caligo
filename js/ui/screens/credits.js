/* CALIGO — Credits & Developer Hall Screen.
   Adapted from Torn's official credits and contributor rosters.        */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var UI = C.ui;

  C.screens = C.screens || {};

  var STAFF = [
    { name: 'Joe Chedburn', role: 'Game Founder & Original Visionary', period: '2004 – Present', icon: '👑', desc: 'Conceived the original text-based crime RPG genre and established the 20-year persistent sandbox world.' },
    { name: 'Pavlo Bondarenko', role: 'Lead Core Systems Architect', period: '2009 – Present', icon: '💻', desc: 'Engineered high-frequency crime loops, battle engine mathematics, and persistent economy balances.' },
    { name: 'Alex Davies', role: 'Principal Infrastructure Engineer', period: '2006 – Present', icon: '⚡', desc: 'Built the real-time simulation backbone, tick schedulers, and zero-reset database architecture.' },
    { name: 'Catherine Isayenko', role: 'Lead Gameplay Developer', period: '2017 – Present', icon: '⚔', desc: 'Engineered Crimes 2.0, advanced weapon attachments, special munitions, and territory war mechanics.' },
    { name: 'Julie McDougall', role: 'Staff Director & Player Operations', period: '2018 – Present', icon: '🛡', desc: 'Oversees community moderation, game balance integrity, and fair play enforcement.' },
    { name: 'Joshua L', role: 'Community & Event Lead', period: '2018 – Present', icon: '📣', desc: 'Curates community challenges, international tournament brackets, and city announcements.' },
    { name: 'Caligo Engineering Team', role: 'Vertical City Systems & Audio FX', period: '2025 – Present', icon: '◈', desc: 'Procedural Web Audio API soundscape, responsive UI system, simulated bot population, and vertical platform districts.' }
  ];

  C.screens.credits = {
    render: function () {
      var root = h('div', { class: 'credits-screen' });

      root.appendChild(UI.pageHead('Caligo & Torn Hall of Credits', [
        { label: 'City Wiki', onClick: function () { C.router.go('wiki'); } },
        { label: 'City Rules', onClick: function () { C.router.go('rules'); } },
        { label: 'Dispatch Support', onClick: function () { C.router.go('contact'); } }
      ]));

      var intro = h('div', { class: 'card', style: { marginBottom: '16px', background: 'linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(20,20,20,0.8) 100%)' } },
        h('div', { class: 'section-title top-round', text: 'ACKNOWLEDGEMENTS & TRIBUTE' }),
        h('div', { class: 'cont-gray bottom-round' },
          h('p', { text: 'Caligo stands on the shoulders of giants. We pay deep homage to <b>Torn City</b> (created by Joe Chedburn in 2004), the pioneering text-based browser MMORPG that captivated millions for over two decades. Caligo adapts this spirit into a futuristic vertical metropolis powered by modern procedural Web Audio and lightweight reactive interfaces.' }),
          h('p', { class: 'small muted', text: 'Special thanks to all alpha testers, developers, writers, and community coordinators who keep the text RPG spirit burning brightly.' })
        )
      );
      root.appendChild(intro);

      var grid = h('div', { class: 'grid two' });
      STAFF.forEach(function (s) {
        var card = h('div', { class: 'card', style: { marginBottom: '12px' } },
          h('div', { class: 'row', style: { gap: '12px', alignItems: 'center', marginBottom: '8px' } },
            h('div', {
              style: {
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--panel3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                border: '1px solid var(--line2)'
              },
              text: s.icon
            }),
            h('div',
              h('div', { style: { fontWeight: '700', fontSize: '1.1em', color: '#fff' }, text: s.name }),
              h('div', { class: 'small gold', text: s.role }),
              h('div', { class: 'small dim', text: s.period })
            )
          ),
          h('p', { class: 'small muted', style: { margin: '0', lineHeight: '1.45' }, text: s.desc })
        );
        grid.appendChild(card);
      });
      root.appendChild(grid);

      var footerCard = h('div', { class: 'card', style: { marginTop: '16px', textAlign: 'center' } },
        h('div', { class: 'cont-gray border-round p10' },
          h('div', { class: 'bold gold', text: 'CALIGO — RISE IN THE VERTICAL CITY' }),
          h('div', { class: 'small dim', text: 'Running on Pure Vanilla JavaScript & Web Audio API Engine · No Resets Guaranteed' })
        )
      );
      root.appendChild(footerCard);

      return root;
    }
  };
})(window.CALIGO);
