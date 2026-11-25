// render.js — semua gambar Dapur Kilat digambar dengan canvas 2D (vector, tanpa aset eksternal).
// Palet hangat, makanan berlapis highlight/shadow, uap, dan HUD besar yang terbaca sekilas.

import { CANVAS_W, CANVAS_H, BOARD_H, PALETTE, INGREDIENTS, STATIONS, BURNERS, RECIPES } from './data.js';
import { isPlate } from './kitchen.js';

const FONT = '"Trebuchet MS", "Segoe UI", Verdana, sans-serif';

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function text(ctx, str, x, y, size, color, weight = '700', align = 'left', font = FONT) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------- makanan

// Gambar satu bahan pada titik (x, y), skala s (1 = sekitar 44px). state: raw|chopped|cooked|burnt.
export function drawIngredient(ctx, id, state, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (state === 'burnt') {
    ctx.fillStyle = '#241a12';
    ellipse(ctx, 0, 2, 20, 13);
    ctx.fill();
    ctx.fillStyle = '#3d2c1e';
    ellipse(ctx, -5, -3, 9, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,120,120,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -8);
    ctx.quadraticCurveTo(-8, -18, -3, -26);
    ctx.moveTo(5, -8);
    ctx.quadraticCurveTo(9, -18, 4, -27);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (id === 'nasi') {
    if (state === 'cooked') {
      ctx.fillStyle = '#f7c948';
      ellipse(ctx, 0, 4, 21, 12);
      ctx.fill();
      ctx.fillStyle = '#ffe9a8';
      ellipse(ctx, -3, -2, 16, 10);
      ctx.fill();
      ctx.fillStyle = '#fff3d6';
      ellipse(ctx, -2, -6, 10, 7);
      ctx.fill();
      ctx.fillStyle = '#e4572e';
      ctx.fillRect(-8, -9, 3, 3);
      ctx.fillRect(4, -10, 3, 3);
    } else {
      ctx.fillStyle = '#d9c39a';
      ellipse(ctx, 0, 5, 20, 11);
      ctx.fill();
      ctx.fillStyle = '#fff3d6';
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        ellipse(ctx, Math.cos(a) * 10, Math.sin(a) * 5 - 2, 4, 2.6);
        ctx.fill();
      }
    }
  } else if (id === 'mie') {
    ctx.strokeStyle = state === 'cooked' ? '#f4b942' : '#e8c25a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, 2, 6 + i * 4, Math.PI * (0.15 + i * 0.1), Math.PI * (0.85 + i * 0.08));
      ctx.stroke();
    }
    if (state === 'cooked') {
      ctx.fillStyle = '#e4572e';
      ctx.fillRect(-10, -8, 4, 4);
      ctx.fillStyle = '#5ba829';
      ctx.fillRect(6, -9, 4, 4);
    }
  } else if (id === 'telur') {
    if (state === 'cooked') {
      ctx.fillStyle = '#fffdf5';
      ellipse(ctx, 0, 2, 21, 14);
      ctx.fill();
      ctx.fillStyle = '#ffb703';
      ellipse(ctx, 1, 0, 10, 9);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      ellipse(ctx, -2, -3, 4, 3.5);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fffdf5';
      ellipse(ctx, 0, 0, 14, 19);
      ctx.fill();
      ctx.fillStyle = '#f1e3c8';
      ellipse(ctx, 0, 3, 11, 14);
      ctx.fill();
    }
  } else if (id === 'ayam') {
    if (state === 'chopped') {
      ctx.fillStyle = '#f2a594';
      rr(ctx, -18, -10, 16, 14, 4);
      ctx.fill();
      rr(ctx, 2, -6, 16, 14, 4);
      ctx.fill();
      rr(ctx, -8, 6, 16, 12, 4);
      ctx.fill();
      ctx.fillStyle = '#d97b63';
      ctx.fillRect(-14, -6, 4, 4);
      ctx.fillRect(8, 0, 4, 4);
    } else if (state === 'cooked') {
      ctx.fillStyle = '#c67b3c';
      ellipse(ctx, -4, 2, 15, 12);
      ctx.fill();
      ctx.fillStyle = '#e09a52';
      ellipse(ctx, -6, -3, 10, 8);
      ctx.fill();
      ctx.strokeStyle = '#fff6e5';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(10, -2);
      ctx.lineTo(20, -10);
      ctx.stroke();
      ctx.fillStyle = '#fff6e5';
      ellipse(ctx, 22, -12, 4, 4);
      ctx.fill();
    } else {
      ctx.fillStyle = '#f2a594';
      ellipse(ctx, -4, 2, 15, 12);
      ctx.fill();
      ctx.fillStyle = '#f7c4b5';
      ellipse(ctx, -6, -3, 9, 7);
      ctx.fill();
      ctx.strokeStyle = '#fff6e5';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(10, -2);
      ctx.lineTo(20, -10);
      ctx.stroke();
      ctx.fillStyle = '#fff6e5';
      ellipse(ctx, 22, -12, 4, 4);
      ctx.fill();
    }
  } else if (id === 'sayur') {
    if (state === 'chopped') {
      ctx.fillStyle = '#6ab04c';
      rr(ctx, -18, -8, 15, 12, 3);
      ctx.fill();
      rr(ctx, 3, -10, 15, 12, 3);
      ctx.fill();
      rr(ctx, -8, 4, 15, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#8bc34a';
      ctx.fillRect(-14, -4, 5, 4);
      ctx.fillRect(8, -6, 5, 4);
    } else {
      ctx.fillStyle = '#5ba829';
      ellipse(ctx, -8, 0, 11, 16);
      ctx.fill();
      ctx.fillStyle = '#6ab04c';
      ellipse(ctx, 8, -2, 11, 15);
      ctx.fill();
      ctx.strokeStyle = '#3f7d1c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.lineTo(-8, 12);
      ctx.moveTo(8, -15);
      ctx.lineTo(8, 11);
      ctx.stroke();
    }
  } else if (id === 'cabai') {
    if (state === 'chopped') {
      ctx.strokeStyle = '#d62828';
      ctx.lineWidth = 5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * 11, 0, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#ffb703';
      ellipse(ctx, -11, 0, 2, 2);
      ctx.fill();
      ellipse(ctx, 11, 0, 2, 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#d62828';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -8);
      ctx.quadraticCurveTo(2, 16, 16, -12);
      ctx.stroke();
      ctx.strokeStyle = '#5ba829';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(16, -12);
      ctx.quadraticCurveTo(20, -18, 14, -20);
      ctx.stroke();
      ctx.fillStyle = '#ff6b6b';
      ellipse(ctx, -4, 2, 3, 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Piring putih dengan isinya; contents = daftar {ingredient, state}.
export function drawPlate(ctx, x, y, s, contents) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ellipse(ctx, 0, 6, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#fdfdf8';
  ellipse(ctx, 0, 0, 30, 20);
  ctx.fill();
  ctx.strokeStyle = '#e3d9c2';
  ctx.lineWidth = 2;
  ellipse(ctx, 0, 0, 24, 15);
  ctx.stroke();
  if (contents && contents.length > 0) {
    const spots = [[-10, -2], [10, -3], [0, 5], [-2, -8]];
    contents.forEach((c, i) => {
      const [sx, sy] = spots[i % spots.length];
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(0.62, 0.62);
      drawIngredientAt(ctx, c.ingredient, c.state);
      ctx.restore();
    });
  }
  ctx.restore();
}

// Gambar bahan tanpa transformasi luar (dipakai di dalam piring).
function drawIngredientAt(ctx, id, state) {
  drawIngredient(ctx, id, state, 0, 0, 1);
}

// ---------------------------------------------------------------- dapur

function drawFloor(ctx, t) {
  ctx.fillStyle = PALETTE.floorA;
  ctx.fillRect(0, BOARD_H, CANVAS_W, CANVAS_H - BOARD_H);
  const tile = 64;
  ctx.fillStyle = PALETTE.floorB;
  for (let y = BOARD_H; y < CANVAS_H; y += tile) {
    for (let x = 0; x < CANVAS_W; x += tile) {
      const odd = ((x / tile) + (y / tile)) % 2 === 0;
      if (odd) ctx.fillRect(x, y, tile, tile);
    }
  }
  ctx.strokeStyle = PALETTE.floorLine;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  for (let x = 0; x <= CANVAS_W; x += tile) {
    ctx.beginPath();
    ctx.moveTo(x, BOARD_H);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }
  for (let y = BOARD_H; y <= CANVAS_H; y += tile) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // Karpet dapur hangat di tengah lantai.
  ctx.fillStyle = '#b73e1d';
  rr(ctx, 420, 560, 440, 110, 14);
  ctx.fill();
  ctx.fillStyle = '#e4572e';
  rr(ctx, 434, 574, 412, 82, 10);
  ctx.fill();
  ctx.fillStyle = '#fff6e5';
  ctx.font = `700 22px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DAPUR KILAT', 640, 616);
}

function drawCounter(ctx, rect, label, highlight, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rr(ctx, rect.x + 4, rect.y + 8, rect.w, rect.h, 12);
  ctx.fill();
  ctx.fillStyle = PALETTE.counterFront;
  rr(ctx, rect.x, rect.y + 14, rect.w, rect.h - 14, 10);
  ctx.fill();
  ctx.fillStyle = PALETTE.counterTop;
  rr(ctx, rect.x, rect.y, rect.w, 26, 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(rect.x + 6, rect.y + 3, rect.w - 12, 5);
  // Panel depan kayu.
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 10, rect.y + 44);
  ctx.lineTo(rect.x + rect.w - 10, rect.y + 44);
  ctx.stroke();
  text(ctx, label, rect.x + rect.w / 2, rect.y + rect.h - 16, 15, '#ffe9c4', '700', 'center');
  if (highlight) {
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.lineDashOffset = -t * 30;
    rr(ctx, rect.x - 5, rect.y - 5, rect.w + 10, rect.h + 10, 14);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawBin(ctx, bin, highlight, t) {
  const ing = INGREDIENTS[bin.ingredient];
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rr(ctx, bin.x + 3, bin.y + 4, bin.w, bin.h, 12);
  ctx.fill();
  ctx.fillStyle = '#fff6e5';
  rr(ctx, bin.x, bin.y, bin.w, bin.h, 12);
  ctx.fill();
  ctx.strokeStyle = ing.dark;
  ctx.lineWidth = 3;
  rr(ctx, bin.x + 2, bin.y + 2, bin.w - 4, bin.h - 4, 10);
  ctx.stroke();
  drawIngredient(ctx, bin.ingredient, 'raw', bin.x + 34, bin.y + bin.h / 2 + 2, 0.85);
  text(ctx, ing.name.toUpperCase(), bin.x + 66, bin.y + 22, 17, PALETTE.ink, '800');
  text(ctx, ing.chop ? 'potong dulu' : ing.cook ? 'masak di kompor' : 'siap saji', bin.x + 66, bin.y + 46, 12, PALETTE.inkSoft, '600');
  if (highlight) {
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.lineDashOffset = -t * 30;
    rr(ctx, bin.x - 5, bin.y - 5, bin.w + 10, bin.h + 10, 14);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawStove(ctx, kitchen, t) {
  const s = STATIONS.stove;
  drawCounter(ctx, s, 'KOMPOR', false, t);
  BURNERS.forEach((b, i) => {
    const slot = kitchen.burners[i];
    // Cincin tungku.
    ctx.fillStyle = PALETTE.steelDark;
    ellipse(ctx, b.x, b.y + 8, 44, 16);
    ctx.fill();
    ctx.fillStyle = '#22282e';
    ellipse(ctx, b.x, b.y + 6, 36, 12);
    ctx.fill();
    if (slot.item) {
      // Api berkedip di bawah panci.
      const flick = 0.75 + Math.sin(t * 9 + i * 2) * 0.25;
      ctx.fillStyle = `rgba(255,${Math.floor(140 + 60 * flick)},40,${0.85 * flick})`;
      ctx.beginPath();
      ctx.moveTo(b.x - 26, b.y + 8);
      ctx.quadraticCurveTo(b.x - 14, b.y - 16 - 8 * flick, b.x, b.y + 8);
      ctx.quadraticCurveTo(b.x + 14, b.y - 16 - 8 * flick, b.x + 26, b.y + 8);
      ctx.closePath();
      ctx.fill();
      // Panci.
      ctx.fillStyle = PALETTE.steel;
      rr(ctx, b.x - 34, b.y - 22, 68, 26, 8);
      ctx.fill();
      ctx.fillStyle = '#7d8894';
      rr(ctx, b.x - 34, b.y - 22, 68, 8, 8);
      ctx.fill();
      drawIngredient(ctx, slot.item.ingredient, slot.item.state, b.x, b.y - 16, 0.62);
      if (!slot.done) {
        // Cincin progres memasak.
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(b.x, b.y - 8, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.gold;
        ctx.beginPath();
        ctx.arc(b.x, b.y - 8, 30, -Math.PI / 2, -Math.PI / 2 + slot.progress * Math.PI * 2);
        ctx.stroke();
      } else if (slot.item.state === 'cooked') {
        // Matang: label hijau + detak.
        const pulse = 1 + Math.sin(t * 5) * 0.08;
        ctx.save();
        ctx.translate(b.x, b.y - 44);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = PALETTE.leaf;
        rr(ctx, -30, -12, 60, 24, 12);
        ctx.fill();
        ctx.restore();
        text(ctx, 'MATANG!', b.x, b.y - 44, 13, '#ffffff', '800', 'center');
      }
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      ellipse(ctx, b.x, b.y + 6, 30, 10);
      ctx.stroke();
    }
  });
}

function drawBoard(ctx, kitchen, t) {
  const b = STATIONS.board;
  drawCounter(ctx, b, 'TALENAN', false, t);
  // Papan kayu terang.
  ctx.fillStyle = '#e8c48f';
  rr(ctx, b.x + 22, b.y + 8, b.w - 44, 40, 8);
  ctx.fill();
  ctx.strokeStyle = '#c99a5f';
  ctx.lineWidth = 2;
  rr(ctx, b.x + 22, b.y + 8, b.w - 44, 40, 8);
  ctx.stroke();
  if (kitchen.board.item) {
    drawIngredient(ctx, kitchen.board.item.ingredient, kitchen.board.item.state, b.x + b.w / 2, b.y + 28, 0.8);
    if (kitchen.board.progress > 0) {
      // Pisau bergerak + cincin progres potong.
      const swing = Math.sin(t * 14) * 6;
      ctx.save();
      ctx.translate(b.x + b.w / 2 + 34, b.y + 14 + swing);
      ctx.rotate(0.5);
      ctx.fillStyle = '#dfe6ea';
      rr(ctx, -4, -14, 8, 26, 3);
      ctx.fill();
      ctx.fillStyle = '#3d454f';
      rr(ctx, -4, 12, 8, 12, 3);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = PALETTE.tomato;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + 28, 30, -Math.PI / 2, -Math.PI / 2 + kitchen.board.progress * Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawServeWindow(ctx, kitchen, t) {
  const s = STATIONS.serve;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  rr(ctx, s.x + 4, s.y + 8, s.w, s.h, 12);
  ctx.fill();
  ctx.fillStyle = '#8d2f1d';
  rr(ctx, s.x, s.y, s.w, s.h, 12);
  ctx.fill();
  ctx.fillStyle = PALETTE.counterTop;
  rr(ctx, s.x, s.y + s.h - 30, s.w, 30, 10);
  ctx.fill();
  // Jendela saji: tirai merah + lonceng.
  ctx.fillStyle = '#fff6e5';
  rr(ctx, s.x + 14, s.y + 14, s.w - 28, 84, 8);
  ctx.fill();
  ctx.fillStyle = PALETTE.tomato;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(s.x + 20 + i * 36, s.y + 18);
    ctx.lineTo(s.x + 38 + i * 36, s.y + 18);
    ctx.lineTo(s.x + 29 + i * 36, s.y + 40);
    ctx.closePath();
    ctx.fill();
  }
  // Lonceng emas.
  const ring = 1 + Math.sin(t * 3) * 0.05;
  ctx.save();
  ctx.translate(s.x + s.w / 2, s.y + 66);
  ctx.scale(ring, ring);
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.moveTo(-16, 8);
  ctx.quadraticCurveTo(-16, -12, 0, -12);
  ctx.quadraticCurveTo(16, -12, 16, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-20, 8, 40, 5);
  ctx.restore();
  text(ctx, 'SAJIKAN  •  [E]', s.x + s.w / 2, s.y + s.h - 14, 16, '#ffe9c4', '800', 'center');
}

function drawChef(ctx, kitchen, t) {
  const p = kitchen.player;
  const bob = p.moving ? Math.sin(p.walk) * 3 : Math.sin(t * 2) * 1.2;
  const x = p.x;
  const y = p.y + bob * 0.4;
  // Bayangan.
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipse(ctx, p.x, p.y + 34, 30, 9);
  ctx.fill();
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(p.dir, 1);
  // Badan + celemek.
  ctx.fillStyle = PALETTE.teal;
  rr(ctx, -22, -6, 44, 38, 12);
  ctx.fill();
  ctx.fillStyle = '#fffdf5';
  rr(ctx, -17, 2, 34, 30, 10);
  ctx.fill();
  ctx.fillStyle = PALETTE.tomato;
  ctx.fillRect(-17, 2, 34, 5);
  // Tangan.
  ctx.fillStyle = '#f2c094';
  ellipse(ctx, -24, 12, 8, 7);
  ctx.fill();
  ellipse(ctx, 24, 12, 8, 7);
  ctx.fill();
  // Kepala + topi koki.
  ctx.fillStyle = '#f2c094';
  ellipse(ctx, 0, -22, 17, 16);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, -12, -36, 10, 8);
  ctx.fill();
  ellipse(ctx, 0, -40, 11, 9);
  ctx.fill();
  ellipse(ctx, 12, -36, 10, 8);
  ctx.fill();
  ctx.fillRect(-15, -38, 30, 8);
  // Mata + senyum + pipi.
  ctx.fillStyle = '#2a180c';
  ellipse(ctx, -6, -24, 2.2, 3);
  ctx.fill();
  ellipse(ctx, 7, -24, 2.2, 3);
  ctx.fill();
  ctx.strokeStyle = '#2a180c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -17, 6, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = 'rgba(228,87,46,0.45)';
  ellipse(ctx, -12, -17, 4, 3);
  ctx.fill();
  ellipse(ctx, 13, -17, 4, 3);
  ctx.fill();
  ctx.restore();
  // Barang yang dibawa: melayang di atas kepala dengan piring kecil.
  const c = kitchen.carrying;
  if (c) {
    const hy = y - 62 + Math.sin(t * 3) * 3;
    if (isPlate(c)) {
      drawPlate(ctx, x, hy, 0.85, c.contents);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ellipse(ctx, x, hy, 26, 18);
      ctx.fill();
      ctx.strokeStyle = '#e3d9c2';
      ctx.lineWidth = 2;
      ellipse(ctx, x, hy, 26, 18);
      ctx.stroke();
      drawIngredient(ctx, c.ingredient, c.state, x, hy, 0.62);
    }
  }
}

// ---------------------------------------------------------------- order board + HUD

function ticketX(index) {
  return 12 + index * 300;
}

function drawTicket(ctx, order, index, t) {
  const x = ticketX(index);
  const y = 8;
  const w = 290;
  const h = 88;
  const r = order.recipe;
  const frac = Math.max(0, order.timeLeft / order.total);
  const urgent = frac < 0.3;
  const wobble = urgent ? Math.sin(t * 10) * 1.5 : 0;
  ctx.save();
  ctx.translate(wobble, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  rr(ctx, x + 3, y + 4, w, h, 12);
  ctx.fill();
  ctx.fillStyle = PALETTE.ticket;
  rr(ctx, x, y, w, h, 12);
  ctx.fill();
  // Header warna resep.
  ctx.fillStyle = r.accent;
  rr(ctx, x, y, w, 30, 12);
  ctx.fill();
  ctx.fillRect(x, y + 18, w, 12);
  text(ctx, `#${order.id}  ${r.name.toUpperCase()}`, x + 12, y + 16, 16, '#ffffff', '800');
  // Ikon komponen.
  r.parts.forEach((part, i) => {
    const ix = x + 30 + i * 62;
    ctx.fillStyle = '#fff';
    ellipse(ctx, ix, y + 54, 24, 18);
    ctx.fill();
    ctx.strokeStyle = '#e8c48f';
    ctx.lineWidth = 2;
    ellipse(ctx, ix, y + 54, 24, 18);
    ctx.stroke();
    drawIngredient(ctx, part.ingredient, part.state, ix, y + 54, 0.55);
  });
  // Timer bar.
  const barX = x + 12;
  const barY = y + h - 12;
  const barW = w - 24;
  ctx.fillStyle = '#e8dcc8';
  rr(ctx, barX, barY, barW, 7, 3.5);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? PALETTE.leaf : frac > 0.3 ? PALETTE.goldDeep : PALETTE.tomato;
  if (frac > 0) {
    rr(ctx, barX, barY, barW * frac, 7, 3.5);
    ctx.fill();
  }
  text(ctx, `${Math.ceil(order.timeLeft)} dtk`, x + w - 12, y + 54, 15, urgent ? PALETTE.tomato : PALETTE.inkSoft, '800', 'right');
  ctx.restore();
}

function drawBoardAndHud(ctx, game, t) {
  // Pita order board.
  ctx.fillStyle = PALETTE.board;
  ctx.fillRect(0, 0, CANVAS_W, BOARD_H);
  ctx.fillStyle = PALETTE.boardEdge;
  ctx.fillRect(0, BOARD_H - 6, CANVAS_W, 6);
  text(ctx, 'PESANAN', 12, 0, 1, '#000', '700');
  game.orders.list.forEach((o, i) => drawTicket(ctx, o, i, t));
  for (let i = game.orders.list.length; i < 3; i++) {
    const x = ticketX(i);
    ctx.strokeStyle = 'rgba(255,246,229,0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    rr(ctx, x, 8, 290, 88, 12);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, 'Menunggu pesanan…', x + 145, 52, 15, 'rgba(255,246,229,0.5)', '600', 'center');
  }
  // Timer shift besar.
  const left = Math.max(0, game.shiftLeft);
  const mm = Math.floor(left / 60);
  const ss = Math.floor(left % 60).toString().padStart(2, '0');
  const danger = left <= 30;
  const pulse = danger ? 1 + Math.sin(t * 6) * 0.06 : 1;
  ctx.save();
  ctx.translate(948, 52);
  ctx.scale(pulse, pulse);
  text(ctx, '⏱', 0, -22, 20, '#f2b705', '700', 'center');
  text(ctx, `${mm}:${ss}`, 0, 12, 34, danger ? '#ff8a70' : '#fff6e5', '800', 'center');
  ctx.restore();
  text(ctx, 'SHIFT', 948, 84, 12, 'rgba(255,246,229,0.65)', '700', 'center');
  // Skor + kombo.
  text(ctx, 'SKOR', 1078, 22, 13, 'rgba(255,246,229,0.65)', '700', 'center');
  text(ctx, String(game.orders.score).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), 1078, 52, 32, PALETTE.gold, '800', 'center');
  if (game.orders.combo >= 2) {
    ctx.fillStyle = PALETTE.tomato;
    rr(ctx, 1032, 70, 92, 26, 13);
    ctx.fill();
    text(ctx, `🔥 KOMBO x${game.orders.combo}`, 1078, 84, 14, '#ffffff', '800', 'center');
  }
  // Disajikan + nyawa (cabai).
  text(ctx, `Disajikan ${game.orders.served}`, 1218, 26, 14, '#fff6e5', '700', 'center');
  for (let i = 0; i < 3; i++) {
    const lost = i < game.orders.missed;
    ctx.save();
    ctx.globalAlpha = lost ? 0.25 : 1;
    drawIngredient(ctx, 'cabai', 'raw', 1180 + i * 36, 62, 0.5);
    ctx.restore();
  }
  text(ctx, 'hangus', 1218, 88, 11, 'rgba(255,246,229,0.55)', '600', 'center');
}

// ---------------------------------------------------------------- partikel

export function createParticles() {
  return [];
}

export function spawnSteam(particles, x, y) {
  if (particles.length > 90) return;
  particles.push({
    kind: 'steam', x: x + (Math.random() - 0.5) * 22, y, vy: -34 - Math.random() * 18,
    r: 5 + Math.random() * 6, t: 0, life: 1.6 + Math.random() * 0.8,
  });
}

export function spawnSparkles(particles, x, y, color) {
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 70;
    particles.push({
      kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30,
      r: 3 + Math.random() * 3, t: 0, life: 0.9 + Math.random() * 0.5, color: color || '#f2b705',
    });
  }
}

export function spawnChopBits(particles, x, y) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      kind: 'bit', x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 60, vy: -20 - Math.random() * 40,
      r: 2 + Math.random() * 2.5, t: 0, life: 0.6, color: '#8bc34a',
    });
  }
}

export function updateParticles(particles, dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.t += dt;
    if (p.kind === 'steam') {
      p.y += p.vy * dt;
      p.x += Math.sin(p.t * 3 + p.r) * 8 * dt;
      p.r += 6 * dt;
    } else {
      p.vy += 160 * dt;
      p.x += (p.vx || 0) * dt;
      p.y += p.vy * dt;
    }
    if (p.t >= p.life) particles.splice(i, 1);
  }
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    const a = 1 - p.t / p.life;
    if (p.kind === 'steam') {
      ctx.fillStyle = `rgba(255,255,255,${0.5 * a})`;
      ellipse(ctx, p.x, p.y, p.r, p.r * 0.8);
      ctx.fill();
    } else if (p.kind === 'spark') {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.r * 1.6);
      ctx.lineTo(p.x + p.r * 0.5, p.y - p.r * 0.5);
      ctx.lineTo(p.x + p.r * 1.6, p.y);
      ctx.lineTo(p.x + p.r * 0.5, p.y + p.r * 0.5);
      ctx.lineTo(p.x, p.y + p.r * 1.6);
      ctx.lineTo(p.x - p.r * 0.5, p.y + p.r * 0.5);
      ctx.lineTo(p.x - p.r * 1.6, p.y);
      ctx.lineTo(p.x - p.r * 0.5, p.y - p.r * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ellipse(ctx, p.x, p.y, p.r, p.r);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

// ---------------------------------------------------------------- layar

function drawTitle(ctx, game, t) {
  // Dinding hangat + bendera.
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#7c3f16');
  grad.addColorStop(0.55, '#a85a24');
  grad.addColorStop(1, '#5f2c12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#e8c48f';
  for (let x = 0; x < CANVAS_W; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 45, 34);
    ctx.lineTo(x + 90, 0);
    ctx.closePath();
    ctx.fillStyle = x % 180 === 0 ? '#e4572e' : '#f2b705';
    ctx.fill();
  }
  // Judul besar.
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 6;
  text(ctx, 'DAPUR KILAT', CANVAS_W / 2, 168, 92, '#fff6e5', '800', 'center');
  ctx.restore();
  text(ctx, 'W A R U N G   R U S H', CANVAS_W / 2, 232, 30, PALETTE.gold, '800', 'center');
  text(ctx, 'Masak cepat, sajikan tepat — jangan sampai pelanggan menunggu!', CANVAS_W / 2, 272, 22, '#ffe9c4', '600', 'center');
  // Barisan hidangan contoh.
  const dishes = ['nasiGoreng', 'mieGoreng', 'ayamGeprek', 'sotoAyam', 'nasiTelur'];
  dishes.forEach((id, i) => {
    const x = 290 + i * 180;
    const y = 400 + Math.sin(t * 2 + i) * 6;
    drawPlate(ctx, x, y, 1.5, RECIPES[id].parts);
    text(ctx, RECIPES[id].short.toUpperCase(), x, y + 62, 16, '#fff6e5', '800', 'center');
  });
  // Kotak cara main.
  ctx.fillStyle = 'rgba(42,24,12,0.72)';
  rr(ctx, 330, 500, 620, 108, 16);
  ctx.fill();
  text(ctx, 'WASD / Panah — bergerak      E / Klik — pakai stasiun', CANVAS_W / 2, 528, 19, '#fff6e5', '700', 'center');
  text(ctx, 'Ambil bahan → potong → masak → rakit di piring → sajikan!', CANVAS_W / 2, 560, 19, '#ffe9c4', '600', 'center');
  text(ctx, 'M = bisu    •    3 pesanan hangus = shift berakhir', CANVAS_W / 2, 588, 15, 'rgba(255,233,196,0.75)', '600', 'center');
  const blink = 0.65 + Math.sin(t * 4) * 0.35;
  ctx.globalAlpha = blink;
  text(ctx, '▶  TEKAN ENTER / KLIK UNTUK MULAI', CANVAS_W / 2, 660, 24, PALETTE.gold, '800', 'center');
  ctx.globalAlpha = 1;
  if (game.best > 0) text(ctx, `Skor terbaik: ${game.best}`, CANVAS_W / 2, 692, 16, '#fff6e5', '700', 'center');
}

function drawResults(ctx, game, t) {
  ctx.fillStyle = 'rgba(42,24,12,0.78)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  text(ctx, game.orders.missed >= 3 ? 'SHIFT BERAKHIR!' : 'SHIFT SELESAI!', CANVAS_W / 2, 150, 64, '#fff6e5', '800', 'center');
  text(ctx, game.orders.missed >= 3 ? 'Tiga pesanan hangus — pelanggan pulang kecewa.' : 'Kerja bagus, Koki! Warung tutup dengan senyum.', CANVAS_W / 2, 205, 22, '#ffe9c4', '600', 'center');
  ctx.fillStyle = 'rgba(255,246,229,0.12)';
  rr(ctx, 440, 250, 400, 250, 18);
  ctx.fill();
  const rows = [
    ['SKOR AKHIR', String(game.orders.score)],
    ['Disajikan', String(game.orders.served)],
    ['Kombo terbaik', `x${game.orders.bestCombo}`],
    ['Pesanan hangus', String(game.orders.missed)],
  ];
  rows.forEach(([label, value], i) => {
    const y = 292 + i * 52;
    text(ctx, label, 480, y, 22, '#ffe9c4', '700');
    text(ctx, value, 800, y, 26, PALETTE.gold, '800', 'right');
  });
  if (game.orders.score > 0 && game.orders.score >= game.best) {
    text(ctx, '★ SKOR TERBAIK BARU! ★', CANVAS_W / 2, 548, 24, PALETTE.gold, '800', 'center');
  }
  const blink = 0.65 + Math.sin(t * 4) * 0.35;
  ctx.globalAlpha = blink;
  text(ctx, 'Tekan R / Enter untuk main lagi', CANVAS_W / 2, 610, 22, '#fff6e5', '700', 'center');
  ctx.globalAlpha = 1;
}

function drawPlaying(ctx, game, t) {
  const k = game.kitchen;
  drawFloor(ctx, t);
  // Stasiun (urutan gambar: yang di atas dulu).
  for (const bin of STATIONS.bins) {
    const near = game.nearStation && game.nearStation.kind === 'bin' && game.nearStation.ingredient === bin.ingredient;
    drawBin(ctx, bin, near, t);
  }
  const nearKind = game.nearStation ? game.nearStation.kind : null;
  drawBoard(ctx, k, t);
  drawStove(ctx, k, t);
  // Meja rakit piring.
  drawCounter(ctx, STATIONS.plating, 'RAKIT PIRING', nearKind === 'plating', t);
  if (k.plating.plate) {
    drawPlate(ctx, STATIONS.plating.x + STATIONS.plating.w / 2, STATIONS.plating.y + 34, 1.05, k.plating.plate.contents);
    // Piring lengkap yang cocok dengan pesanan = bersinar "SIAP SAJI".
    const ready = game.orders.list.some((o) => {
      const { plateMatchesOrder } = game.helpers;
      return plateMatchesOrder(k.plating.plate.contents, o.recipe);
    });
    if (ready) {
      const pulse = 1 + Math.sin(t * 6) * 0.08;
      ctx.save();
      ctx.translate(STATIONS.plating.x + STATIONS.plating.w / 2, STATIONS.plating.y - 4);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = PALETTE.gold;
      rr(ctx, -58, -15, 116, 30, 15);
      ctx.fill();
      ctx.restore();
      text(ctx, 'SIAP SAJI!', STATIONS.plating.x + STATIONS.plating.w / 2, STATIONS.plating.y - 3, 17, '#3b2314', '800', 'center');
    }
  }
  // Tumpukan piring bersih.
  drawCounter(ctx, STATIONS.plates, 'PIRING', nearKind === 'plates', t);
  for (let i = 0; i < Math.min(4, k.platesLeft); i++) {
    ctx.fillStyle = '#fdfdf8';
    ellipse(ctx, STATIONS.plates.x + STATIONS.plates.w / 2, STATIONS.plates.y + 26 - i * 4, 26, 8);
    ctx.fill();
  }
  text(ctx, `x${k.platesLeft}`, STATIONS.plates.x + STATIONS.plates.w / 2, STATIONS.plates.y + 52, 15, '#ffe9c4', '800', 'center');
  drawServeWindow(ctx, k, t);
  // Tong sampah.
  drawCounter(ctx, STATIONS.trash, 'SAMPAH', nearKind === 'trash', t);
  ctx.fillStyle = '#3d454f';
  rr(ctx, STATIONS.trash.x + 30, STATIONS.trash.y + 22, 52, 34, 8);
  ctx.fill();
  ctx.fillStyle = '#5a6470';
  rr(ctx, STATIONS.trash.x + 26, STATIONS.trash.y + 16, 60, 10, 5);
  ctx.fill();
  // Koki + partikel + popup.
  drawChef(ctx, k, t);
  drawParticles(ctx, game.particles);
  for (const p of game.orders.popups) {
    ctx.globalAlpha = Math.min(1, p.t);
    text(ctx, p.text, p.x, p.y, p.big ? 34 : 20, p.color, '800', 'center');
    ctx.globalAlpha = 1;
  }
  if (k.flash) {
    ctx.globalAlpha = Math.min(1, k.flash.t);
    ctx.fillStyle = 'rgba(42,24,12,0.85)';
    const w = ctx.measureText(k.flash.text).width + 28;
    rr(ctx, k.flash.x - w / 2, k.flash.y - 16, w, 32, 16);
    ctx.fill();
    text(ctx, k.flash.text, k.flash.x, k.flash.y + 1, 15, '#fff6e5', '700', 'center');
    ctx.globalAlpha = 1;
  }
  // Petunjuk konteks di bawah.
  if (game.nearStation) {
    const s = game.nearStation;
    const hint = s.kind === 'bin' ? `Ambil ${INGREDIENTS[s.ingredient].name}  [E]` : s.label + '  [E]';
    ctx.fillStyle = 'rgba(42,24,12,0.8)';
    rr(ctx, CANVAS_W / 2 - 150, CANVAS_H - 42, 300, 32, 16);
    ctx.fill();
    text(ctx, hint, CANVAS_W / 2, CANVAS_H - 25, 16, '#fff6e5', '700', 'center');
  } else {
    text(ctx, 'WASD / Panah bergerak  •  E / Klik pakai stasiun  •  M bisu', CANVAS_W / 2, CANVAS_H - 24, 14, 'rgba(59,35,20,0.55)', '600', 'center');
  }
  drawBoardAndHud(ctx, game, t);
}

// ---------------------------------------------------------------- utama

export function render(ctx, game, t) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  if (game.screen === 'title') {
    drawTitle(ctx, game, t);
  } else if (game.screen === 'results') {
    drawPlaying(ctx, game, t);
    drawResults(ctx, game, t);
  } else {
    drawPlaying(ctx, game, t);
  }
}
