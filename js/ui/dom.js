/* CALIGO — tiny DOM helpers. No game logic. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = {};

  /* h(tag, props, ...children) — props supports class, text, html, dataset,
     on<Event> handlers and any plain attribute. */
  D.h = function (tag, props) {
    var e = document.createElement(tag);
    if (props) {
      for (var k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        var v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'dataset') { for (var d in v) e.dataset[d] = v[d]; }
        else if (k === 'style' && typeof v === 'object') { for (var s in v) e.style[s] = v[s]; }
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) e.setAttribute(k, '');
        else e.setAttribute(k, v);
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child == null || child === false || child === true) continue;
      if (Array.isArray(child)) {
        child.forEach(function (c) {
          if (c == null || c === false || c === true) return;
          e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        });
      } else {
        e.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      }
    }
    return e;
  };

  D.qs = function (sel, root) { return (root || document).querySelector(sel); };
  D.qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  D.clear = function (el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  };

  D.setText = function (el, text) {
    if (el && el.textContent !== text) el.textContent = text;
  };

  D.setWidth = function (el, pct) {
    var v = Math.max(0, Math.min(100, pct)).toFixed(1) + '%';
    if (el && el.style.width !== v) el.style.width = v;
  };

  C.dom = D;
})(window.CALIGO);
