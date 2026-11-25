// data.js — semua data statis Dapur Kilat: palet hangat, bahan, resep, dan layout dapur.
// Tidak ada logika permainan di sini, hanya tabel yang dibaca modul lain.

export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const BOARD_H = 104; // tinggi pita order board di atas
export const SHIFT_SECONDS = 180; // durasi satu shift
export const MAX_MISSED = 3; // pesanan hangus sebelum shift berakhir
export const MAX_ORDERS = 3;

// Palet hangat dan menggugah selera: krem, kayu, emas, tomat, daun.
export const PALETTE = {
  wall: '#3b2314',
  wallEdge: '#2a180c',
  board: '#4a2c1a',
  boardEdge: '#6b4423',
  ticket: '#fff6e5',
  ticketEdge: '#e8c48f',
  floorA: '#e8c48f',
  floorB: '#ddb27a',
  floorLine: '#c99a5f',
  counterTop: '#c08a4e',
  counterFront: '#7c4a21',
  counterEdge: '#5f3717',
  steel: '#5a6470',
  steelDark: '#3d454f',
  cream: '#fff6e5',
  ink: '#3b2314',
  inkSoft: '#7a5a3a',
  gold: '#f2b705',
  goldDeep: '#d99400',
  tomato: '#e4572e',
  tomatoDeep: '#b73e1d',
  leaf: '#5ba829',
  leafDeep: '#3f7d1c',
  teal: '#177e6e',
  tealDeep: '#0f5f52',
  eggYolk: '#ffb703',
  rice: '#fff3d6',
  noodle: '#f4b942',
  chickenRaw: '#f2a594',
  chickenCooked: '#c67b3c',
  chili: '#d62828',
  veggie: '#6ab04c',
  steam: 'rgba(255,255,255,0.55)',
};

// Bahan mentah yang diambil dari bin. chop: perlu dipotong dulu. cook: perlu dimasak di kompor.
export const INGREDIENTS = {
  nasi:   { id: 'nasi',   name: 'Nasi',   chop: false, cook: true,  color: '#fff3d6', dark: '#e8c48f', emoji: '' },
  mie:    { id: 'mie',    name: 'Mie',    chop: false, cook: true,  color: '#f4b942', dark: '#c98f1b', emoji: '' },
  telur:  { id: 'telur',  name: 'Telur',  chop: false, cook: true,  color: '#fff6e5', dark: '#e8c48f', emoji: '' },
  ayam:   { id: 'ayam',   name: 'Ayam',   chop: true,  cook: true,  color: '#f2a594', dark: '#d97b63', emoji: '' },
  sayur:  { id: 'sayur',  name: 'Sayur',  chop: true,  cook: false, color: '#6ab04c', dark: '#4a8a32', emoji: '' },
  cabai:  { id: 'cabai',  name: 'Cabai',  chop: true,  cook: false, color: '#d62828', dark: '#9e1b1b', emoji: '' },
};

// Satu komponen hidangan: bahan + keadaan yang dibutuhkan.
export function component(ingredientId, state) {
  return { ingredient: ingredientId, state }; // state: 'raw' | 'chopped' | 'cooked'
}

// Resep: nama, komponen, dan warna aksen untuk tiket pesanan.
export const RECIPES = {
  nasiTelur: {
    id: 'nasiTelur', name: 'Nasi Telur Ceplok', short: 'Nasi Telur',
    accent: '#ffb703',
    parts: [component('nasi', 'cooked'), component('telur', 'cooked')],
  },
  nasiGoreng: {
    id: 'nasiGoreng', name: 'Nasi Goreng Spesial', short: 'Nasi Goreng',
    accent: '#e4572e',
    parts: [component('nasi', 'cooked'), component('telur', 'cooked'), component('cabai', 'chopped')],
  },
  mieGoreng: {
    id: 'mieGoreng', name: 'Mie Goreng Warung', short: 'Mie Goreng',
    accent: '#f4b942',
    parts: [component('mie', 'cooked'), component('telur', 'cooked'), component('sayur', 'chopped')],
  },
  ayamGeprek: {
    id: 'ayamGeprek', name: 'Ayam Geprek Pedas', short: 'Ayam Geprek',
    accent: '#d62828',
    parts: [component('ayam', 'cooked'), component('cabai', 'chopped')],
  },
  sotoAyam: {
    id: 'sotoAyam', name: 'Soto Ayam Hangat', short: 'Soto Ayam',
    accent: '#5ba829',
    parts: [component('ayam', 'cooked'), component('sayur', 'chopped'), component('nasi', 'cooked')],
  },
};

export const RECIPE_LIST = [
  RECIPES.nasiTelur,
  RECIPES.nasiGoreng,
  RECIPES.mieGoreng,
  RECIPES.ayamGeprek,
  RECIPES.sotoAyam,
];

// Stasiun dapur: posisi, ukuran, dan label. Koordinat dalam ruang canvas.
export const STATIONS = {
  bins: [
    { kind: 'bin', ingredient: 'nasi',  x: 16,  y: 124, w: 132, h: 76 },
    { kind: 'bin', ingredient: 'mie',   x: 16,  y: 208, w: 132, h: 76 },
    { kind: 'bin', ingredient: 'telur', x: 16,  y: 292, w: 132, h: 76 },
    { kind: 'bin', ingredient: 'ayam',  x: 16,  y: 376, w: 132, h: 76 },
    { kind: 'bin', ingredient: 'sayur', x: 16,  y: 460, w: 132, h: 76 },
    { kind: 'bin', ingredient: 'cabai', x: 16,  y: 544, w: 132, h: 76 },
  ],
  board:   { kind: 'board',   x: 232, y: 128, w: 168, h: 84 },
  stove:   { kind: 'stove',   x: 432, y: 128, w: 252, h: 84 },
  plating: { kind: 'plating', x: 716, y: 128, w: 220, h: 84 },
  plates:  { kind: 'plates',  x: 968, y: 128, w: 96,  h: 84 },
  serve:   { kind: 'serve',   x: 1072, y: 128, w: 204, h: 172 },
  trash:   { kind: 'trash',   x: 1152, y: 616, w: 112, h: 84 },
};

// Dua tungku kompor: posisi tengah api.
export const BURNERS = [
  { x: 498, y: 170 },
  { x: 618, y: 170 },
];

export const CHOP_SECONDS = 1.4; // lama memotong satu bahan
export const COOK_SECONDS = 6; // lama memasak sampai matang
export const BURN_SECONDS = 7; // tenggat sebelum gosong setelah matang
export const ORDER_SECONDS = 75; // timer awal tiap pesanan
export const ORDER_SPAWN_START = 13; // jeda spawn pesanan di awal shift
export const ORDER_SPAWN_MIN = 8; // jeda spawn tercepat saat shift memanas
