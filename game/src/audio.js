// audio.js — semua bunyi Dapur Kilat disintesis dengan WebAudio, tanpa file suara.
// AudioContext dibuat hanya setelah gestur pertama pemain (aturan autoplay browser).

let ctx = null;
let muted = false;
let sizzleNodes = null;
let unlocked = false; // AudioContext hanya dibuat setelah gestur pemain (aturan autoplay).

function audioContext() {
  if (!unlocked) return null;
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

export function unlockAudio() {
  unlocked = true;
  const c = audioContext();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

export function toggleMute() {
  muted = !muted;
  if (muted) stopSizzle();
  return muted;
}

export function isMuted() {
  return muted;
}

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  if (muted) return;
  const c = audioContext();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo !== null) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst(dur, vol, freq) {
  if (muted) return;
  const c = audioContext();
  if (!c) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

/** Bunyi pisau memotong: ketukan tajam. */
export function playChop() {
  noiseBurst(0.07, 0.5, 2400);
  tone(190, 0.06, 'square', 0.12, 0, 90);
}

/** Bunyi mengambil bahan / menaruh piring: ketukan lembut. */
export function playPickup() {
  tone(520, 0.08, 'sine', 0.16, 0, 700);
}

/** Bunyi pesanan baru masuk: dua nada lonceng kecil. */
export function playOrderIn() {
  tone(880, 0.12, 'sine', 0.16);
  tone(1174, 0.16, 'sine', 0.16, 0.11);
}

/** Bunyi hidangan matang: denting. */
export function playCooked() {
  tone(1046, 0.1, 'triangle', 0.18);
  tone(1568, 0.18, 'triangle', 0.14, 0.09);
}

/** Bunyi sajian berhasil: arpeggio ceria. */
export function playServe(combo) {
  const base = [523, 659, 784, 1046];
  base.forEach((f, i) => tone(f, 0.16, 'triangle', 0.18, i * 0.07));
  if (combo >= 2) tone(1318, 0.22, 'triangle', 0.16, 0.3);
}

/** Bunyi pesanan hangus / gagal: nada rendah. */
export function playFail() {
  tone(220, 0.28, 'sawtooth', 0.12, 0, 130);
}

/** Bunyi klik tombol / mulai: blip hangat. */
export function playClick() {
  tone(660, 0.07, 'sine', 0.14, 0, 880);
}

/** Desis kompor yang sedang memasak: noise loop pelan, dihentikan saat tidak ada yang dimasak. */
export function startSizzle() {
  if (muted || sizzleNodes) return;
  const c = audioContext();
  if (!c) return;
  const len = c.sampleRate * 1;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3800;
  const gain = c.createGain();
  gain.gain.value = 0.045;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
  sizzleNodes = { src, gain };
}

export function stopSizzle() {
  if (!sizzleNodes) return;
  try { sizzleNodes.src.stop(); } catch (e) { /* sudah berhenti */ }
  sizzleNodes = null;
}
