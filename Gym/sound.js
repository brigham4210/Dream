/* Sound for the workout room, made in the browser with Web Audio: nothing is recorded and no files are loaded.
   makeGymSound() returns { clank(hz), thud(), beep(hz), loop(name, level) }. The treadmill's loop keeps running until its
   level is set back to 0. The audio context is only created on the first sound, after a click. */
window.makeGymSound = function () {
  let ctx = null, out = null, noiseBuf = null; const loops = {};
  function start() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor(); out = ctx.createGain(); out.gain.value = 0.5; out.connect(comp); comp.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const noise = c => { if (!noiseBuf) { const n = c.sampleRate * 2; noiseBuf = c.createBuffer(1, n, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; } return noiseBuf; };
  const env = (c, t, gain, decay, attack = 0.001) => { const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + decay); g.connect(out); return g; };
  function burst(c, t, { type = 'highpass', f = 1000, q = 0.7, gain = 0.5, decay = 0.2 }) {
    const s = c.createBufferSource(), fl = c.createBiquadFilter(); s.buffer = noise(c); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    s.connect(fl); fl.connect(env(c, t, gain, decay)); s.start(t, Math.random() * 1.5); s.stop(t + decay + 0.05);
  }
  function tone(c, t, { f0, f1 = f0, gain, decay, sweep = 0.1, type = 'sine' }) {
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    o.connect(env(c, t, gain, decay, 0.002)); o.start(t); o.stop(t + decay + 0.05);
  }

  // the treadmill: the belt's hiss over the motor's hum
  const LOOPS = { belt: { filters: [['lowpass', 1100, 0.7]], gain: 0.22, hum: 72 } };
  function loop(name, level) {
    const spec = LOOPS[name]; if (!spec || (!level && !loops[name])) return;
    const c = start();
    if (!loops[name]) {
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = noise(c); s.loop = true; g.gain.value = 0; let node = s;
      for (const [type, f, q] of spec.filters) { const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; node.connect(fl); node = fl; }
      node.connect(g); g.connect(out); s.start();
      if (spec.hum) { const o = c.createOscillator(), lp = c.createBiquadFilter(), og = c.createGain(); o.type = 'sawtooth'; o.frequency.value = spec.hum; lp.type = 'lowpass'; lp.frequency.value = 240; og.gain.value = 0.9; o.connect(lp); lp.connect(og); og.connect(g); o.start(); }
      loops[name] = g;
    }
    loops[name].gain.setTargetAtTime(spec.gain * level, c.currentTime, 0.08);
  }

  return {
    loop,
    // iron meeting iron: a few partials that do not line up, as a bell's do not, and a rattle on top
    clank(hz = 420) { const c = start(), t = c.currentTime; [[1, 0.26, 0.5], [2.76, 0.14, 0.32], [5.4, 0.08, 0.2], [8.93, 0.04, 0.12]].forEach(([r, gain, decay]) => tone(c, t, { f0: hz * r, gain, decay })); burst(c, t, { f: 2600, gain: 0.3, decay: 0.05 }); },
    // something heavy put down on rubber
    thud() { const c = start(), t = c.currentTime; tone(c, t, { f0: 120, f1: 50, gain: 0.5, decay: 0.16, sweep: 0.08 }); burst(c, t, { type: 'lowpass', f: 600, gain: 0.2, decay: 0.05 }); },
    // the treadmill's button
    beep(hz = 1320) { const c = start(), t = c.currentTime; tone(c, t, { f0: hz, gain: 0.16, decay: 0.16, type: 'square' }); },
  };
};
