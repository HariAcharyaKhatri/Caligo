/* CALIGO — hash router. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var Router = {};
  var current = 'home';

  Router.go = function (id) {
    if (!C.state.save) return;
    if (!C.screens[id]) id = 'home';
    current = id;

    C.ui.closeAllModals();
    C.engine.clearLive();
    C.sidebar.update(C.state.save);
    C.engine.live(C.sidebar.update);

    var root = document.getElementById('screen');
    C.dom.clear(root);
    root.appendChild(C.screens[id].render());
    window.scrollTo(0, 0);

    if (window.location.hash !== '#/' + id) window.location.hash = '#/' + id;
  };

  Router.current = function () { return current; };
  Router.render = function () { Router.go(current); };
  Router.refresh = function () { Router.go(current); };
  Router.readHash = function () {
    var m = /^#\/([a-zA-Z0-9_-]+)/.exec(window.location.hash || '');
    var id = m ? m[1].toLowerCase() : 'home';
    return C.screens[id] ? id : 'home';
  };

  C.router = Router;
})(window.CALIGO);
