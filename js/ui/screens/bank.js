/* CALIGO — Central Bank: savings, deposits, loans. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var S = C.state;
  var UI = C.ui;
  var A = C.actions;
  var U = C.util;

  C.screens = C.screens || {};

  C.screens.bank = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('Bank', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      var cashEl = h('span', { class: 'pill gold' });
      var bankEl = h('span', { class: 'pill blue' });
      root.appendChild(h('div', { class: 'row between', style: { marginBottom: '12px' } },
        h('span', { class: 'small muted', text: 'Central financial repository' }),
        h('div', { class: 'row' }, cashEl, bankEl)
      ));

      function live(s) {
        C.dom.setText(cashEl, 'Cash ' + U.money(s.player.cash));
        C.dom.setText(bankEl, 'Bank ' + U.money(s.player.bank));
      }
      live(sv);
      C.engine.live(live);

      /* ---- BANK SERVICE TABS ---- */
      var activeTab = 'account';
      var tabsContainer = h('div', { style: { marginBottom: '14px' } });
      var contentContainer = h('div', { class: 'bank-content-wrap' });

      var bankTabs = [
        { id: 'account', label: 'Checking & Savings' },
        { id: 'deposits', label: 'Fixed Deposits', count: sv.bank.deposits.length || null },
        { id: 'loans', label: 'Syndicate Loans', count: sv.bank.loans.length || null }
      ];

      /* ---- 1. ACCOUNT SECTION ---- */
      var amtInput = h('input', { type: 'number', min: '1', placeholder: 'Amount', value: '' });
      var accountCard = UI.card('Account',
        'Banked money is safe from muggings. Cash in your pocket is not.',
        h('div', { class: 'stack' },
          h('label', { text: 'Amount' }),
          amtInput,
          h('div', { class: 'row' },
            h('button', { class: 'primary small', text: 'Deposit',
              onclick: function () {
                var amt = Number(amtInput.value);
                var r = A.deposit(amt);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Deposited ' + U.money(amt), 'money');
                C.router.go('bank');
              }
            }),
            h('button', { class: 'small', text: 'Withdraw',
              onclick: function () {
                var amt = Number(amtInput.value);
                var r = A.withdraw(amt);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Withdrew ' + U.money(amt), 'money');
                C.router.go('bank');
              }
            }),
            h('button', { class: 'small ghost', text: 'All',
              onclick: function () {
                amtInput.value = String(sv.player.cash);
              }
            })
          ),
          h('button', { class: 'small ghost', text: 'Collect savings interest',
            onclick: function () {
              var r = A.collectSavingsInterest();
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              UI.toast('Interest: ' + U.money(r.interest), 'money');
              C.router.go('bank');
            }
          })
        )
      );

      /* ---- 2. FIXED TERM DEPOSITS ---- */
      var depBody = h('div');
      C.config.BANK.deposits.forEach(function (d) {
        var input = h('input', { type: 'number', min: '1000', placeholder: 'Amount', value: String(d.principal || '') });
        depBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
          h('div', null,
            h('div', { text: d.label }),
            h('div', { class: 'small muted', text: Math.round(d.rate * 100) + '% return after ' + d.days + ' days' })
          ),
          h('div', { class: 'row' },
            input,
            h('button', { class: 'small', text: 'Lock',
              onclick: function () {
                var amt = Number(input.value);
                var r = A.buyDeposit(d.id, amt);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Note opened.', 'money');
                C.router.go('bank');
              }
            })
          )
        ));
      });

      /* Show any open deposits and their maturities. */
      if (sv.bank.deposits.length) {
        depBody.appendChild(h('hr', { class: 'sep' }));
        depBody.appendChild(h('div', { class: 'small muted', text: 'Open notes' }));
        sv.bank.deposits.forEach(function (dep, i) {
          var mature = dep.maturesAt <= sv.meta.gameTime;
          var text = mature ? 'mature — collect now'
                            : 'matures in ' + U.dur(dep.maturesAt - sv.meta.gameTime);
          depBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '6px' } },
            h('div', null,
              h('div', { text: dep.label + ' — ' + U.money(dep.principal) }),
              h('div', { class: 'small muted', text: text })
            ),
            h('button', { class: 'small' + (mature ? ' primary' : ''), text: mature ? 'Collect' : 'Locked',
              disabled: !mature,
              onclick: function () {
                var r = A.collectDeposit(i);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Collected ' + U.money(r.payout), 'money');
                C.router.go('bank');
              }
            })
          ));
        });
      }
      var depositsCard = UI.card('Fixed-term notes', 'Lock money for a fixed return.', depBody);

      /* ---- 3. LOANS ---- */
      var loanBody = h('div');
      C.config.BANK.loans.forEach(function (l) {
        var already = sv.bank.loans.some(function (x) { return x.id === l.id; });
        loanBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '8px' } },
          h('div', null,
            h('div', { text: l.label }),
            h('div', { class: 'small muted', text:
              U.money(l.amount) + ' now, ' + U.money(Math.round(l.amount * (1 + l.rate))) +
              ' due in ' + l.days + ' days' })
          ),
          h('button', {
            class: 'small', text: already ? 'Active' : 'Take',
            disabled: already,
            onclick: function () {
              UI.confirm('Take a ' + l.label + ' of ' + U.money(l.amount) + '? You will owe ' +
                U.money(Math.round(l.amount * (1 + l.rate))) + ' by ' + l.days + ' days from now.',
                function () {
                  var r = A.takeLoan(l.id);
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  UI.toast('Loan approved.', 'money');
                  C.router.go('bank');
                });
            }
          })
        ));
      });

      if (sv.bank.loans.length) {
        loanBody.appendChild(h('hr', { class: 'sep' }));
        loanBody.appendChild(h('div', { class: 'small muted', text: 'Your loans' }));
        sv.bank.loans.forEach(function (loan, i) {
          var overdue = loan.dueAt <= sv.meta.gameTime;
          loanBody.appendChild(h('div', { class: 'row between', style: { marginBottom: '6px' } },
            h('div', null,
              h('div', { text: loan.label + ' — ' + U.money(loan.owed) }),
              h('div', { class: 'small ' + (overdue ? 'bad' : 'muted'),
                text: overdue ? 'overdue — collectors are looking' : 'due in ' + U.dur(loan.dueAt - sv.meta.gameTime) })
            ),
            h('button', { class: 'small primary', text: 'Repay',
              disabled: sv.player.cash < loan.owed,
              onclick: function () {
                var r = A.repayLoan(i);
                if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                UI.toast('Loan cleared.', 'good');
                C.router.go('bank');
              }
            })
          ));
        });
      }
      var loansCard = UI.card('Loans', 'Cash now, interest later, collectors if you forget.', loanBody);

      function renderBankView() {
        C.dom.clear(contentContainer);
        if (activeTab === 'account') {
          contentContainer.appendChild(accountCard);
        } else if (activeTab === 'deposits') {
          contentContainer.appendChild(depositsCard);
        } else if (activeTab === 'loans') {
          contentContainer.appendChild(loansCard);
        }
      }

      tabsContainer.appendChild(UI.tabBar(bankTabs, activeTab, function (tId) {
        activeTab = tId;
        renderBankView();
      }));

      renderBankView();
      root.appendChild(tabsContainer);
      root.appendChild(contentContainer);

      return root;
    }
  };
})(window.CALIGO);
