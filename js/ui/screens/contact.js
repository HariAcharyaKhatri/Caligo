/* CALIGO — Support Dispatch & City Help Screen.
   Adapted from Torn's official FAQ and contact center.                  */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var UI = C.ui;
  var S = C.state;

  C.screens = C.screens || {};

  var FAQS = [
    {
      q: 'How can I speak with syndicate staff or report an issue?',
      a: 'You can submit a ticket directly using the Dispatch Support form below. You can also view development updates on the City Forums or contact our staff dispatchers on Discord.'
    },
    {
      q: 'What should I do if my character is locked up in Jail or Hospital?',
      a: 'Jail and hospital stays in Caligo tick down in real-clock seconds. In Jail, you can pay a cash bail if you have enough funds, or wait for your sentence to expire. In Hospital, time will restore your life, or you can purchase medical first-aid kits from the Pharmacy.'
    },
    {
      q: 'Can my character ever be wiped or reset?',
      a: 'No. Caligo follows Torn\'s time-honored "Zero Reset" principle. Every stat you train at the Gym, every property you buy, and every merit you earn is permanently preserved in your save file.'
    },
    {
      q: 'How does the procedural audio system work?',
      a: 'Caligo uses the browser\'s native Web Audio API to synthesize custom chimes, combat blows, coin clinks, and sirens with zero external audio assets. You can toggle audio on/off anytime using the 🔊 button in the top header bar.'
    },
    {
      q: 'What is the fastest way for a new rookie to earn money?',
      a: 'Start with Tier 1 and 2 Crimes (Pickpocketing, Shoplifting) to build Crime Experience and early cash. Claim your daily syndicate take on the Home screen, and once you hit Level 15, travel between international cities to trade foreign luxury goods for high market margins.'
    }
  ];

  C.screens.contact = {
    render: function () {
      var sv = S ? C.state.save : null;
      var p = sv ? sv.player : { name: 'Citizen', id: '1' };
      var root = h('div', { class: 'contact-screen' });

      root.appendChild(UI.pageHead('Central Dispatch & Help Center', [
        { label: 'City Wiki', onClick: function () { C.router.go('wiki'); } },
        { label: 'City Rules', onClick: function () { C.router.go('rules'); } },
        { label: 'Credits', onClick: function () { C.router.go('credits'); } }
      ]));

      var grid = h('div', { class: 'grid two' });

      /* Left: FAQs */
      var faqList = h('div', { class: 'stack' });
      FAQS.forEach(function (faq) {
        var card = h('div', { class: 'card', style: { marginBottom: '10px' } },
          h('div', { class: 'row', style: { gap: '8px', alignItems: 'flex-start' } },
            h('span', { class: 'gold bold', text: 'Q:' }),
            h('h4', { style: { margin: '0 0 6px', color: '#fff' }, text: faq.q })
          ),
          h('p', { class: 'small muted', style: { margin: '0', paddingLeft: '20px', lineHeight: '1.5' }, text: faq.a })
        );
        faqList.appendChild(card);
      });

      grid.appendChild(UI.section('Frequently Asked Questions (FAQ)', [faqList]));

      /* Right: Submit Dispatch Ticket */
      var formBox = h('div', { class: 'card' });
      formBox.appendChild(h('div', { class: 'section-title top-round', text: 'SUBMIT DISPATCH TICKET' }));

      var formBody = h('div', { class: 'cont-gray bottom-round p10' });
      formBody.appendChild(h('p', { class: 'small muted', text: 'Need assistance from the Council or found an exploit? Send an official report directly to our queue.' }));

      var categorySelect = h('select', {
        style: { width: '100%', padding: '8px', marginBottom: '10px', background: 'var(--panel2)', color: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r)' }
      },
        h('option', { value: 'bug', text: '🐛 Bug Report / Exploit' }),
        h('option', { value: 'balance', text: '⚖ Game Balance Feedback' }),
        h('option', { value: 'account', text: '👤 Account / Save Issue' }),
        h('option', { value: 'general', text: '✉ General Inquiry / Help' })
      );
      formBody.appendChild(categorySelect);

      var subjectInput = h('input', {
        type: 'text',
        placeholder: 'Subject line...',
        style: { width: '100%', padding: '8px', marginBottom: '10px', background: 'var(--panel2)', color: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r)' }
      });
      formBody.appendChild(subjectInput);

      var messageArea = h('textarea', {
        placeholder: 'Describe your query or feedback in detail...',
        rows: 5,
        style: { width: '100%', padding: '8px', marginBottom: '12px', background: 'var(--panel2)', color: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r)', fontFamily: 'inherit' }
      });
      formBody.appendChild(messageArea);

      var submitBtn = h('button', {
        class: 'primary',
        style: { width: '100%' },
        text: '📤 Send Dispatch Ticket',
        onclick: function () {
          var sub = subjectInput.value.trim();
          var msg = messageArea.value.trim();
          if (!sub || !msg) {
            UI.toast('Please enter both a subject and message.', 'bad');
            return;
          }

          if (C.audio && C.audio.play) C.audio.play('ding');
          if (C.actions && C.actions.log) {
            C.actions.log('Dispatch Ticket sent: "' + sub + '" [' + categorySelect.value.toUpperCase() + ']', 'info');
          }

          subjectInput.value = '';
          messageArea.value = '';

          UI.modal({
            title: 'Dispatch Ticket Transmitted',
            body: 'Your ticket has been received and logged by Council Dispatch. A response will appear in your City Event Blotter.',
            actions: [{ label: 'Understood', primary: true }]
          });
        }
      });
      formBody.appendChild(submitBtn);

      formBox.appendChild(formBody);

      /* Emergency contacts */
      var contactCard = h('div', { class: 'card', style: { marginTop: '14px' } },
        h('div', { class: 'section-title top-round', text: 'EXTERNAL CONTACTS & CHANNELS' }),
        h('div', { class: 'cont-gray bottom-round' },
          h('p', { class: 'small', text: '• <b>Council Email:</b> <a href="mailto:support@caligo.city">support@caligo.city</a>' }),
          h('p', { class: 'small', text: '• <b>Official Discord:</b> <a href="#" onclick="alert(\'Discord invite link: discord.gg/caligo\'); return false;">discord.gg/caligo</a>' }),
          h('p', { class: 'small muted', text: '• Operational Hours: 24/7 Automated City Processing.' })
        )
      );

      var rightCol = h('div', { class: 'stack' }, formBox, contactCard);
      grid.appendChild(rightCol);

      root.appendChild(grid);
      return root;
    }
  };
})(window.CALIGO);
