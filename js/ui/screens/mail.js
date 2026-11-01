window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, U = C.util, A = C.actions;
  C.screens = C.screens || {};
  C.screens.mail = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Mail & Syndicate Communications', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      var activeTab = 'inbox';
      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var contentContainer = h('div', { class: 'mail-content-wrap' });

      var unreadCount = (sv.mail || []).filter(function (m) { return !m.read; }).length;
      var mailTabs = [
        { id: 'inbox', label: 'Inbox', count: unreadCount > 0 ? unreadCount : (sv.mail ? sv.mail.length : 0) },
        { id: 'compose', label: 'Compose Message' }
      ];

      /* ---- INBOX VIEW WITH PAGINATION ---- */
      var inboxBox = h('div');
      var currentPage = 1;
      var pageSize = 8;

      function renderInbox() {
        C.dom.clear(inboxBox);
        var mailList = sv.mail || [];

        if (!mailList.length) {
          inboxBox.appendChild(UI.emptyState('✉', 'Your Inbox is Empty', 'No syndicate communications or city telegrams received yet.'));
          return;
        }

        var totalPages = Math.ceil(mailList.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startIdx = (currentPage - 1) * pageSize;
        var paged = mailList.slice(startIdx, startIdx + pageSize);

        var rows = paged.map(function (m) {
          return {
            cells: [
              h('span', { style: { fontWeight: m.read ? 'normal' : 'bold', color: m.read ? 'var(--text)' : '#fff' }, text: m.from }),
              h('span', { style: { fontWeight: m.read ? 'normal' : 'bold' }, text: m.subject }),
              U.dur(m.t) + ' ago',
              h('span', { class: m.read ? 'dim' : 'gold bold', text: m.read ? '✓ Read' : '● New' })
            ],
            onClick: function () {
              m.read = true;
              UI.modal({
                title: m.subject,
                body: h('div', null,
                  h('p', { class: 'small muted', text: 'Sender: ' + m.from + ' · ' + U.dur(m.t) + ' ago' }),
                  h('div', { style: { padding: '12px', background: 'var(--panel2)', borderRadius: '4px', margin: '10px 0' }, text: m.body })
                ),
                actions: [{ label: 'Close', primary: true, onClick: function () { C.router.render(); } }]
              });
            }
          };
        });

        inboxBox.appendChild(UI.table([{ label: 'From' }, { label: 'Subject' }, { label: 'Received' }, { label: 'Status' }], rows));

        var pag = UI.pagination(currentPage, totalPages, function (p) {
          currentPage = p;
          renderInbox();
        });
        if (pag) inboxBox.appendChild(pag);
      }
      renderInbox();

      /* ---- COMPOSE VIEW ---- */
      var recipientInput = h('input', { type: 'text', placeholder: 'Citizen Alias or Bot Name (e.g. Sora Toledo)', style: { width: '100%' } });
      var subjectInput = h('input', { type: 'text', placeholder: 'Subject line…', style: { width: '100%' } });
      var bodyInput = h('textarea', { rows: '4', placeholder: 'Type your secure encoded message here…', style: { width: '100%', resize: 'vertical' } });

      var composeCard = UI.card('Compose New Telegram', 'Send direct messages to fellow syndicate operatives and citizen bots.',
        h('div', { class: 'stack' },
          h('label', { text: 'To Citizen' }), recipientInput,
          h('label', { text: 'Subject' }), subjectInput,
          h('label', { text: 'Message Body' }), bodyInput,
          h('button', {
            class: 'primary small',
            text: 'Send Telegram ($25 Transmission Fee)',
            onclick: function () {
              var to = recipientInput.value.trim();
              var sub = subjectInput.value.trim();
              var msg = bodyInput.value.trim();
              if (!to || !sub || !msg) {
                UI.toast('Please fill in recipient, subject, and message.', 'bad');
                return;
              }
              if (sv.player.cash < 25) {
                UI.toast('Not enough cash for wire transmission fee.', 'bad');
                return;
              }
              sv.player.cash -= 25;
              UI.toast('Telegram successfully dispatched to ' + to + '!', 'good');
              recipientInput.value = '';
              subjectInput.value = '';
              bodyInput.value = '';
              activeTab = 'inbox';
              C.router.render();
            }
          })
        )
      );

      function renderMailView() {
        C.dom.clear(contentContainer);
        if (activeTab === 'inbox') {
          contentContainer.appendChild(UI.section('Citizen Inbox', [inboxBox]));
        } else {
          contentContainer.appendChild(composeCard);
        }
      }

      tabsContainer.appendChild(UI.tabBar(mailTabs, activeTab, function (tId) {
        activeTab = tId;
        renderMailView();
      }));

      renderMailView();
      root.appendChild(tabsContainer);
      root.appendChild(contentContainer);
      return root;
    }
  };
})(window.CALIGO);
