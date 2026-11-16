/* Sound for the music room, made in the browser with Web Audio: nothing is recorded and no files are loaded.
   makeSound() returns { piano(midi), pluck(hz, when, voice), drum(name) }. The audio context is only created on the first note, after a click. */
window.makeSound = function () {
  let ctx = null, out = null, noiseBuf = null; const strings = {}, chains = {};
  function start() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor(); out = ctx.createGain(); out.gain.value = 0.5; out.connect(comp); comp.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* -------------------------------------------------------------- strings */
  // smooth: how dull the first pluck is; damp: how slowly the string dies away (0.5 never does)
  const VOICES = { acoustic: { smooth: 0.55, damp: 0.4985, gain: 0.9, secs: 3 }, electric: { smooth: 0.2, damp: 0.4993, gain: 0.55, secs: 4 }, bass: { smooth: 0.5, damp: 0.4996, gain: 1.1, secs: 4 } };
  function chain(c, voice) {   // where a voice's strings go before the speakers: the electric through a small overdriven amp
    if (chains[voice]) return chains[voice];
    if (voice === 'electric') {
      const drive = c.createWaveShaper(), curve = new Float32Array(1024), k = 2.6; for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; curve[i] = Math.tanh(k * x) / Math.tanh(k); }
      drive.curve = curve; drive.oversample = '2x';
      const cab = c.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = 4200; cab.Q.value = 0.9;
      drive.connect(cab); cab.connect(out); return chains[voice] = drive;
    }
    if (voice === 'bass') { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(out); return chains[voice] = lp; }
    return chains[voice] = out;
  }

  /* ---------------------------------------------------------------- drums */
  const noise = c => { if (!noiseBuf) { const n = c.sampleRate * 2; noiseBuf = c.createBuffer(1, n, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; } return noiseBuf; };
  const env = (c, t, gain, decay, attack = 0.001) => { const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + decay); g.connect(out); return g; };
  function burst(c, t, { type = 'highpass', f = 1000, q = 0.7, gain = 0.5, decay = 0.2 }) {   // filtered noise
    const s = c.createBufferSource(), fl = c.createBiquadFilter(); s.buffer = noise(c); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    s.connect(fl); fl.connect(env(c, t, gain, decay)); s.start(t, Math.random() * 1.5); s.stop(t + decay + 0.05);
  }
  function thump(c, t, { f0, f1, gain, decay, sweep = 0.1, type = 'sine' }) {   // a tone that falls in pitch, as a struck skin does
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    o.connect(env(c, t, gain, decay, 0.002)); o.start(t); o.stop(t + decay + 0.05);
  }
  function metal(c, t, { gain, decay, f }) {   // six clashing square waves through a band-pass: the old drum-machine way to make a cymbal
    const bp = c.createBiquadFilter(), hp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 0.6; hp.type = 'highpass'; hp.frequency.value = f * 0.7;
    bp.connect(hp); hp.connect(env(c, t, gain, decay, 0.002));
    for (const r of [2, 3, 4.16, 5.43, 6.79, 8.21]) { const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 40 * r; o.connect(bp); o.start(t); o.stop(t + decay + 0.05); }
  }
  const DRUMS = {
    kick: (c, t) => { thump(c, t, { f0: 140, f1: 44, gain: 1, decay: 0.45, sweep: 0.11 }); burst(c, t, { type: 'lowpass', f: 2500, gain: 0.25, decay: 0.02 }); },
    snare: (c, t) => { thump(c, t, { f0: 240, f1: 170, gain: 0.45, decay: 0.12, sweep: 0.05, type: 'triangle' }); burst(c, t, { f: 1800, gain: 0.55, decay: 0.22 }); },
    hat: (c, t) => { metal(c, t, { gain: 0.2, decay: 0.07, f: 10000 }); burst(c, t, { f: 8000, gain: 0.14, decay: 0.05 }); },
    tom1: (c, t) => { thump(c, t, { f0: 270, f1: 175, gain: 0.8, decay: 0.45, sweep: 0.2 }); burst(c, t, { type: 'lowpass', f: 1200, gain: 0.12, decay: 0.05 }); },
    tom2: (c, t) => { thump(c, t, { f0: 210, f1: 135, gain: 0.85, decay: 0.5, sweep: 0.22 }); burst(c, t, { type: 'lowpass', f: 1000, gain: 0.12, decay: 0.05 }); },
    floor: (c, t) => { thump(c, t, { f0: 140, f1: 88, gain: 0.95, decay: 0.75, sweep: 0.28 }); burst(c, t, { type: 'lowpass', f: 800, gain: 0.14, decay: 0.06 }); },
    crash: (c, t) => { metal(c, t, { gain: 0.2, decay: 1.9, f: 8000 }); burst(c, t, { f: 5000, gain: 0.26, decay: 1.6 }); },
    ride: (c, t) => { metal(c, t, { gain: 0.15, decay: 1.2, f: 9500 }); burst(c, t, { f: 6500, gain: 0.07, decay: 0.8 }); thump(c, t, { f0: 640, f1: 620, gain: 0.05, decay: 0.6 }); },
    cajonBass: (c, t) => { thump(c, t, { f0: 115, f1: 62, gain: 0.9, decay: 0.3, sweep: 0.05 }); burst(c, t, { type: 'lowpass', f: 450, gain: 0.22, decay: 0.08 }); },
    cajonSlap: (c, t) => { burst(c, t, { type: 'bandpass', f: 2600, q: 0.8, gain: 0.55, decay: 0.09 }); burst(c, t, { f: 3500, gain: 0.22, decay: 0.18 }); thump(c, t, { f0: 300, f1: 220, gain: 0.2, decay: 0.06, type: 'triangle' }); },
  };

  return {
    // a struck string: a handful of slightly sharp partials that ring down, the high ones fastest
    piano(midi) {
      const c = start(), t = c.currentTime, f = 440 * Math.pow(2, (midi - 69) / 12), long = Math.max(0.7, 4.2 - (midi - 21) * 0.04);
      const tone = c.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.setValueAtTime(Math.min(9000, f * 9), t); tone.frequency.exponentialRampToValueAtTime(Math.min(4000, f * 3.2), t + long * 0.6); tone.connect(out);
      [1, 0.5, 0.28, 0.16, 0.09, 0.05].forEach((a, i) => { const n = i + 1, fn = f * n * Math.sqrt(1 + 0.0004 * n * n); if (fn > 15000) return;
        const o = c.createOscillator(), g = c.createGain(), d = long / (1 + i * 0.55); o.type = i ? 'sine' : 'triangle'; o.frequency.value = fn;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a * 0.3, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0002, t + d);
        o.connect(g); g.connect(tone); o.start(t); o.stop(t + d + 0.05); });
    },
    // a plucked string (Karplus-Strong): a burst of noise going round a delay as long as one cycle, losing a little each time
    pluck(hz, when = 0, voice = 'acoustic') {
      const c = start(), v = VOICES[voice] || VOICES.acoustic, key = voice + hz;
      if (!strings[key]) { const sr = c.sampleRate, len = Math.round(sr * v.secs), n = Math.round(sr / hz), b = c.createBuffer(1, len, sr), d = b.getChannelData(0);
        let last = 0; for (let i = 0; i < n; i++) { last = v.smooth * last + (1 - v.smooth) * (Math.random() * 2 - 1); d[i] = last; }
        for (let i = n; i < len; i++) d[i] = v.damp * (d[i - n] + d[i - n + 1]);
        strings[key] = b; }
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = strings[key]; g.gain.value = v.gain; s.connect(g); g.connect(chain(c, voice)); s.start(c.currentTime + when);
    },
    drum(name) { const c = start(); if (DRUMS[name]) DRUMS[name](c, c.currentTime); },
  };
};
