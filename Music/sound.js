/* Sound for the music room, made in the browser with Web Audio: nothing is recorded and no files are loaded.
   makeSound() returns { piano(midi), pluck(hz) }. The audio context is only created on the first note, after a click. */
window.makeSound = function () {
  let ctx = null, out = null; const strings = {};
  function start() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor(); out = ctx.createGain(); out.gain.value = 0.5; out.connect(comp); comp.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
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
    pluck(hz, when = 0) {
      const c = start();
      if (!strings[hz]) { const sr = c.sampleRate, len = Math.round(sr * 3), n = Math.round(sr / hz), b = c.createBuffer(1, len, sr), d = b.getChannelData(0);
        let last = 0; for (let i = 0; i < n; i++) { last = 0.55 * last + 0.45 * (Math.random() * 2 - 1); d[i] = last; }
        for (let i = n; i < len; i++) d[i] = 0.4985 * (d[i - n] + d[i - n + 1]);
        strings[hz] = b; }
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = strings[hz]; g.gain.value = 0.9; s.connect(g); g.connect(out); s.start(c.currentTime + when);
    },
  };
};
