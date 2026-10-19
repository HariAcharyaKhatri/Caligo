/* CALIGO — City Rules & Conduct Guidelines Screen.
   Adapted from official Torn game policies, offenses, and punishments.  */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var UI = C.ui;

  C.screens = C.screens || {};

  var activeTab = 'rules';

  var RULES = [
    {
      id: 'rmt',
      icon: '🚫',
      title: 'REAL MONEY TRADING (RMT)',
      penalty: 'DELETION',
      penaltyClass: 'tag-red',
      desc: 'The exchange of in-game currency, weapons, properties, or syndicate assets for real-world money or external services is strictly prohibited. Buyers and sellers will have all illicit assets seized and accounts permanently terminated without warning.'
    },
    {
      id: 'accounts',
      icon: '👥',
      title: 'ACCOUNT TRADING & MULTI-ACCOUNTING',
      penalty: 'PERMANENT BAN',
      penaltyClass: 'tag-red',
      desc: 'Citizens are permitted to control only one Caligo identity. Registering multiple accounts to gain unfair battle stat advantages, warehouse storage, or exploit referral rewards results in immediate termination of all duplicate identities.'
    },
    {
      id: 'sharing',
      icon: '🔑',
      title: 'ACCOUNT SHARING & PROXY PLAY',
      penalty: 'GAME BAN (7-30 DAYS)',
      penaltyClass: 'tag-orange',
      desc: 'All accounts must be operated exclusively by the original creator. Sharing login credentials, setting up proxy clicking routines, or delegating crime cycles to others is strictly forbidden to protect game balance.'
    },
    {
      id: 'bugs',
      icon: '🐛',
      title: 'BUG & EXPLOIT ABUSE',
      penalty: 'RESET / DELETION',
      penaltyClass: 'tag-red',
      desc: 'Unintentional glitches, numerical calculation bugs, or race conditions must be reported to the development team immediately via the Dispatch Support desk. Continuing to abuse an exploit for infinite cash, stats, or items will result in a complete account wipe.'
    },
    {
      id: 'scripting',
      icon: '🤖',
      title: 'SCRIPTING & AUTOMATION ABUSE',
      penalty: 'GAME BAN',
      penaltyClass: 'tag-red',
      desc: 'The use of external bots, automated scrapers, headless browsers, or click macros to bypass energy and nerve timers without human input is strictly prohibited. Caligo is designed for active player strategy.'
    },
    {
      id: 'abetting',
      icon: '🤝',
      title: 'AIDING & ABETTING VIOLATORS',
      penalty: 'SAME AS PRINCIPAL',
      penaltyClass: 'tag-orange',
      desc: 'Laundering dirty funds for known exploiters, transferring stolen market items between dummy accounts, or deliberately shielding rule violators carries equal penal consequences.'
    }
  ];

  var SOCIAL = [
    {
      title: 'Harassment & Cyberbullying',
      desc: 'Targeted persistent malice, stalking, real-world doxxing, or malicious threats toward any player or staff member will result in permanent communication blacklisting.'
    },
    {
      title: 'Hate Speech & Discrimination',
      desc: 'Derogatory slurs or slurs regarding ethnic origin, religion, gender identity, sexual orientation, disability, or real-world political extremism are forbidden in all public forums and faction chats.'
    },
    {
      title: 'Impersonation & Phishing',
      desc: 'Posing as syndicate council staff, developers, or other players to deceive citizens or solicit credentials carries immediate federal custody.'
    },
    {
      title: 'Spamming & Chat Flooding',
      desc: 'Repeatedly flooding city mail, event blotters, or discussion boards with duplicate gibberish, external advertisements, or solicitations will trigger immediate muting.'
    }
  ];

  C.screens.rules = {
    render: function () {
      var root = h('div', { class: 'rules-screen' });

      root.appendChild(UI.pageHead('Caligo Syndicate Code & City Rules', [
        { label: 'City Wiki', onClick: function () { C.router.go('wiki'); } },
        { label: 'Support & Help', onClick: function () { C.router.go('contact'); } }
      ]));

      // Tab switcher
      var nav = h('div', { class: 'row', style: { gap: '8px', marginBottom: '16px' } },
        h('button', {
          class: (activeTab === 'rules' ? 'primary' : '') + ' small',
          text: '⚖ Game Offenses & Penalties',
          onclick: function () { activeTab = 'rules'; C.router.go('rules'); }
        }),
        h('button', {
          class: (activeTab === 'social' ? 'primary' : '') + ' small',
          text: '💬 Social Conduct',
          onclick: function () { activeTab = 'social'; C.router.go('rules'); }
        }),
        h('button', {
          class: (activeTab === 'terms' ? 'primary' : '') + ' small',
          text: '📜 Terms & Fair Play',
          onclick: function () { activeTab = 'terms'; C.router.go('rules'); }
        })
      );
      root.appendChild(nav);

      if (activeTab === 'rules') {
        var card = h('div', { class: 'card' },
          h('div', { class: 'section-title top-round', text: 'CORE GAME OFFENSES & ENFORCEMENT POLICIES' }),
          h('div', { class: 'cont-gray bottom-round' },
            h('p', { class: 'muted small', text: 'To maintain a fair, enduring, and competitive persistent world, the Caligo City Council enforces strict penalties without exception. Every crime attempt, market trade, and combat round is logged with millisecond timestamps.' })
          )
        );
        root.appendChild(card);

        RULES.forEach(function (r) {
          var rCard = h('div', { class: 'card', style: { marginBottom: '12px', borderLeft: '4px solid var(--red)' } },
            h('div', { class: 'row between', style: { marginBottom: '6px' } },
              h('div', { class: 'row', style: { gap: '8px', alignItems: 'center' } },
                h('span', { style: { fontSize: '1.4em' }, text: r.icon }),
                h('h3', { style: { margin: '0', color: '#fff' }, text: r.title })
              ),
              h('span', {
                style: {
                  background: 'var(--red-dark)',
                  color: '#fff',
                  padding: '3px 8px',
                  borderRadius: 'var(--r)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.05em'
                },
                text: r.penalty
              })
            ),
            h('p', { class: 'small muted', style: { margin: '0', lineHeight: '1.5' }, text: r.desc })
          );
          root.appendChild(rCard);
        });
      } else if (activeTab === 'social') {
        var sCard = h('div', { class: 'card' },
          h('div', { class: 'section-title top-round', text: 'CITY SOCIAL GUIDELINES' }),
          h('div', { class: 'cont-gray bottom-round' },
            h('p', { class: 'small', text: 'Caligo is a cutthroat, dark-themed crime simulator, but interactions between real human beings must remain civil, respectful, and safe. Roleplaying crime is encouraged; personal toxicity is not.' })
          )
        );
        root.appendChild(sCard);

        SOCIAL.forEach(function (s) {
          root.appendChild(UI.section(s.title, [
            h('p', { class: 'small muted', text: s.desc })
          ]));
        });
      } else {
        root.appendChild(UI.section('Terms of Service & Virtual Currency Disclosure', [
          h('p', { text: '1. <b>Fictional Currency Notice</b>: All money, cash, bank deposits, loan figures, and items in Caligo are strictly fictional virtual elements intended solely for in-game roleplay and entertainment. They hold zero monetary value in the real world.' }),
          h('p', { text: '2. <b>Fair Play & Persistence</b>: Caligo is designed around the "No Resets" principle. You can build your character over months and years without fear of arbitrary world wipes.' }),
          h('p', { text: '3. <b>Zero Tracking / Local Storage</b>: Caligo stores your progress locally on your browser device. We respect user privacy and do not sell data to any external advertising brokers.' })
        ]));
      }

      return root;
    }
  };
})(window.CALIGO);
