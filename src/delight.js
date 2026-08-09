// Small interaction delight: a synthesized analog "ticker" click + light haptics.
// No audio asset — the tick is built with the Web Audio API so it stays crisp and
// can be pitch-jittered slightly to feel mechanical rather than robotic.

let ctx = null;
let hasTapped = false;

function getContext() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

// Browsers keep the AudioContext suspended until a user gesture. Resume on the
// first pointer/key interaction so the very next hover can sound.
function primeAudio() {
  const c = getContext();
  if (!c) return;
  if (c.state === "suspended") c.resume();
}

if (typeof window !== "undefined") {
  // Hover can prime audio on desktop, but the Vibration API needs a genuine tap
  // (user activation) — a hover does not qualify. Track that separately so we
  // never call navigator.vibrate() before a real tap (which the browser blocks).
  const onTap = () => { primeAudio(); hasTapped = true; };
  window.addEventListener("pointerdown", onTap, { once: true, passive: true });
  window.addEventListener("keydown", onTap, { once: true });
  window.addEventListener("pointerover", () => primeAudio(), { once: true, passive: true });
}

// A single mechanical tick: a tight body tone plus a filtered noise transient,
// each with a very fast decay so it reads as a discrete "clack".
export function playTick({ pitch = 1 } = {}) {
  const c = getContext();
  if (!c) return;
  if (c.state === "suspended") c.resume(); // self-heal in Safari/Dia after a gesture

  const now = c.currentTime;
  const jitter = 0.94 + Math.random() * 0.12; // ±6% so repeats feel organic
  const freq = 1650 * pitch * jitter;

  // Body tone
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.03);
  const oscGain = c.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.16, now + 0.002);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
  osc.connect(oscGain);

  // Noise transient (the physical "click")
  const frames = Math.floor(c.sampleRate * 0.02);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2400;
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.09, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
  noise.connect(noiseFilter).connect(noiseGain);

  const master = c.createGain();
  master.gain.value = 0.9;
  oscGain.connect(master);
  noiseGain.connect(master);
  master.connect(c.destination);

  osc.start(now);
  osc.stop(now + 0.05);
  noise.start(now);
  noise.stop(now + 0.02);
}

// Light haptic pulse — supported on Android/Chrome; silently ignored elsewhere.
export function buzz(pattern = 8) {
  if (!hasTapped) return; // vibrate is blocked until the user taps once
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

// Convenience: the ticker feel for moving across list items.
export function tick(opts) {
  playTick(opts);
  buzz(8);
}

// A soft airy swoosh — for the photos fanning out of the folder. Filtered noise
// with a bandpass that sweeps up then settles, under a swell-and-fade envelope.
export function swoosh() {
  const c = getContext();
  if (!c) return;
  if (c.state === "suspended") c.resume(); // self-heal in Safari/Dia after a gesture

  const now = c.currentTime;
  const dur = 0.34;

  // White-noise body
  const frames = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  // Bandpass sweep up then back down => the "whoosh" motion
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.85;
  band.frequency.setValueAtTime(480, now);
  band.frequency.exponentialRampToValueAtTime(2600, now + 0.13);
  band.frequency.exponentialRampToValueAtTime(720, now + dur);

  // Keep it airy, trim the low rumble
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 320;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.12, now + 0.08); // swell in
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur); // fade out

  noise.connect(hp).connect(band).connect(g).connect(c.destination);
  noise.start(now);
  noise.stop(now + dur);

  buzz([6, 34, 6, 34, 6]);
}
