// orders.js — pesanan Dapur Kilat: spawn tiket, timer, pencocokan piring, skor dan kombo.

import {
  MAX_ORDERS, ORDER_SECONDS, ORDER_SPAWN_START, ORDER_SPAWN_MIN, RECIPE_LIST,
} from './data.js';

export function createOrders() {
  return {
    list: [], // { id, recipe, timeLeft, total, born }
    nextId: 1,
    spawnIn: 2.5, // pesanan pertama cepat masuk
    served: 0,
    missed: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    earned: 0, // koin yang diraih shift ini
    popups: [], // { text, x, y, t, color } teks melayang
  };
}

function pickRecipe(elapsed) {
  // Awal shift: resep 2 komponen dulu; makin lama, resep 3 komponen ikut masuk.
  const pool = elapsed < 40 ? RECIPE_LIST.filter((r) => r.parts.length === 2) : RECIPE_LIST;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnInterval(elapsed) {
  // Jeda spawn mengecil seiring shift memanas: 13 dtk -> 8 dtk.
  const t = Math.min(1, elapsed / 120);
  return ORDER_SPAWN_START + (ORDER_SPAWN_MIN - ORDER_SPAWN_START) * t;
}

export function updateOrders(orders, dt, elapsed) {
  orders.spawnIn -= dt;
  if (orders.spawnIn <= 0 && orders.list.length < MAX_ORDERS) {
    const recipe = pickRecipe(elapsed);
    const total = ORDER_SECONDS;
    orders.list.push({
      id: orders.nextId++,
      recipe,
      timeLeft: total,
      total,
      born: elapsed,
    });
    orders.spawnIn = spawnInterval(elapsed);
    return 'orderIn';
  }
  // Timer tiap tiket berjalan; yang habis = hangus.
  let missed = false;
  for (let i = orders.list.length - 1; i >= 0; i--) {
    const o = orders.list[i];
    o.timeLeft -= dt;
    if (o.timeLeft <= 0) {
      orders.list.splice(i, 1);
      orders.missed += 1;
      orders.combo = 0;
      missed = true;
    }
  }
  return missed ? 'missed' : null;
}

// Apakah isi piring sama persis dengan komponen resep (urutan bebas)?
export function plateMatchesOrder(contents, recipe) {
  if (contents.length !== recipe.parts.length) return false;
  const key = (c) => `${c.ingredient}:${c.state}`;
  const have = contents.map(key).sort().join('|');
  const want = recipe.parts.map(key).sort().join('|');
  return have === want;
}

// Sajikan piring: kembalikan 'ok' + poin, atau 'wrong' bila tidak cocok dengan pesanan mana pun.
export function servePlate(orders, contents) {
  let best = null;
  let bestLeft = -1;
  for (const o of orders.list) {
    if (plateMatchesOrder(contents, o.recipe) && o.timeLeft > bestLeft) {
      best = o;
      bestLeft = o.timeLeft;
    }
  }
  if (!best) return { result: 'wrong', points: 0 };
  orders.list = orders.list.filter((o) => o !== best);
  const timeBonus = Math.round((best.timeLeft / best.total) * 50);
  const comboBonus = orders.combo * 15;
  const points = 100 + timeBonus + comboBonus;
  orders.score += points;
  orders.earned += points;
  orders.served += 1;
  orders.combo += 1;
  if (orders.combo > orders.bestCombo) orders.bestCombo = orders.combo;
  orders.popups.push({
    text: `+${points}`, x: 1162, y: 320, t: 1.6, color: '#f2b705', big: true,
  });
  if (orders.combo >= 2) {
    orders.popups.push({
      text: `KOMBO x${orders.combo}!`, x: 1162, y: 356, t: 1.6, color: '#e4572e', big: false,
    });
  }
  return { result: 'ok', points };
}

export function updatePopups(orders, dt) {
  for (let i = orders.popups.length - 1; i >= 0; i--) {
    const p = orders.popups[i];
    p.t -= dt;
    p.y -= 26 * dt;
    if (p.t <= 0) orders.popups.splice(i, 1);
  }
}
