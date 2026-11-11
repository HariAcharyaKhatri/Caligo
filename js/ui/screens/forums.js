/* CALIGO — Interactive Community Forums.
   Features category boards, lore/bot seed threads, persistent player threads & replies. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, UI = C.ui, U = C.util, S = C.state;
  C.screens = C.screens || {};

  var SEED_THREADS = {
    'General Discussion': [
      { id: 'gen_1', author: 'Vane', role: 'Syndicate Boss', avatar: '◈', title: 'State of the Vertical City — Cycle 84', body: 'The Spire pumps are straining under load. If you are operating on Platform 4, watch your back near the air intake shafts.', replies: 14, time: '2h ago' },
      { id: 'gen_2', author: 'Rust_Collector', role: 'Scavenger', avatar: '⚙', title: 'Best spot for scraping electrical copper?', body: 'Foundry alleyways have heavy patrol presence today. Anyone know if the Docks power conduit is unmonitored?', replies: 8, time: '5h ago' }
    ],
    'Questions & Answers': [
      { id: 'qa_1', author: 'Greenhorn', role: 'Petty Thief', avatar: '?', title: 'How does Natural Nerve Bar (NNB) increase?', body: 'Does hidden crime experience automatically raise my max nerve bar, or do I have to complete certain crime tiers first?', replies: 19, time: '1d ago' },
      { id: 'qa_2', author: 'Vektor', role: 'Enforcer', avatar: '▲', title: 'Why buy higher-tier real estate?', body: 'Your happiness capacity directly multiplies gym stat gains. Moving from a Shack to an Apartment or Penthouse speeds up training drastically.', replies: 12, time: '2d ago' }
    ],
    'Tutorials & Guides': [
      { id: 'tut_1', author: 'Overclock', role: 'Netrunner', avatar: '⚡', title: 'Crimes 2.0: Tool Requirements & Enhancers', body: 'Always carry specialist enhancers like Cut-Throat Razor for pickpocketing high-tier targets, and Jemmy/Lockpicks for commercial burglary.', replies: 31, time: '3d ago' },
      { id: 'tut_2', author: 'Ironclad', role: 'Gym Owner', avatar: '■', title: 'Happy Jumps 101: Stacking Booster Caps', body: 'Maximize happiness with high-end properties and candy/ecstasy before burning a 100-energy gym block for explosive battle stat growth.', replies: 45, time: '4d ago' }
    ],
    'Trading Post': [
      { id: 'trade_1', author: 'BlackMarketBob', role: 'Merchant', avatar: '◆', title: 'Buying foreign plushies and rare flowers', body: 'Paying top dollar for imported goods from Tokyo, London, and Zurich. Find me at the Docks Exchange.', replies: 62, time: '1h ago' }
    ],
    'Faction Discussion': [
      { id: 'fac_1', author: 'Warlord', role: 'Faction Leader', avatar: '⚔', title: 'Territory War in the Underbelly Sector 3', body: 'Hostile takeover scheduled for tomorrow. Ensure chained hits are queued and hospital bags are stocked.', replies: 27, time: '4h ago' }
    ]
  };

  var activeCategory = null;

  C.screens.forums = {
    render: function () {
      var sv = S.save;
      sv.forums = sv.forums || [];

      var root = h('div');
      root.appendChild(UI.pageHead('Community Forums', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      if (activeCategory) {
        renderBoard(root, sv, activeCategory);
      } else {
        renderCategories(root, sv);
      }

      return root;
    }
  };

  function renderCategories(root, sv) {
    var cats = [
      ['General Discussion', 27642, 'News, politics, and street gossip across Caligo.'],
      ['Questions & Answers', 50572, 'Ask experienced players about mechanics, builds, and strategies.'],
      ['Tutorials & Guides', 2343, 'Comprehensive walkthroughs on battle stats, crimes, and economy.'],
      ['Trading Post', 67581, 'Buy, sell, and swap weapons, armor, drugs, and collector items.'],
      ['Faction Discussion', 5225, 'Alliance declarations, territory disputes, and war logs.'],
      ['Achievements', 9786, 'Showcase milestones, awards, and merit unlocks.']
    ];

    var rows = cats.map(function (c) {
      var playerThreadsCount = sv.forums.filter(function (t) { return t.category === c[0]; }).length;
      var totalCount = c[1] + playerThreadsCount;
      return {
        cells: [
          h('div', {}, [
            h('strong', { style: { color: 'var(--accent)', cursor: 'pointer' }, text: c[0] }),
            h('div', { class: 'small muted', text: c[2] })
          ]),
          U_num(totalCount),
          playerThreadsCount > 0 ? sv.player.name : 'System'
        ],
        onClick: function () {
          activeCategory = c[0];
          C.router.render();
        }
      };
    });

    root.appendChild(UI.section('Discussion Boards', [
      h('p', { class: 'small muted p-8', style: { margin: 0 }, text: 'Select a board to read recent transmissions, consult guides, or broadcast your own thread to the city.' }),
      UI.table([{ label: 'Board Category' }, { label: 'Dispatches', num: true }, { label: 'Latest Poster' }], rows)
    ]));
  }

  function renderBoard(root, sv, catName) {
    var headWrap = h('div', { class: 'row between', style: { marginBottom: '12px' } }, [
      h('button', {
        class: 'small ghost',
        text: '← Back to Boards',
        onclick: function () {
          activeCategory = null;
          C.router.render();
        }
      }),
      h('button', {
        class: 'small primary',
        text: '+ Post New Thread',
        onclick: function () {
          openNewThreadModal(sv, catName);
        }
      })
    ]);
    root.appendChild(headWrap);

    var seed = SEED_THREADS[catName] || [];
    var custom = sv.forums.filter(function (t) { return t.category === catName; });
    var all = custom.concat(seed);

    var rows = all.map(function (t) {
      var repliesCount = (t.repliesCount !== undefined ? t.repliesCount : (t.replies ? (Array.isArray(t.replies) ? t.replies.length : t.replies) : 0));
      return {
        cells: [
          h('div', {}, [
            h('strong', { style: { color: '#fff', cursor: 'pointer' }, text: t.title }),
            h('div', { class: 'small muted', text: 'by ' + t.author + ' · ' + (t.time || 'recently') })
          ]),
          repliesCount,
          t.author
        ],
        onClick: function () {
          openThreadModal(sv, t);
        }
      };
    });

    root.appendChild(UI.section(catName, [
      UI.table([{ label: 'Thread Subject' }, { label: 'Replies', num: true }, { label: 'Author' }], rows)
    ]));
  }

  function openThreadModal(sv, thread) {
    var body = h('div', { style: { maxHeight: '60vh', overflowY: 'auto' } });

    // OP post
    var opCard = h('div', { class: 'p-12 mb-12', style: { background: 'var(--panel2)', borderRadius: '4px', border: '1px solid var(--line)' } }, [
      h('div', { class: 'row between mb-8' }, [
        h('strong', { style: { color: 'var(--accent)' }, text: thread.author + (thread.role ? ' [' + thread.role + ']' : '') }),
        h('span', { class: 'small muted', text: thread.time || 'just now' })
      ]),
      h('p', { style: { margin: 0, lineHeight: 1.5 }, text: thread.body })
    ]);
    body.appendChild(opCard);

    // Replies list
    var repliesList = h('div', { id: 'thread-replies' });
    var existingReplies = Array.isArray(thread.replies) ? thread.replies : [];
    existingReplies.forEach(function (r) {
      repliesList.appendChild(h('div', { class: 'p-8 mb-8', style: { background: 'rgba(255,255,255,0.03)', borderRadius: '4px', borderLeft: '3px solid var(--line2)' } }, [
        h('div', { class: 'row between small muted mb-4' }, [
          h('strong', { text: r.author }),
          h('span', { text: r.time || 'just now' })
        ]),
        h('div', { style: { fontSize: '0.95em' }, text: r.text })
      ]));
    });
    body.appendChild(repliesList);

    // Reply input form
    var replyInput = h('textarea', { placeholder: 'Write a response to this dispatch...', style: { width: '100%', minHeight: '60px', marginTop: '10px', background: 'var(--bg)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px', padding: '6px' } });
    body.appendChild(replyInput);

    UI.modal({
      title: thread.title,
      body: body,
      actions: [
        { label: 'Close' },
        {
          label: 'Submit Reply',
          primary: true,
          close: false,
          onClick: function () {
            var text = replyInput.value.trim();
            if (!text) {
              UI.toast('Please write a message before posting.', 'bad');
              return;
            }
            thread.replies = Array.isArray(thread.replies) ? thread.replies : [];
            thread.replies.push({
              author: sv.player.name,
              text: text,
              time: 'just now'
            });
            thread.repliesCount = (thread.repliesCount || 0) + 1;
            replyInput.value = '';
            UI.toast('Reply posted.', 'good');
            C.storage.write(sv);
            C.router.render();
          }
        }
      ]
    });
  }

  function openNewThreadModal(sv, catName) {
    var form = h('div');
    var titleIn = h('input', { type: 'text', placeholder: 'Thread Subject / Headline...', style: { width: '100%', marginBottom: '10px', padding: '6px', background: 'var(--bg)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px' } });
    var bodyIn = h('textarea', { placeholder: 'Thread message content...', style: { width: '100%', minHeight: '90px', padding: '6px', background: 'var(--bg)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px' } });

    form.appendChild(h('label', { class: 'small muted', text: 'Thread Headline:' }));
    form.appendChild(titleIn);
    form.appendChild(h('label', { class: 'small muted', text: 'Message Body:' }));
    form.appendChild(bodyIn);

    UI.modal({
      title: 'Broadcast New Thread — ' + catName,
      body: form,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Publish Dispatch',
          primary: true,
          onClick: function () {
            var title = titleIn.value.trim();
            var body = bodyIn.value.trim();
            if (!title || !body) {
              UI.toast('Both headline and message are required.', 'bad');
              return;
            }
            var newThread = {
              id: 'thread_' + Date.now(),
              category: catName,
              title: title,
              body: body,
              author: sv.player.name,
              role: S.crimeLevelName(sv.player.crimeLevel),
              replies: [],
              repliesCount: 0,
              time: 'just now'
            };
            sv.forums.push(newThread);
            C.actions.log('Published forum thread "' + title + '" in ' + catName + '.', 'info');
            C.storage.write(sv);
            UI.toast('Thread published!', 'good');
            C.router.render();
          }
        }
      ]
    });
  }

  function U_num(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
})(window.CALIGO);
