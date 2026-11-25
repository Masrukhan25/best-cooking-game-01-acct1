// kitchen.js — dapur Dapur Kilat: gerak koki, tabrakan dengan meja, dan semua interaksi
// stasiun (ambil bahan, potong, masak, rakit piring, sajikan, buang). Logika murni, tanpa gambar.

import {
  BOARD_H, CANVAS_W, CANVAS_H, STATIONS, BURNERS,
  CHOP_SECONDS, COOK_SECONDS, BURN_SECONDS, INGREDIENTS,
} from './data.js';

const PLAYER_R = 26;
const PLAYER_SPEED = 265;
const INTERACT_DIST = 108;

// Semua persegi padat yang tidak bisa ditembus koki.
function solidRects() {
  const rects = [];
  for (const b of STATIONS.bins) rects.push(b);
  rects.push(STATIONS.board, STATIONS.stove, STATIONS.plating, STATIONS.plates, STATIONS.serve, STATIONS.trash);
  return rects;
}

export function createKitchen() {
  return {
    player: { x: 640, y: 480, dir: 1, walk: 0, moving: false, target: null },
    carrying: null, // { ingredient, state } atau { plate: true, contents: [...] }
    board: { item: null, progress: 0 },
    burners: BURNERS.map(() => ({ item: null, progress: 0, burntIn: 0, done: false })),
    plating: { plate: null },
    platesLeft: 8,
    chopTick: 0,
    flash: null, // { text, x, y, t } pesan singkat di dapur
  };
}

function circleHitsRect(px, py, r, rect) {
  const cx = Math.max(rect.x, Math.min(px, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(py, rect.y + rect.h));
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy < r * r;
}

function distToRect(px, py, rect) {
  const cx = Math.max(rect.x, Math.min(px, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(py, rect.y + rect.h));
  return Math.hypot(px - cx, py - cy);
}

// Stasiun terdekat dari koki (untuk highlight + tombol aksi).
export function nearestStation(kitchen) {
  const p = kitchen.player;
  const all = [
    ...STATIONS.bins.map((b) => ({ ...b, label: INGREDIENTS[b.ingredient].name })),
    { ...STATIONS.board, label: 'Talenan' },
    { ...STATIONS.stove, label: 'Kompor' },
    { ...STATIONS.plating, label: 'Rakit Piring' },
    { ...STATIONS.plates, label: 'Piring Bersih' },
    { ...STATIONS.serve, label: 'Sajikan' },
    { ...STATIONS.trash, label: 'Tong Sampah' },
  ];
  let best = null;
  let bestD = Infinity;
  for (const s of all) {
    const d = distToRect(p.x, p.y, s);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return bestD <= INTERACT_DIST ? best : null;
}

function movePlayer(kitchen, input, dt) {
  const p = kitchen.player;
  const v = input.moveVector();
  const solids = solidRects();
  p.moving = false;
  if (v.x !== 0 || v.y !== 0) {
    p.target = null;
    p.moving = true;
    if (v.x !== 0) p.dir = v.x > 0 ? 1 : -1;
    stepAxis(kitchen, v.x * PLAYER_SPEED * dt, 0, solids);
    stepAxis(kitchen, 0, v.y * PLAYER_SPEED * dt, solids);
  } else if (p.target) {
    // Klik mouse: berjalan menuju titik klik sampai dekat.
    const dx = p.target.x - p.x;
    const dy = p.target.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d < 8) {
      p.target = null;
    } else {
      p.moving = true;
      p.dir = dx >= 0 ? 1 : -1;
      const nx = (dx / d) * PLAYER_SPEED * dt;
      const ny = (dy / d) * PLAYER_SPEED * dt;
      stepAxis(kitchen, nx, 0, solids);
      stepAxis(kitchen, 0, ny, solids);
    }
  }
  if (p.moving) p.walk += dt * 11;
  // Batas lantai: di bawah pita order board dan di dalam canvas.
  p.x = Math.max(PLAYER_R + 4, Math.min(CANVAS_W - PLAYER_R - 4, p.x));
  p.y = Math.max(BOARD_H + PLAYER_R + 6, Math.min(CANVAS_H - PLAYER_R - 4, p.y));
}

function stepAxis(kitchen, dx, dy, solids) {
  const p = kitchen.player;
  const nx = p.x + dx;
  const ny = p.y + dy;
  for (const r of solids) {
    if (circleHitsRect(nx, ny, PLAYER_R, r)) return;
  }
  p.x = nx;
  p.y = ny;
}

// Satu item makanan: { ingredient, state } — state: raw | chopped | cooked | burnt.
export function makeItem(ingredient, state = 'raw') {
  return { ingredient, state };
}

export function isPlate(carrying) {
  return carrying !== null && carrying.plate === true;
}

function useStation(kitchen, station, sounds, onServe) {
  const k = kitchen;
  if (!station) return;
  const ing = INGREDIENTS[station.ingredient];

  if (station.kind === 'bin') {
    if (!k.carrying) {
      k.carrying = makeItem(station.ingredient, 'raw');
      sounds.push('pickup');
    }
    return;
  }

  if (station.kind === 'plates') {
    if (!k.carrying && k.platesLeft > 0) {
      k.platesLeft -= 1;
      k.carrying = { plate: true, contents: [] };
      sounds.push('pickup');
    }
    return;
  }

  if (station.kind === 'board') {
    if (!k.board.item && k.carrying && !isPlate(k.carrying) && INGREDIENTS[k.carrying.ingredient].chop && k.carrying.state === 'raw') {
      k.board.item = k.carrying;
      k.board.progress = 0;
      k.carrying = null;
      sounds.push('pickup');
    } else if (k.board.item && !k.carrying) {
      k.carrying = k.board.item;
      k.board.item = null;
      k.board.progress = 0;
      sounds.push('pickup');
    }
    return;
  }

  if (station.kind === 'stove') {
    // Cari tungku: yang kosong untuk menaruh, yang berisi untuk mengambil.
    if (k.carrying && !isPlate(k.carrying) && INGREDIENTS[k.carrying.ingredient].cook && (k.carrying.state === 'raw' || k.carrying.state === 'chopped')) {
      const free = k.burners.find((b) => b.item === null);
      if (free) {
        free.item = k.carrying;
        free.progress = 0;
        free.burntIn = 0;
        free.done = false;
        k.carrying = null;
        sounds.push('pickup');
      }
      return;
    }
    if (!k.carrying) {
      const full = k.burners.find((b) => b.item !== null);
      if (full) {
        k.carrying = full.item;
        full.item = null;
        full.progress = 0;
        full.burntIn = 0;
        full.done = false;
        sounds.push('pickup');
      }
    }
    return;
  }

  if (station.kind === 'plating') {
    if (!k.plating.plate && isPlate(k.carrying)) {
      k.plating.plate = k.carrying;
      k.carrying = null;
      sounds.push('pickup');
      return;
    }
    if (k.plating.plate && k.carrying && !isPlate(k.carrying)) {
      const plate = k.plating.plate;
      const part = { ingredient: k.carrying.ingredient, state: k.carrying.state };
      const already = plate.contents.some((c) => c.ingredient === part.ingredient && c.state === part.state);
      if (!already) {
        plate.contents.push(part);
        k.carrying = null;
        sounds.push('pickup');
      } else {
        k.flash = { text: 'Sudah ada di piring!', x: station.x + station.w / 2, y: station.y - 14, t: 1.2 };
      }
      return;
    }
    if (k.plating.plate && !k.carrying) {
      k.carrying = k.plating.plate;
      k.plating.plate = null;
      sounds.push('pickup');
    }
    return;
  }

  if (station.kind === 'serve') {
    if (isPlate(k.carrying)) {
      const result = onServe(k.carrying.contents);
      if (result === 'ok') {
        k.carrying = null;
        k.platesLeft += 1;
      } else if (result === 'wrong') {
        k.flash = { text: 'Tidak cocok dengan pesanan!', x: station.x + station.w / 2, y: station.y - 14, t: 1.4 };
        sounds.push('fail');
      }
    }
    return;
  }

  if (station.kind === 'trash') {
    if (k.carrying) {
      if (isPlate(k.carrying)) k.platesLeft += 1;
      k.carrying = null;
      sounds.push('pickup');
    }
  }
}

// Update dapur satu frame. Mengembalikan daftar nama bunyi yang harus dimainkan.
export function updateKitchen(kitchen, input, dt, onServe) {
  const sounds = [];
  movePlayer(kitchen, input, dt);

  // Klik mouse: klik stasiun terdekat = pakai; klik lantai = berjalan ke sana.
  const click = input.takeClick();
  if (click) {
    const station = nearestStation(kitchen);
    const hit = station && click.x >= station.x - 8 && click.x <= station.x + station.w + 8
      && click.y >= station.y - 8 && click.y <= station.y + station.h + 8;
    if (hit) {
      useStation(kitchen, station, sounds, onServe);
    } else {
      kitchen.player.target = { x: click.x, y: click.y };
    }
  }
  if (input.actionPressed()) {
    const station = nearestStation(kitchen);
    useStation(kitchen, station, sounds, onServe);
  }

  // Memotong otomatis selama koki berdiri di talenan dengan bahan yang bisa dipotong.
  const near = nearestStation(kitchen);
  if (near && near.kind === 'board' && kitchen.board.item
    && INGREDIENTS[kitchen.board.item.ingredient].chop && kitchen.board.item.state === 'raw' && !kitchen.carrying) {
    kitchen.board.progress += dt / CHOP_SECONDS;
    kitchen.chopTick += dt;
    if (kitchen.chopTick > 0.32) {
      kitchen.chopTick = 0;
      sounds.push('chop');
    }
    if (kitchen.board.progress >= 1) {
      kitchen.board.item.state = 'chopped';
      kitchen.board.progress = 0;
      sounds.push('cooked');
    }
  } else {
    kitchen.board.progress = 0;
  }

  // Memasak di tungku berjalan sendiri; matang lalu bisa gosong.
  let cooking = false;
  for (const b of kitchen.burners) {
    if (!b.item) continue;
    cooking = true;
    if (!b.done) {
      b.progress += dt / COOK_SECONDS;
      if (b.progress >= 1) {
        b.progress = 1;
        b.done = true;
        b.item.state = 'cooked';
        b.burntIn = 0;
        sounds.push('cooked');
      }
    } else if (b.item.state === 'cooked') {
      b.burntIn += dt;
      if (b.burntIn >= BURN_SECONDS) {
        b.item.state = 'burnt';
        sounds.push('fail');
      }
    }
  }
  kitchen.cooking = cooking;

  if (kitchen.flash) {
    kitchen.flash.t -= dt;
    if (kitchen.flash.t <= 0) kitchen.flash = null;
  }
  return sounds;
}
