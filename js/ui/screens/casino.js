/* CALIGO — Interactive Casino with Animated Slots, Dice & Roulette. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.casino = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');

      root.appendChild(UI.pageHead('The Gold Spire Casino', [
        { label: 'City', onClick: function () { C.router.go('city'); } }
      ]));

      /* Wallet & Tokens Bar */
      var cashDisplay = h('div', { class: 'p-money', style: { fontSize: '1.2em' }, text: U.money(sv.player.cash) });
      var tokensDisplay = h('div', { class: 'gold', style: { fontSize: '1.2em', fontWeight: '700' }, text: String(sv.casino.tokens) });
      var netDisplay = h('div', { class: (sv.casino.netWon >= 0 ? 'good' : 'bad'), style: { fontSize: '1.2em', fontWeight: '700' }, text: (sv.casino.netWon >= 0 ? '+' : '') + U.money(sv.casino.netWon) });

      var walletCard = h('div', { class: 'card', style: { marginBottom: '14px' } },
        h('div', { class: 'grid three' },
          h('div', { class: 'center' },
            h('div', { class: 'small muted', text: 'Cash Balance' }),
            cashDisplay
          ),
          h('div', { class: 'center' },
            h('div', { class: 'small muted', text: 'Casino Tokens' }),
            tokensDisplay
          ),
          h('div', { class: 'center' },
            h('div', { class: 'small muted', text: 'All-Time Profit' }),
            netDisplay
          )
        ),
        h('div', { class: 'row center', style: { marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px' } },
          h('button', {
            class: 'green',
            text: '🎁 Claim Daily Tokens (+50)',
            onclick: function () {
              var r = A.claimCasinoTokens();
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
              if (C.audio) C.audio.play('cash');
              UI.toast('+' + r.amount + ' casino tokens claimed!', 'money');
              C.router.go('casino');
            }
          })
        )
      );
      root.appendChild(walletCard);

      /* Bet Controls */
      var betInput = h('input', { type: 'number', value: '500', min: '100', style: { width: '130px', textAlign: 'center', fontWeight: '700' } });

      function setBet(amount) {
        var val = Math.max(100, Math.min(sv.player.cash, Math.floor(amount)));
        betInput.value = String(val);
      }

      var betControlRow = h('div', { class: 'row center', style: { marginBottom: '16px', gap: '6px' } },
        h('label', { style: { margin: 0, alignSelf: 'center', fontWeight: '700' }, text: 'Wager:' }),
        betInput,
        h('button', { class: 'xs', text: '$100', onclick: function () { setBet(100); } }),
        h('button', { class: 'xs', text: '$500', onclick: function () { setBet(500); } }),
        h('button', { class: 'xs', text: '$2,500', onclick: function () { setBet(2500); } }),
        h('button', { class: 'xs', text: '$10,000', onclick: function () { setBet(10000); } }),
        h('button', { class: 'xs', text: '½ Half', onclick: function () { setBet((Number(betInput.value) || 500) / 2); } }),
        h('button', { class: 'xs', text: '2× Double', onclick: function () { setBet((Number(betInput.value) || 500) * 2); } }),
        h('button', { class: 'xs gold', text: 'Max', onclick: function () { setBet(sv.player.cash); } })
      );
      root.appendChild(betControlRow);

      /* Casino Navigation Tabs */
      var activeCasinoTab = 'slots';
      var casinoTabsBar = h('div', { style: { marginBottom: '14px' } });
      var casinoContentWrap = h('div', { class: 'casino-content-wrap' });

      var casinoTabs = [
        { id: 'slots', label: 'High-Roller Slots', icon: '🎰' },
        { id: 'tables', label: 'Casino Table Games', icon: '🎲', count: D.casinoGames.length - 1 },
        { id: 'overview', label: 'Wallet & Daily Tokens', icon: '🎁' }
      ];

      /* ---- FEATURED GAME: LUCKY SLOTS ---- */
      var slotSymbols = ['🍒', '🍋', '🔔', '💎', '7️⃣', '🎰'];
      var reel1 = h('div', { class: 'slot-reel', text: '7️⃣' });
      var reel2 = h('div', { class: 'slot-reel', text: '7️⃣' });
      var reel3 = h('div', { class: 'slot-reel', text: '7️⃣' });
      var spinResultMsg = h('div', { style: { minHeight: '22px', marginTop: '8px', fontWeight: '700' }, text: 'Pull the lever to spin!' });

      var spinBtn = h('button', {
        class: 'primary',
        style: { padding: '8px 24px', fontSize: '1.05em' },
        text: '🎰 PULL LEVER (SPIN)',
        onclick: function () {
          var bet = Number(betInput.value) || 0;
          if (bet <= 0 || sv.player.cash < bet) {
            UI.toast('Not enough cash for that bet.', 'bad');
            return;
          }

          spinBtn.disabled = true;
          if (C.audio) C.audio.play('spin');

          // Spin animation
          var ticks = 0;
          var interval = setInterval(function () {
            reel1.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            reel2.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            reel3.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            if (C.audio && ticks % 2 === 0) C.audio.play('click');
            ticks++;

            if (ticks > 12) {
              clearInterval(interval);
              spinBtn.disabled = false;

              var r = A.playCasino('slots', bet);
              if (!r.ok) {
                UI.toast(r.reason, 'bad');
                return;
              }

              // Determine final symbols based on outcome
              if (r.profit > 0) {
                var sym = (r.payout >= bet * 5) ? '7️⃣' : (r.payout >= bet * 3 ? '💎' : '🍒');
                reel1.textContent = sym;
                reel2.textContent = sym;
                reel3.textContent = sym;
                spinResultMsg.className = 'good';
                spinResultMsg.textContent = 'JACKPOT! +' + U.money(r.profit);
                if (C.audio) C.audio.play('cash');
              } else {
                reel1.textContent = slotSymbols[Math.floor(Math.random() * 3)];
                reel2.textContent = slotSymbols[3 + Math.floor(Math.random() * 3)];
                reel3.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                spinResultMsg.className = 'bad';
                spinResultMsg.textContent = 'No match. -' + U.money(bet);
                if (C.audio) C.audio.play('loss');
              }

              cashDisplay.textContent = U.money(sv.player.cash);
              netDisplay.textContent = (sv.casino.netWon >= 0 ? '+' : '') + U.money(sv.casino.netWon);
              netDisplay.className = sv.casino.netWon >= 0 ? 'good' : 'bad';
            }
          }, 80);
        }
      });

      var slotsCard = h('div', { class: 'slot-machine-box' },
        h('h2', { style: { color: 'var(--gold)', margin: 0, letterSpacing: '0.08em' }, text: '★ CALIGO HIGH-ROLLER SLOTS ★' }),
        h('div', { class: 'small muted', text: 'Match 3 symbols to win up to 25× your wager!' }),
        h('div', { class: 'slot-reels-row' }, reel1, reel2, reel3),
        spinBtn,
        spinResultMsg
      );

      /* ---- ALL CASINO GAMES GRID ---- */
      var gamesGrid = h('div', { class: 'card-grid' });
      D.casinoGames.forEach(function (g) {
        if (g.id === 'slots') return; // already featured
        gamesGrid.appendChild(h('div', { class: 'tile', style: { textAlign: 'left', alignItems: 'flex-start' } },
          h('div', { class: 'row between', style: { width: '100%' } },
            h('div', { class: 'tile-icon', text: g.icon }),
            h('span', { class: 'pill', text: (g.edge * 100).toFixed(1) + '% house' })
          ),
          h('div', { class: 'tile-name', text: g.name }),
          h('div', { class: 'tile-sub', text: g.blurb }),
          h('button', {
            class: 'small green',
            style: { marginTop: '8px', width: '100%' },
            text: 'Wager Selected Bet',
            onclick: function () {
              var bet = Number(betInput.value) || 0;
              var r = A.playCasino(g.id, bet);
              if (!r.ok) { UI.toast(r.reason, 'bad'); return; }

              if (r.profit >= 0) {
                if (C.audio) C.audio.play('cash');
              } else {
                if (C.audio) C.audio.play('loss');
              }

              UI.modal({
                title: g.name + ' Result',
                body: h('div', null,
                  h('p', { style: { fontSize: '1.05em' }, text: r.detail }),
                  h('p', { class: (r.profit >= 0 ? 'good bold' : 'bad bold'),
                    text: 'Bet: ' + U.money(bet) + ' · Payout: ' + U.money(r.payout) + ' · Net: ' + (r.profit >= 0 ? '+' : '') + U.money(r.profit) })
                ),
                actions: [
                  { label: 'Close', primary: true, onClick: function () { C.router.go('casino'); } }
                ]
              });
            }
          })
        ));
      });
      var tablesSection = UI.section('Interactive Casino Tables', [gamesGrid]);

      function renderActiveCasinoView() {
        C.dom.clear(casinoContentWrap);
        if (activeCasinoTab === 'slots') {
          casinoContentWrap.appendChild(slotsCard);
        } else if (activeCasinoTab === 'tables') {
          casinoContentWrap.appendChild(tablesSection);
        } else if (activeCasinoTab === 'overview') {
          casinoContentWrap.appendChild(UI.card('Daily Casino Tokens & High Stakes Overview',
            'Claim 50 free casino tokens every calendar day to wager at the slots or tables.',
            h('div', { class: 'stack' },
              h('p', { text: 'Tokens are used for exclusive high-roller raffles and multiplier side bets.' }),
              h('button', {
                class: 'green primary',
                text: '🎁 Claim +50 Daily Free Tokens',
                onclick: function () {
                  var r = A.claimCasinoTokens();
                  if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                  if (C.audio) C.audio.play('cash');
                  UI.toast('+' + r.amount + ' casino tokens claimed!', 'money');
                  C.router.go('casino');
                }
              })
            )
          ));
        }
      }

      casinoTabsBar.appendChild(UI.tabBar(casinoTabs, activeCasinoTab, function (tabId) {
        activeCasinoTab = tabId;
        renderActiveCasinoView();
      }));

      renderActiveCasinoView();
      root.appendChild(casinoTabsBar);
      root.appendChild(casinoContentWrap);
      root.appendChild(h('p', { class: 'small dim center', style: { marginTop: '16px' }, text: 'All games use fictional Caligo credits. Gamblers Anonymous Hotline available at City Clinic.' }));

      return root;
    }
  };
})(window.CALIGO);
