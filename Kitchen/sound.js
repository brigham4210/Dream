/* Sound for the kitchen, made in the browser with Web Audio: nothing is recorded and no files are loaded.
   makeKitchenSound() returns { tap(), ignite(), click(), pop(), ding(), clang(hz), loop(name, level) }. Loops (water, gas, sizzle, the motors, the kettle) keep running until their
   level is set back to 0. The audio context is only created on the first sound, after a click. */
window.makeKitchenSound = function () {
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

  // each loop is noise through a filter or two; some crackle (their loudness is shaken by slow noise), the motors also hum
  const LOOPS = {
    water: { filters: [['bandpass', 1500, 0.5], ['highpass', 500, 0.7]], gain: 0.35 },
    gas: { filters: [['highpass', 4500, 0.7]], gain: 0.07 },
    sizzle: { filters: [['highpass', 3200, 0.7]], gain: 0.16, crackle: true },
    mixer: { filters: [['lowpass', 900, 0.7]], gain: 0.2, hum: 95 },
    blender: { filters: [['bandpass', 1900, 0.8]], gain: 0.32, hum: 210 },
    micro: { filters: [['lowpass', 320, 0.7]], gain: 0.18, hum: 60 },
    fire: { filters: [['bandpass', 900, 0.5]], gain: 0.3, crackle: true },
    griddle: { filters: [['highpass', 3200, 0.7]], gain: 0.14, crackle: true },
    bbq: { filters: [['highpass', 2800, 0.7]], gain: 0.16, crackle: true },
    bubble: { filters: [['lowpass', 420, 0.7]], gain: 0.4, crackle: true },
    konro: { filters: [['highpass', 3000, 0.7]], gain: 0.13, crackle: true },
    curry: { filters: [['lowpass', 460, 0.7]], gain: 0.4, crackle: true },
    boil: { filters: [['lowpass', 520, 0.7]], gain: 0.55, crackle: true },
  };
  function loop(name, level) {
    const spec = LOOPS[name]; if (!spec || (!level && !loops[name])) return;
    const c = start();
    if (!loops[name]) {
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = noise(c); s.loop = true; g.gain.value = 0; let node = s;
      for (const [type, f, q] of spec.filters) { const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; node.connect(fl); node = fl; }
      if (spec.crackle) { const shake = c.createGain(), m = c.createBufferSource(), lp = c.createBiquadFilter(), depth = c.createGain(); shake.gain.value = 0.6;
        m.buffer = noise(c); m.loop = true; m.playbackRate.value = 0.37; lp.type = 'lowpass'; lp.frequency.value = 30; depth.gain.value = 5; m.connect(lp); lp.connect(depth); depth.connect(shake.gain); m.start();
        node.connect(shake); node = shake; }
      node.connect(g); g.connect(out); s.start();
      if (spec.hum) { const o = c.createOscillator(), lp = c.createBiquadFilter(), og = c.createGain(); o.type = 'sawtooth'; o.frequency.value = spec.hum; lp.type = 'lowpass'; lp.frequency.value = 240; og.gain.value = 0.9; o.connect(lp); lp.connect(og); og.connect(g); o.start(); }
      loops[name] = g;
    }
    loops[name].gain.setTargetAtTime(spec.gain * level, c.currentTime, 0.08);
  }

  return {
    loop,
    // a door or drawer meeting its stop
    tap() { const c = start(), t = c.currentTime; tone(c, t, { f0: 170, f1: 85, gain: 0.3, decay: 0.09, sweep: 0.05 }); burst(c, t, { type: 'lowpass', f: 900, gain: 0.12, decay: 0.03 }); },
    // the spark of a gas ring: a few quick ticks, then the soft whump of it catching
    ignite() { const c = start(), t = c.currentTime; for (let i = 0; i < 4; i++) burst(c, t + i * 0.07, { f: 5000, gain: 0.25, decay: 0.012 }); burst(c, t + 0.3, { type: 'lowpass', f: 500, gain: 0.3, decay: 0.18 }); },
    // toast coming up
    pop() { const c = start(), t = c.currentTime; tone(c, t, { f0: 320, f1: 110, gain: 0.4, decay: 0.12, sweep: 0.06 }); burst(c, t, { f: 1800, gain: 0.25, decay: 0.03 }); tone(c, t + 0.02, { f0: 1900, gain: 0.05, decay: 0.3 }); },
    // the microwave's bell
    ding() { const c = start(), t = c.currentTime; tone(c, t, { f0: 1568, gain: 0.3, decay: 1.6 }); tone(c, t, { f0: 3136, gain: 0.08, decay: 0.9 }); tone(c, t, { f0: 4710, gain: 0.03, decay: 0.4 }); },
    // a copper pan knocked on its hook: a few partials that do not line up, as a bell's do not
    clang(hz = 500) { const c = start(), t = c.currentTime; [[1, 0.3, 1.3], [2.76, 0.16, 0.8], [5.4, 0.08, 0.45], [8.93, 0.04, 0.25]].forEach(([r, gain, decay]) => tone(c, t, { f0: hz * r, gain, decay })); burst(c, t, { f: 3000, gain: 0.15, decay: 0.02 }); },
    // a wok tossed over the flame
    toss() { const c = start(), t = c.currentTime; burst(c, t, { f: 3000, gain: 0.35, decay: 0.7 }); burst(c, t + 0.45, { type: 'bandpass', f: 1200, gain: 0.2, decay: 0.12 }); },
    // a switch
    click() { const c = start(), t = c.currentTime; burst(c, t, { f: 2500, gain: 0.25, decay: 0.015 }); tone(c, t, { f0: 900, f1: 600, gain: 0.08, decay: 0.03, sweep: 0.02, type: 'square' }); },
  };
};
