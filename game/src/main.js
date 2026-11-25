// main.js — titik masuk Dapur Kilat: loop game, mesin status, dan adegan screenshot (?shot=1..4).
// Semua adegan screenshot dibangun dari state permainan yang sama — bukan gambar tempelan.

import { CANVAS_W, CANVAS_H, SHIFT_SECONDS, MAX_MISSED, RECIPES } from './data.js';
import { createInput } from './input.js';
import { createKitchen, updateKitchen, nearestStation, isPlate } from './kitchen.js';
import { createOrders, updateOrders, servePlate, updatePopups, plateMatchesOrder } from './orders.js';
import { render, createParticles, spawnSteam, spawnSparkles, spawnChopBits, updateParticles } from './render.js';
import {
  unlockAudio, toggleMute, playChop, playPickup, playOrderIn, playCooked,
  playServe, playFail, playClick, startSizzle, stopSizzle,
} from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Jejak error untuk pengujian headless: window.__gameErrors terisi bila ada yang gagal.
window.__gameErrors = [];
window.addEventListener('error', (e) => {
  window.__gameErrors.push(String(e.message || e.error || 'unknown error'));
});

function freshGame() {
  return {
    screen: 'title',
    kitchen: createKitchen(),
    orders: createOrders(),
    particles: createParticles(),
    elapsed: 0,
    shiftLeft: SHIFT_SECONDS,
    best: 0,
    nearStation: null,
    helpers: { plateMatchesOrder },
    startedAt: 0,
  };
}

const game = freshGame();

function playSound(name) {
  if (name === 'chop') playChop();
  else if (name === 'pickup') playPickup();
  else if (name === 'cooked') playCooked();
  else if (name === 'fail') playFail();
}

function startShift() {
  const best = game.best;
  const fresh = freshGame();
  fresh.best = best;
  Object.assign(game, fresh);
  game.screen = 'playing';
  playClick();
}

function endShift() {
  game.screen = 'results';
  if (game.orders.score > game.best) game.best = game.orders.score;
  stopSizzle();
  playFail();
}

function onServe(contents) {
  const result = servePlate(game.orders, contents);
  if (result.result === 'ok') {
    playServe(game.orders.combo);
    spawnSparkles(game.particles, 1162, 220, '#f2b705');
    spawnSparkles(game.particles, 1162, 260, '#e4572e');
    return 'ok';
  }
  return 'wrong';
}

const input = createInput(canvas);

// ---------------------------------------------------------------- adegan screenshot

function orderWith(recipeId, timeLeft) {
  const recipe = RECIPES[recipeId];
  return { id: 0, recipe, timeLeft, total: 75, born: 0 };
}

// ?shot=1..4 menyiapkan satu momen permainan yang padat dan terbaca untuk screenshot.
function setupShot(n) {
  game.screen = 'playing';
  game.elapsed = 65;
  if (n === 1) {
    // COVER: dapur penuh — 3 pesanan, piring nasi goreng lengkap siap saji, kompor berasap.
    game.orders.score = 1240;
    game.orders.combo = 3;
    game.orders.bestCombo = 3;
    game.orders.served = 6;
    game.shiftLeft = 135;
    game.orders.list = [
      Object.assign(orderWith('nasiGoreng', 42), { id: 7 }),
      Object.assign(orderWith('mieGoreng', 58), { id: 8 }),
      Object.assign(orderWith('ayamGeprek', 24), { id: 9 }),
    ];
    game.kitchen.player.x = 790;
    game.kitchen.player.y = 300;
    game.kitchen.player.dir = -1;
    game.kitchen.plating.plate = {
      plate: true,
      contents: [
        { ingredient: 'nasi', state: 'cooked' },
        { ingredient: 'telur', state: 'cooked' },
        { ingredient: 'cabai', state: 'chopped' },
      ],
    };
    game.kitchen.board.item = { ingredient: 'cabai', state: 'raw' };
    game.kitchen.board.progress = 0.6;
    game.kitchen.burners[0].item = { ingredient: 'mie', state: 'raw' };
    game.kitchen.burners[0].progress = 0.55;
    game.kitchen.burners[1].item = { ingredient: 'telur', state: 'cooked' };
    game.kitchen.burners[1].progress = 1;
    game.kitchen.burners[1].done = true;
    for (let i = 0; i < 10; i++) spawnSteam(game.particles, 498 + (i % 2) * 120, 140);
    spawnSparkles(game.particles, 790, 120, '#f2b705');
  } else if (n === 2) {
    game.screen = 'title';
    game.best = 1240;
  } else if (n === 3) {
    // AKSI: memotong ayam di talenan + nasi dimasak berasap.
    game.orders.score = 480;
    game.orders.combo = 1;
    game.orders.served = 2;
    game.shiftLeft = 148;
    game.orders.list = [
      Object.assign(orderWith('ayamGeprek', 51), { id: 4 }),
      Object.assign(orderWith('sotoAyam', 66), { id: 5 }),
    ];
    game.kitchen.player.x = 300;
    game.kitchen.player.y = 300;
    game.kitchen.player.dir = 1;
    game.kitchen.board.item = { ingredient: 'ayam', state: 'raw' };
    game.kitchen.board.progress = 0.7;
    game.kitchen.burners[0].item = { ingredient: 'nasi', state: 'raw' };
    game.kitchen.burners[0].progress = 0.7;
    game.kitchen.burners[1].item = { ingredient: 'ayam', state: 'chopped' };
    game.kitchen.burners[1].progress = 0.3;
    for (let i = 0; i < 8; i++) spawnSteam(game.particles, 498, 140);
    spawnChopBits(game.particles, 280, 160);
  } else if (n === 4) {
    // SAJI: piring mie goreng lengkap di tangan koki di depan jendela saji.
    game.orders.score = 860;
    game.orders.combo = 2;
    game.orders.bestCombo = 2;
    game.orders.served = 4;
    game.shiftLeft = 96;
    game.orders.list = [
      Object.assign(orderWith('nasiGoreng', 33), { id: 6 }),
      Object.assign(orderWith('sotoAyam', 49), { id: 7 }),
    ];
    game.orders.popups.push({ text: '+185', x: 1162, y: 330, t: 1.6, color: '#f2b705', big: true });
    game.orders.popups.push({ text: 'KOMBO x2!', x: 1162, y: 366, t: 1.6, color: '#e4572e', big: false });
    game.kitchen.player.x = 1010;
    game.kitchen.player.y = 320;
    game.kitchen.player.dir = 1;
    game.kitchen.carrying = {
      plate: true,
      contents: [
        { ingredient: 'mie', state: 'cooked' },
        { ingredient: 'telur', state: 'cooked' },
        { ingredient: 'sayur', state: 'chopped' },
      ],
    };
    game.kitchen.burners[0].item = { ingredient: 'nasi', state: 'cooked' };
    game.kitchen.burners[0].progress = 1;
    game.kitchen.burners[0].done = true;
    spawnSparkles(game.particles, 1162, 220, '#f2b705');
    spawnSparkles(game.particles, 1108, 246, '#e4572e');
    for (let i = 0; i < 6; i++) spawnSteam(game.particles, 498, 140);
  }
}

// ---------------------------------------------------------------- uji main otomatis

// ?selftest=1 memainkan satu putaran penuh lewat jalur input asli (tombol sintetis
// + posisi koki diatur langsung), lalu menulis hasilnya ke document.title agar
// bisa dibaca headless: SELFTEST OK <skor> atau SELFTEST FAIL <alasan>.
function runSelfTest() {
  const key = (k) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: k }));
  };
  const at = (x, y) => { game.kitchen.player.x = x; game.kitchen.player.y = y; game.kitchen.player.target = null; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // Tunggu beberapa frame render agar tombol sempat diproses loop game.
  const frames = (n) => new Promise((resolve) => {
    let left = n;
    const tick = () => { if (--left <= 0) resolve(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const waitFor = async (cond, ms, label) => {
    const t0 = performance.now();
    while (performance.now() - t0 < ms) {
      if (cond()) return true;
      await sleep(50);
    }
    throw new Error(`timeout: ${label}`);
  };
  const act = async (x, y) => { at(x, y); await frames(2); key('e'); await frames(3); };
  (async () => {
    try {
      await sleep(300);
      key('Enter');
      await waitFor(() => game.screen === 'playing', 5000, 'tidak mulai');
      // Pesanan pertama dipaksa jadi Nasi Telur supaya bisa disajikan.
      game.orders.list = [{ id: 99, recipe: RECIPES.nasiTelur, timeLeft: 120, total: 120, born: 0 }];
      game.orders.spawnIn = 999;
      // Ambil piring, taruh di meja rakit.
      await act(980, 260);
      if (!isPlate(game.kitchen.carrying)) throw new Error('gagal ambil piring');
      await act(790, 260);
      if (!game.kitchen.plating.plate) throw new Error('gagal taruh piring');
      // Nasi: ambil -> masak -> ambil matang -> rakit.
      await act(180, 162);
      if (!game.kitchen.carrying) throw new Error('gagal ambil nasi');
      await act(520, 260);
      if (game.kitchen.carrying) throw new Error('gagal taruh nasi di kompor');
      await waitFor(() => game.kitchen.burners[0].item && game.kitchen.burners[0].item.state === 'cooked', 9000, 'nasi matang');
      await act(520, 260);
      if (!game.kitchen.carrying) throw new Error('gagal ambil nasi matang');
      await act(790, 260);
      if (game.kitchen.carrying) throw new Error('gagal rakit nasi');
      // Telur: ambil -> masak -> ambil matang -> rakit.
      await act(180, 330);
      await act(520, 260);
      await waitFor(() => game.kitchen.burners[0].item && game.kitchen.burners[0].item.state === 'cooked', 9000, 'telur matang');
      await act(520, 260);
      await act(790, 260);
      if (game.kitchen.carrying) throw new Error('gagal rakit telur');
      // Angkat piring lengkap, sajikan.
      await act(790, 260);
      if (!isPlate(game.kitchen.carrying)) throw new Error('gagal angkat piring');
      await act(1160, 340);
      if (game.orders.served !== 1 || game.orders.score <= 0) throw new Error('saji gagal / skor 0');
      // Potong ayam di talenan sampai jadi potongan.
      await act(180, 414);
      await act(280, 260);
      await waitFor(() => game.kitchen.board.item && game.kitchen.board.item.state === 'chopped', 5000, 'ayam terpotong');
      document.title = `SELFTEST OK score=${game.orders.score} served=${game.orders.served}`;
    } catch (e) {
      document.title = `SELFTEST FAIL ${e.message}`;
    }
  })();
}

let last = performance.now();
let shotDone = false;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;

  if (input.mutePressed()) toggleMute();
  if (input.actionPressed() || input.enterPressed()) unlockAudio();

  if (game.screen === 'title') {
    if (input.enterPressed() || input.actionPressed() || input.takeClick()) startShift();
  } else if (game.screen === 'playing') {
    game.elapsed += dt;
    game.shiftLeft -= dt;
    const sounds = updateKitchen(game.kitchen, input, dt, onServe);
    sounds.forEach(playSound);
    game.nearStation = nearestStation(game.kitchen);
    const event = updateOrders(game.orders, dt, game.elapsed);
    if (event === 'orderIn') playOrderIn();
    else if (event === 'missed') playFail();
    updatePopups(game.orders, dt);
    // Uap dari tungku yang sedang memasak.
    game.kitchen.burners.forEach((b, i) => {
      if (b.item && Math.random() < dt * 7) {
        const bx = i === 0 ? 498 : 618;
        spawnSteam(game.particles, bx, 138);
      }
    });
    if (game.kitchen.cooking) startSizzle();
    else stopSizzle();
    updateParticles(game.particles, dt);
    if (game.shiftLeft <= 0 || game.orders.missed >= MAX_MISSED) endShift();
  } else if (game.screen === 'results') {
    if (input.wasPressed('r') || input.enterPressed() || input.takeClick()) startShift();
  }

  render(ctx, game, t);
  input.endFrame();
  window.__gameReady = true;
  requestAnimationFrame(frame);
}

// Adegan screenshot: siapkan sebelum loop pertama supaya frame pertama sudah lengkap.
const params = new URLSearchParams(window.location.search);
const shot = parseInt(params.get('shot') || '0', 10);
if (shot >= 1 && shot <= 4) {
  setupShot(shot);
  shotDone = true;
}
if (params.get('selftest') === '1') runSelfTest();

canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
requestAnimationFrame(frame);
