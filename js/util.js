/* CALIGO — shared helpers. No game rules live here. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var U = {};

  U.clamp = function (v, min, max) { return v < min ? min : (v > max ? max : v); };

  /* Uniform random float in [min,max). */
  U.rand = function (min, max) { return min + Math.random() * (max - min); };

  /* Inclusive integer roll. */
  U.randInt = function (min, max) { return Math.floor(min + Math.random() * (max - min + 1)); };

  U.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  U.chance = function (p) { return Math.random() < p; };

  /* Weighted pick. Entries need a numeric `w`; missing w counts as 1. */
  U.pickWeighted = function (list) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += (list[i].w == null ? 1 : list[i].w);
    var r = Math.random() * total;
    for (i = 0; i < list.length; i++) {
      r -= (list[i].w == null ? 1 : list[i].w);
      if (r <= 0) return list[i];
    }
    return list[list.length - 1];
  };

  /* Skewed roll used for every payout. pow() > 1 pushes results toward `min`,
     so the top of a reward range stays a rare outlier. */
  U.skewRoll = function (min, max, power) {
    var p = (power == null) ? 2.5 : power;
    return min + (max - min) * Math.pow(Math.random(), p);
  };

  U.num = function (n) {
    n = Math.floor(n || 0);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  U.money = function (n) { return '$' + U.num(n); };

  U.compact = function (n) {
    n = Math.floor(n || 0);
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e4) return (n / 1e3).toFixed(1) + 'k';
    return U.num(n);
  };

  /* Formats a duration in seconds as a short human string. */
  U.dur = function (sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    if (sec <= 0) return 'ready';
    var d = Math.floor(sec / 86400);
    var h = Math.floor((sec % 86400) / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (d) return d + 'd ' + h + 'h';
    if (h) return h + 'h ' + m + 'm';
    if (m) return m + 'm ' + s + 's';
    return s + 's';
  };

  U.uid = function () { return Math.random().toString(36).slice(2, 10); };

  U.clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  U.pct = function (p, dp) {
    var v = p * 100;
    return (dp ? v.toFixed(dp) : (Math.round(v * 10) / 10)) + '%';
  };

  U.round1 = function (v) { return Math.round(v * 10) / 10; };

  U.titleCase = function (s) {
    return String(s).replace(/(^|\s)\S/g, function (t) { return t.toUpperCase(); });
  };

  C.util = U;
})(window.CALIGO);
