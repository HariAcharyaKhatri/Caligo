/* CALIGO — sidebar & topbar controller. Updates in real-time. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var S = C.state;
  var U = C.util;
  var UI = C.ui;

  var Sidebar = {};

  Sidebar.areas = [
    { id: 'home',         label: 'Home',             icon: '⌂' },
    { id: 'city',         label: 'City',             icon: '◉' },
    { id: 'inventory',    label: 'Items',            icon: '▣' },
    { id: 'crimes',       label: 'Crimes',           icon: '☠' },
    { id: 'gym',          label: 'Gym',              icon: '⚡' },
    { id: 'combat',       label: 'Combat',           icon: '⚔' },
    { id: 'casino',       label: 'Casino',           icon: '🎰' },
    { id: 'bank',         label: 'Bank',             icon: '$' },
    { id: 'market',       label: 'Item Market',      icon: '⇄' },
    { id: 'armoury',      label: 'Armoury',          icon: '🛡' },
    { id: 'shops',        label: 'Shops',            icon: '🛍' },
    { id: 'job',          label: 'Job',              icon: '💼' },
    { id: 'education',    label: 'Education',        icon: '✎' },
    { id: 'travel',       label: 'Travel',           icon: '✈' },
    { id: 'hospital',     label: 'Hospital',         icon: '✚' },
    { id: 'jail',         label: 'Jail',             icon: '⚿' },
    { id: 'properties',   label: 'Properties',       icon: '🏠' },
    { id: 'faction',      label: 'Faction',          icon: '✦' },
    { id: 'territory',    label: 'Territories',      icon: '▧' },
    { id: 'companies',    label: 'Company',          icon: '◈' },
    { id: 'missions',     label: 'Missions',         icon: '◎' },
    { id: 'newspaper',    label: 'Newspaper',        icon: '❐' },
    { id: 'forums',       label: 'Forums',           icon: '☰' },
    { id: 'halloffame',   label: 'Hall of Fame',     icon: '♛' },
    { id: 'calendar',     label: 'Calendar',         icon: '▦' },
    { id: 'recruit',      label: 'Recruit Citizens', icon: '⚑' }
  ];

  Sidebar.lists = [
    { id: 'friends', label: 'Friends', countKey: 'friends', icon: '☺' },
    { id: 'enemies', label: 'Enemies', countKey: 'enemies', icon: '☹' },
    { id: 'targets', label: 'Targets', countKey: 'targets', icon: '⌖' },
    { id: 'wiki',    label: 'City Wiki',  icon: '📖' },
    { id: 'rules',   label: 'City Rules', icon: '⚖' },
    { id: 'credits', label: 'Credits',    icon: '★' },
    { id: 'contact', label: 'Support & Help', icon: '✉' }
  ];

  Sidebar.mount = function () {
    Sidebar.els = {
      avatar: document.getElementById('side-avatar'),
      name: document.getElementById('side-name'),
      honor: document.getElementById('side-honor'),
      cash: document.getElementById('side-cash'),
      level: document.getElementById('side-level'),
      points: document.getElementById('side-points'),
      merits: document.getElementById('side-merits'),
      xpFill: document.getElementById('side-xp-fill'),
      xpVal: document.getElementById('side-xp-val'),
      energyFill: document.getElementById('sb-energy-fill'),
      energyVal: document.getElementById('sb-energy-val'),
      energyTime: document.getElementById('sb-energy-time'),
      nerveFill: document.getElementById('sb-nerve-fill'),
      nerveVal: document.getElementById('sb-nerve-val'),
      nerveTime: document.getElementById('sb-nerve-time'),
      happyFill: document.getElementById('sb-happy-fill'),
      happyVal: document.getElementById('sb-happy-val'),
      happyTime: document.getElementById('sb-happy-time'),
      lifeFill: document.getElementById('sb-life-fill'),
      lifeVal: document.getElementById('sb-life-val'),
      lifeTime: document.getElementById('sb-life-time'),
      bsStr: document.getElementById('bs-str'),
      bsDef: document.getElementById('bs-def'),
      bsSpd: document.getElementById('bs-spd'),
      bsDex: document.getElementById('bs-dex'),
      bsTotal: document.getElementById('bs-total'),
      time: document.getElementById('server-time'),
      topTime: document.getElementById('top-time'),
      topStatusChips: document.getElementById('top-status-chips'),
      bannerLoc: document.getElementById('banner-loc'),
      bannerWeather: document.getElementById('banner-weather')
    };

    /* Use merits link */
    var useMerits = document.getElementById('use-merits');
    if (useMerits) {
      useMerits.addEventListener('click', function () {
        C.router.go('merits');
      });
    }

    /* Quick bank shortcut */
    var quickBank = document.getElementById('quick-bank');
    if (quickBank) {
      quickBank.addEventListener('click', function () {
        C.router.go('bank');
      });
    }

    /* Sound toggle */
    var soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      function updateSoundBtn() {
        var muted = C.audio ? C.audio.isMuted() : false;
        soundBtn.textContent = muted ? '🔇' : '🔊';
        soundBtn.title = muted ? 'Unmute Sound FX' : 'Mute Sound FX';
      }
      updateSoundBtn();
      soundBtn.addEventListener('click', function () {
        if (C.audio) {
          C.audio.toggle();
          updateSoundBtn();
          UI.toast(C.audio.isMuted() ? 'Sound FX muted' : 'Sound FX enabled', 'good');
        }
      });
    }

    /* Theme switcher */
    var themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
      var themes = ['noir', 'autumn', 'cyber', 'ash'];
      themeBtn.addEventListener('click', function () {
        var curr = document.documentElement.getAttribute('data-theme') || 'noir';
        var nextIdx = (themes.indexOf(curr) + 1) % themes.length;
        var next = themes[nextIdx];
        document.documentElement.setAttribute('data-theme', next);
        if (C.state.save && C.state.save.settings) {
          C.actions.setSetting('theme', next);
        }
        UI.toast('Theme changed to: ' + next.toUpperCase(), 'good');
      });
    }

    /* Banner toggle */
    var bannerBtn = document.getElementById('btn-banner');
    var bannerWrap = document.getElementById('city-banner-wrap');
    if (bannerBtn && bannerWrap) {
      bannerBtn.addEventListener('click', function () {
        bannerWrap.classList.toggle('collapsed');
        var collapsed = bannerWrap.classList.contains('collapsed');
        bannerBtn.textContent = collapsed ? '🌄' : '🌆';
        bannerBtn.title = collapsed ? 'Show City Skyline' : 'Collapse City Skyline';
      });
    }

    /* Player icon buttons */
    C.dom.qsa('.ic-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.dataset.screen;
        if (s) C.router.go(s);
      });
    });

    /* Areas nav */
    var navAreas = document.getElementById('nav-areas');
    if (navAreas) {
      C.dom.clear(navAreas);
      Sidebar.areas.forEach(function (a) {
        navAreas.appendChild(h('button', {
          class: 'nav-btn',
          dataset: { screen: a.id },
          onclick: function () { C.router.go(a.id); }
        },
          h('span', { class: 'nav-icon', text: a.icon }),
          h('span', { class: 'nav-label', text: a.label })
        ));
      });
    }

    /* Lists nav */
    var navLists = document.getElementById('nav-lists');
    if (navLists) {
      C.dom.clear(navLists);
      Sidebar.lists.forEach(function (l) {
        var btn = h('button', {
          class: 'nav-btn',
          dataset: { screen: l.id, list: l.countKey || '' },
          onclick: function () {
            C.router.go(l.id);
            var sb = document.getElementById('sidebar');
            if (sb) sb.classList.remove('mobile-open');
          }
        },
          h('span', { class: 'nav-icon', text: l.icon }),
          h('span', { class: 'nav-label', text: l.label })
        );
        if (l.countKey) {
          btn.appendChild(h('span', { class: 'nav-count', dataset: { count: l.countKey }, text: '0' }));
        }
        navLists.appendChild(btn);
      });
    }

    /* Mobile drawer toggle buttons */
    function toggleMobileDrawer() {
      var sb = document.getElementById('sidebar');
      if (sb) {
        sb.classList.toggle('mobile-open');
        var isOpen = sb.classList.contains('mobile-open');
        var btnNav = document.getElementById('btn-mobile-nav');
        var mbMenu = document.getElementById('mb-btn-menu');
        if (btnNav) btnNav.classList.toggle('active', isOpen);
        if (mbMenu) mbMenu.classList.toggle('active', isOpen);
      }
    }

    var btnMobNav = document.getElementById('btn-mobile-nav');
    if (btnMobNav) {
      btnMobNav.addEventListener('click', toggleMobileDrawer);
    }

    var mbMenuBtn = document.getElementById('mb-btn-menu');
    if (mbMenuBtn) {
      mbMenuBtn.addEventListener('click', toggleMobileDrawer);
    }

    /* Mobile bottom navigation destination buttons */
    C.dom.qsa('.mb-btn[data-screen]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var screenId = btn.dataset.screen;
        if (screenId) {
          C.router.go(screenId);
          var sb = document.getElementById('sidebar');
          if (sb) sb.classList.remove('mobile-open');
        }
      });
    });

    C.engine.live(Sidebar.update);
    Sidebar.update(C.state.save);
  };

  Sidebar.update = function (save) {
    if (!save) return;
    var p = save.player;
    var e = Sidebar.els;
    if (!e || !e.name) return;

    C.dom.setText(e.avatar, p.avatar || '◈');
    C.dom.setText(e.name, p.name);
    if (e.honor) C.dom.setText(e.honor, 'Lvl ' + p.level + ' · ' + rankLabel(p.level));
    C.dom.setText(e.cash, U.money(p.cash));
    C.dom.setText(e.level, p.level);
    C.dom.setText(e.points, p.points || 0);
    C.dom.setText(e.merits, p.merits || 0);

    /* XP Progress Bar */
    var xpReq = (p.level * 100);
    var currXp = (p.xp || 0) % xpReq;
    var xpPct = Math.min(100, Math.floor((currXp / xpReq) * 100));
    if (e.xpFill) e.xpFill.style.width = xpPct + '%';
    if (e.xpVal) e.xpVal.textContent = xpPct + '%';

    /* Vital Bars */
    var eMax = S.maxEnergy(p), nMax = S.maxNerve(p),
        hMax = S.maxHappiness(p), lMax = S.maxLife(p);

    function apply(fill, val, time, v, max, rate) {
      if (!fill || !val) return;
      C.dom.setWidth(fill, max > 0 ? (v / max) * 100 : 0);
      C.dom.setText(val, Math.floor(v) + '/' + Math.floor(max));
      if (!time) return;
      if (v >= max) C.dom.setText(time, 'FULL');
      else C.dom.setText(time, U.dur((max - v) * rate));
    }

    apply(e.energyFill, e.energyVal, e.energyTime, p.energy, eMax, C.config.REGEN.energy);
    apply(e.nerveFill, e.nerveVal, e.nerveTime, p.nerve, nMax, C.config.REGEN.nerve);
    apply(e.happyFill, e.happyVal, e.happyTime, p.happiness, hMax, 60);
    apply(e.lifeFill, e.lifeVal, e.lifeTime, p.life, lMax, C.config.REGEN.life);

    /* Battle Stats Summary */
    if (e.bsStr && p.stats) {
      e.bsStr.textContent = Math.floor(p.stats.strength || 10);
      e.bsDef.textContent = Math.floor(p.stats.defense || 10);
      e.bsSpd.textContent = Math.floor(p.stats.speed || 10);
      e.bsDex.textContent = Math.floor(p.stats.dexterity || 10);
      var total = Math.floor((p.stats.strength || 10) + (p.stats.defense || 10) + (p.stats.speed || 10) + (p.stats.dexterity || 10));
      e.bsTotal.textContent = total;
    }

    /* Server time & Top clock */
    var now = new Date();
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    var fullStr = days[now.getDay()] + ' ' + timeStr + ' CST';
    if (e.time) C.dom.setText(e.time, fullStr);
    if (e.topTime) C.dom.setText(e.topTime, timeStr);

    /* Top Status Chips */
    if (e.topStatusChips) {
      C.dom.clear(e.topStatusChips);
      if (S.isHospital(save)) {
        var hospSec = S.hospitalLeft(save);
        e.topStatusChips.appendChild(h('div', { class: 'status-chip danger' },
          h('span', { text: '✚ Clinic' }),
          h('span', { text: U.dur(hospSec) })
        ));
      }
      if (S.isJailed(save)) {
        var jailSec = S.jailLeft(save);
        e.topStatusChips.appendChild(h('div', { class: 'status-chip warn' },
          h('span', { text: '⚿ In Jail' }),
          h('span', { text: U.dur(jailSec) })
        ));
      }
      var wantedLvl = p.wantedLevel || (p.wanted ? Math.min(5, Math.ceil(p.wanted / 20)) : 0);
      if (wantedLvl > 0) {
        var stars = '';
        for (var i = 0; i < wantedLvl; i++) stars += '★';
        e.topStatusChips.appendChild(h('div', { class: 'status-chip danger' },
          h('span', { text: 'Wanted ' + stars })
        ));
      }
      if (save.combat && !save.combat.over) {
        e.topStatusChips.appendChild(h('div', { class: 'status-chip danger' },
          h('span', { text: '⚔ In Combat' })
        ));
      }
      if (S.inTransit(save)) {
        e.topStatusChips.appendChild(h('div', { class: 'status-chip info' },
          h('span', { text: '✈ Traveling' })
        ));
      }
      if (!e.topStatusChips.children.length) {
        e.topStatusChips.appendChild(h('div', { class: 'status-chip ok' },
          h('span', { text: '✓ City Clear' })
        ));
      }
    }

    /* Banner Location & Weather */
    var platform = C.data.platforms[p.location || 'docks'] || C.data.platforms.docks;
    var wx = C.engine.weather ? C.engine.weather(save) : { label: 'Clear' };
    if (e.bannerLoc) C.dom.setText(e.bannerLoc, platform.name);
    if (e.bannerWeather) C.dom.setText(e.bannerWeather, '• ' + wx.label);

    /* Active nav */
    var current = C.router.current();
    C.dom.qsa('.nav-btn', document.getElementById('nav-areas')).forEach(function (b) {
      b.classList.toggle('active', b.dataset.screen === current);
    });
    C.dom.qsa('.nav-btn', document.getElementById('nav-lists')).forEach(function (b) {
      b.classList.toggle('active', b.dataset.screen === current);
    });
    C.dom.qsa('.mb-btn[data-screen]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.screen === current);
    });

    /* List counts */
    ['friends', 'enemies', 'targets'].forEach(function (k) {
      var el = document.querySelector('[data-count="' + k + '"]');
      if (el) el.textContent = (save.lists[k] || []).length;
    });

    /* Alerts */
    C.dom.qsa('#nav-areas .nav-btn').forEach(function (b) {
      var id = b.dataset.screen;
      var alert = false;
      if (id === 'jail' && S.isJailed(save)) alert = true;
      if (id === 'hospital' && S.isHospital(save)) alert = true;
      if (id === 'combat' && save.combat && !save.combat.over) alert = true;
      if (id === 'missions' && C.actions.missionProgress && C.data.storyMissions[save.missions.story]) {
        var m = C.data.storyMissions[save.missions.story];
        if (C.actions.missionProgress(m) >= m.goal.target) alert = true;
      }
      b.classList.toggle('alert', alert);
    });
  };

  function rankLabel(level) {
    if (level < 3) return 'Rookie';
    if (level < 7) return 'Street Thug';
    if (level < 15) return 'Enforcer';
    if (level < 25) return 'Lieutenant';
    if (level < 40) return 'Underboss';
    return 'Syndicate Boss';
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  C.sidebar = Sidebar;
})(window.CALIGO);
