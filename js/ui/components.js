/* CALIGO — reusable interface pieces with sound integration. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var h = C.dom.h;
  var UI = {};

  UI.pageHead = function (title, links) {
    return h('div', { class: 'page-head' },
      h('h1', { class: 'page-title', text: title }),
      links ? h('div', { class: 'page-links' }, links.map(function (l) {
        return h('a', {
          href: l.href || 'javascript:void(0)',
          text: l.label,
          onclick: l.onClick ? function (e) { e.preventDefault(); l.onClick(); } : null
        });
      })) : null
    );
  };

  UI.tabs = function (tabs, activeId, onChange) {
    var bar = h('div', { class: 'torn-tabs' });
    tabs.forEach(function (tab) {
      var btn = h('button', {
        class: 'torn-tab' + (tab.id === activeId ? ' active' : ''),
        text: tab.label,
        type: 'button',
        onclick: function () {
          C.dom.qsa('.torn-tab', bar).forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          if (onChange) onChange(tab.id);
        }
      });
      bar.appendChild(btn);
    });
    return bar;
  };

  UI.bar = function (label, color) {
    var valEl = h('span', { class: 'vital-val', text: '0' });
    var fill = h('i', { class: 'vital-fill', style: { background: color } });
    var root = h('div', { class: 'vital' },
      h('div', { class: 'vital-top' }, h('span', { text: label }), valEl),
      h('div', { class: 'vital-track' }, fill)
    );
    return {
      el: root,
      update: function (value, max, extra) {
        C.dom.setText(valEl, Math.floor(value) + ' / ' + Math.floor(max) + (extra ? ' · ' + extra : ''));
        C.dom.setWidth(fill, max > 0 ? (value / max) * 100 : 0);
      }
    };
  };

  UI.pill = function (text, cls) {
    return h('span', { class: 'pill ' + (cls || ''), text: text });
  };

  UI.card = function (title, sub, bodyEls, rightEl, solo) {
    var el = h('div', { class: solo === false ? '' : 'card' + (solo === 'solo' ? ' solo' : '') });
    if (title) {
      el.appendChild(h('div', { class: 'section-title top-round' },
        h('span', { text: title }),
        rightEl || (sub ? h('span', { class: 'muted small', text: sub }) : null)
      ));
    }
    var body = h('div', { class: 'card bottom-round' + (title ? '' : ' solo') });
    (Array.isArray(bodyEls) ? bodyEls : [bodyEls]).forEach(function (b) { if (b) body.appendChild(b); });
    el.appendChild(body);
    return el;
  };

  UI.section = function (title, bodyEls, rightEl) {
    var wrap = h('div');
    wrap.appendChild(h('div', { class: 'title-black top-round' },
      h('span', { text: title }),
      rightEl || null
    ));
    var body = h('div', { class: 'cont-gray bottom-round' });
    (Array.isArray(bodyEls) ? bodyEls : [bodyEls]).forEach(function (b) { if (b) body.appendChild(b); });
    wrap.appendChild(body);
    return wrap;
  };

  UI.toast = function (text, kind) {
    var root = document.getElementById('toasts');
    if (!root) return;
    var el = h('div', { class: 'toast ' + (kind || ''), text: text });
    root.appendChild(el);

    if (C.audio) {
      if (kind === 'money') C.audio.play('cash');
      else if (kind === 'bad') C.audio.play('loss');
      else if (kind === 'good') C.audio.play('ding');
    }

    window.setTimeout(function () {
      el.style.transition = 'opacity .3s, transform .3s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, 2800);
  };

  var openModals = [];

  UI.modal = function (opts) {
    var root = document.getElementById('modal-root');
    var box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
    var head = h('div', { class: 'modal-head' },
      h('h2', { text: opts.title || '', style: { margin: 0 } }),
      opts.dismissible === false ? null : h('button', {
        class: 'small ghost', text: '✕',
        onclick: function () { close(); }
      })
    );
    box.appendChild(head);
    if (typeof opts.body === 'string') box.appendChild(h('p', { text: opts.body }));
    else if (opts.body) box.appendChild(opts.body);
    if (opts.actions && opts.actions.length) {
      var acts = h('div', { class: 'modal-actions' });
      opts.actions.forEach(function (a) {
        acts.appendChild(h('button', {
          class: a.primary ? 'primary' : (a.danger ? 'danger' : ''),
          text: a.label, disabled: a.disabled,
          onclick: function () {
            if (a.onClick) a.onClick();
            if (a.close !== false) close();
          }
        }));
      });
      box.appendChild(acts);
    }
    var back = h('div', { class: 'modal-back', onclick: function (e) {
      if (e.target === back && opts.dismissible !== false) close();
    }}, box);

    function onKey(e) { if (e.key === 'Escape' && opts.dismissible !== false) close(); }
    function close() {
      window.removeEventListener('keydown', onKey);
      if (back.parentNode) back.parentNode.removeChild(back);
      openModals = openModals.filter(function (m) { return m !== close; });
      if (opts.onClose) opts.onClose();
    }
    root.appendChild(back);
    window.addEventListener('keydown', onKey);
    openModals.push(close);
    var f = box.querySelector('button.primary, button, input, select');
    if (f) f.focus();
    return { el: box, close: close };
  };

  UI.closeAllModals = function () { openModals.slice().forEach(function (fn) { fn(); }); };

  UI.confirm = function (message, onYes) {
    var sv = C.state.save;
    if (sv && sv.settings.confirmExpensive === false) { onYes(); return; }
    UI.modal({
      title: 'Action Confirmation', body: message,
      actions: [{ label: 'Cancel' }, { label: 'Confirm', primary: true, onClick: onYes }]
    });
  };

  UI.table = function (headers, rows) {
    var thead = h('thead', null, h('tr', null, headers.map(function (hdr) {
      return h('th', { class: hdr.num ? 'num' : '', text: hdr.label });
    })));
    var tbody = h('tbody', null, rows.map(function (r) {
      var tr = h('tr', { class: r.onClick ? 'clickable' : '' },
        r.cells.map(function (c, i) {
          var td = h('td', { class: headers[i] && headers[i].num ? 'num' : '' });
          if ((typeof Node !== 'undefined' && c instanceof Node) || (c && (c.nodeType || c.tagName))) td.appendChild(c);
          else if (c && typeof c === 'object' && c.html) td.innerHTML = c.html;
          else td.textContent = c;
          return td;
        })
      );
      if (r.onClick) tr.addEventListener('click', r.onClick);
      return tr;
    }));
    return h('table', null, thead, tbody);
  };

  UI.details = function (summaryEls, bodyEls, open) {
    var sum = h('summary', null, Array.isArray(summaryEls) ? summaryEls : [summaryEls]);
    var body = h('div', { class: 'details-body' }, Array.isArray(bodyEls) ? bodyEls : [bodyEls]);
    return h('details', open ? { open: true } : null, sum, body);
  };

  UI.logLine = function (entry) {
    return h('div', { class: 'log-line' },
      h('span', { class: 'log-time', text: C.util.dur(entry.t) }),
      h('span', { class: 'log-' + entry.kind, text: entry.text })
    );
  };

  UI.logPanel = function (save, limit) {
    var box = h('div', { class: 'log' });
    (save.log || []).slice(0, limit || 30).forEach(function (e) { box.appendChild(UI.logLine(e)); });
    if (!box.firstChild) box.appendChild(h('div', { class: 'muted small', text: 'No recorded activity yet.' }));
    return box;
  };

  UI.chanceClass = function (p) {
    if (p >= 0.7) return 'chance-good';
    if (p >= 0.4) return 'chance-mid';
    return 'chance-bad';
  };

  UI.tile = function (icon, name, sub, onClick) {
    return h('div', { class: 'tile', onclick: onClick || function () {} },
      h('div', { class: 'tile-icon', text: icon }),
      h('div', { class: 'tile-name', text: name }),
      sub ? h('div', { class: 'tile-sub', text: sub }) : null
    );
  };

  UI.progress = function (pct) {
    return h('div', { class: 'prog' }, h('i', { style: { width: (pct * 100) + '%' } }));
  };

  C.ui = UI;
})(window.CALIGO);
