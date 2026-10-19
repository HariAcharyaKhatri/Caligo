/* CALIGO — Procedural Web Audio API sound effects system. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var AudioSys = {
    ctx: null,
    muted: false
  };

  function initCtx() {
    if (!AudioSys.ctx && (window.AudioContext || window.webkitAudioContext)) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      AudioSys.ctx = new AudioContext();
    }
    if (AudioSys.ctx && AudioSys.ctx.state === 'suspended') {
      AudioSys.ctx.resume();
    }
  }

  // Load mute state from storage
  try {
    var stored = localStorage.getItem('caligo_audio_muted');
    if (stored !== null) AudioSys.muted = (stored === 'true');
  } catch (e) {}

  AudioSys.isMuted = function () {
    return AudioSys.muted;
  };

  AudioSys.toggle = function () {
    AudioSys.muted = !AudioSys.muted;
    try {
      localStorage.setItem('caligo_audio_muted', String(AudioSys.muted));
    } catch (e) {}
    if (!AudioSys.muted) {
      initCtx();
      AudioSys.play('click');
    }
    return AudioSys.muted;
  };

  AudioSys.play = function (type) {
    if (AudioSys.muted) return;
    try {
      initCtx();
      if (!AudioSys.ctx) return;
      var ctx = AudioSys.ctx;
      var now = ctx.currentTime;

      if (type === 'click') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
      else if (type === 'cash' || type === 'coin') {
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var gain = ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now + 0.08);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      }
      else if (type === 'punch' || type === 'hit') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
      else if (type === 'crit') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
      else if (type === 'win' || type === 'levelUp') {
        var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach(function (freq, i) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.12, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.25);
        });
      }
      else if (type === 'loss' || type === 'hospital') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
      else if (type === 'siren' || type === 'jail') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.15);
        osc.frequency.linearRampToValueAtTime(450, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
      else if (type === 'spin') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
      else if (type === 'ding') {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (err) {
      // Audio playback silently catches if context is blocked
    }
  };

  // Add click sound hook to buttons
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (target && (target.tagName === 'BUTTON' || target.closest('button') || target.classList.contains('nav-btn') || target.classList.contains('tile'))) {
      AudioSys.play('click');
    }
  }, true);

  C.audio = AudioSys;
})(window.CALIGO);
