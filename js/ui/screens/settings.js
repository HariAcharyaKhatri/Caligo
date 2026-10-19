/* CALIGO — settings, save export/import and reset. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var S = C.state;
  var UI = C.ui;
  var A = C.actions;
  var U = C.util;

  C.screens = C.screens || {};

  C.screens.settings = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Settings', [
        { label: 'Home', onClick: function () { C.router.go('home'); } }
      ]));

      /* ---- TIME SCALE ---- */
      var scaleSel = h('select', null,
        [1, 5, 15, 60, 300].map(function (v) {
          return h('option', { value: String(v), text: v + '× (' + (v === 1 ? 'normal' : 'testing') + ')' });
        })
      );
      scaleSel.value = String(sv.settings.timeScale || 1);
      scaleSel.addEventListener('change', function () {
        A.setSetting('timeScale', Number(scaleSel.value));
        UI.toast('Time scale set to ' + scaleSel.value + '×', 'good');
      });

      root.appendChild(UI.card('Time scale', 'Speeds up regeneration, jail, hospital and cooldowns. Use 60x while testing.', [
        h('label', { text: 'Game speed' }), scaleSel
      ]));

      /* ---- APPEARANCE ---- */
      var themeSel = h('select', null,
        h('option', { value: 'noir', text: 'Noir (default)' }),
        h('option', { value: 'ash', text: 'Ash' })
      );
      themeSel.value = sv.settings.theme || 'noir';
      themeSel.addEventListener('change', function () {
        A.setSetting('theme', themeSel.value);
        applyAppearance();
      });

      var sizeSel = h('select', null,
        h('option', { value: 'small', text: 'Small' }),
        h('option', { value: 'normal', text: 'Normal' }),
        h('option', { value: 'large', text: 'Large' })
      );
      sizeSel.value = sv.settings.textSize || 'normal';
      sizeSel.addEventListener('change', function () {
        A.setSetting('textSize', sizeSel.value);
        applyAppearance();
      });

      var confirmChk = h('input', { type: 'checkbox' });
      confirmChk.checked = sv.settings.confirmExpensive !== false;
      confirmChk.addEventListener('change', function () {
        A.setSetting('confirmExpensive', confirmChk.checked);
      });

      root.appendChild(UI.card('Appearance and safety', null, [
        h('label', { text: 'Theme' }), themeSel,
        h('div', { style: { height: '10px' } }),
        h('label', { text: 'Text size' }), sizeSel,
        h('div', { style: { height: '10px' } }),
        h('label', { class: 'row' }, confirmChk, h('span', { text: ' Confirm before expensive actions' }))
      ]));

      /* ---- SAVE MANAGEMENT ---- */
      var saveBody = h('div', { class: 'stack' });

      saveBody.appendChild(h('button', {
        text: 'Save now',
        onclick: function () { A.save(); UI.toast('Saved.', 'good'); }
      }));

      saveBody.appendChild(h('button', {
        text: 'Export save to file',
        onclick: function () {
          var text = A.exportSave();
          var blob = new Blob([text], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = h('a', { href: url, download: 'caligo-save.json' });
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          UI.toast('Save exported.', 'good');
        }
      }));

      var fileInput = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } });
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            A.importSave(String(reader.result));
            UI.toast('Save imported.', 'good');
            C.router.go('home');
          } catch (e) {
            UI.toast('That file could not be read.', 'bad');
          }
        };
        reader.readAsText(f);
        fileInput.value = '';
      });
      saveBody.appendChild(fileInput);

      saveBody.appendChild(h('button', {
        text: 'Import save from file',
        onclick: function () {
          UI.confirm('Importing replaces your current save. Continue?', function () {
            fileInput.click();
          });
        }
      }));

      saveBody.appendChild(h('hr', { class: 'sep' }));

      saveBody.appendChild(h('button', {
        class: 'danger', text: 'Reset game (delete save)',
        onclick: function () {
          UI.modal({
            title: 'Delete everything?',
            body: 'This wipes your character, money, items and progress. There is no undo.',
            dismissible: true,
            actions: [
              { label: 'Cancel' },
              { label: 'Delete save', danger: true, onClick: function () {
                A.resetGame();
                window.location.reload();
              }}
            ]
          });
        }
      }));

      root.appendChild(UI.card('Save data', 'Everything lives in this browser. Export regularly.', saveBody));

      /* ---- CHARACTER SUMMARY ---- */
      var p = sv.player;
      root.appendChild(UI.card('Character', null, [
        UI.table([{ label: 'Stat' }, { label: 'Value', num: true }], [
          { cells: ['Name', p.name] },
          { cells: ['Level', p.level] },
          { cells: ['XP', U.num(p.xp) + ' / ' + U.num(S.xpToNext(p.level))] },
          { cells: ['Crime level', p.crimeLevel + ' — ' + S.crimeLevelName(p.crimeLevel)] },
          { cells: ['Strength', Math.floor(p.stats.strength)] },
          { cells: ['Defense', Math.floor(p.stats.defense)] },
          { cells: ['Speed', Math.floor(p.stats.speed)] },
          { cells: ['Dexterity', Math.floor(p.stats.dexterity)] },
          { cells: ['Intelligence', Math.floor(p.stats.intelligence)] },
          { cells: ['Max nerve', S.maxNerve(p)] },
          { cells: ['Crimes attempted', sv.counters.crimes] },
          { cells: ['Crimes succeeded', sv.counters.crimesOk] },
          { cells: ['Training sessions', sv.counters.trains] },
          { cells: ['Times jailed', sv.counters.jailed] }
        ])
      ]));

      return root;
    }
  };

  function applyAppearance() {
    var sv = C.state.save;
    document.documentElement.setAttribute('data-theme', sv.settings.theme || 'noir');
    document.documentElement.setAttribute('data-size', sv.settings.textSize || 'normal');
  }

  C.applyAppearance = applyAppearance;
})(window.CALIGO);
