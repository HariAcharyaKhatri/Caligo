(function (C) {
  'use strict';
  var h = C.dom.h;

  function boot() {
    var loaded = C.storage.read();
    if (loaded) {
      loaded = C.storage.migrate(loaded);
      if (loaded) loaded = C.storage.repair(loaded);
    }
    if (!loaded) { showCharacterCreation(); return; }
    startGame(loaded);
  }

  function startGame(save) {
    C.state.save = save;
    if (!save.bots || save.bots.length === 0) {
      save.bots = C.bots.generateRoster(C.config.BOTS.rosterSize);
    }
    C.engine.rollWeather(save, Date.now());
    C.engine.offlineReport = C.engine.catchUp(save);

    document.documentElement.setAttribute('data-theme', save.settings.theme || 'noir');
    document.documentElement.setAttribute('data-size', save.settings.textSize || 'normal');

    document.getElementById('boot').classList.add('hidden');

    C.sidebar.mount();

    window.addEventListener('hashchange', function () {
      C.router.go(C.router.readHash());
    });

    C.router.go(C.router.readHash());
    C.engine.start();

    /* Background jobs. */
    var lastTick = save.meta.gameTime;
    C.engine.live(function (s) {
      var elapsed = s.meta.gameTime - lastTick;
      if (elapsed <= 0) return;
      lastTick = s.meta.gameTime;

      C.bots.grow(s, elapsed);
      C.actions.checkLoans();
      C.actions.tickMarketSales();
      C.actions.completeTravel();
      C.actions.refreshMarket(false);
      C.actions.checkCourseProgress();
      C.actions.tickFaction();
      C.actions.tickTerritories();
      C.actions.rollDailyMissions();
      if (typeof C.actions.tickCasino === 'function') C.actions.tickCasino();
    });

    window.addEventListener('beforeunload', function () { C.engine.flush(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') C.engine.flush();
    });
  }

  function showCharacterCreation() {
    var bootEl = document.getElementById('boot');
    C.dom.clear(bootEl);

    var nameInput = h('input', { type: 'text', maxlength: '20', placeholder: 'Street name', value: '' });
    var chosen = C.config.AVATARS[0];

    var avatarRow = h('div', { class: 'avatars' });
    C.config.AVATARS.forEach(function (a) {
      avatarRow.appendChild(h('button', {
        class: 'avatar-opt' + (a === chosen ? ' sel' : ''),
        text: a, type: 'button',
        onclick: function () {
          chosen = a;
          C.dom.qsa('.avatar-opt', avatarRow).forEach(function (b) {
            b.classList.toggle('sel', b.textContent === a);
          });
        }
      }));
    });

    var startBtn = h('button', { class: 'primary', text: 'Step off the ferry', style: { width: '100%' } });
    startBtn.addEventListener('click', function () {
      var name = nameInput.value.trim();
      if (!name) { C.ui.toast('You need a street name.', 'bad'); nameInput.focus(); return; }
      var save = C.actions.createCharacter(name, chosen);
      startGame(save);
    });
    nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') startBtn.click(); });

    bootEl.appendChild(h('div', { class: 'boot-inner' },
      h('h1', { text: 'CALIGO' }),
      h('div', { class: 'tagline', text: 'Rise in the Vertical City' }),
      h('div', { class: 'card solo' },
        h('p', { class: 'small muted', text: 'Five platforms stacked above a dark sea. Pick a name and a face. The Docks will do the rest.' }),
        h('label', { text: 'Street name' }), nameInput,
        h('div', { style: { height: '12px' } }),
        h('label', { text: 'Face' }), avatarRow,
        h('div', { style: { height: '16px' } }),
        startBtn
      )
    ));
    nameInput.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.CALIGO);
