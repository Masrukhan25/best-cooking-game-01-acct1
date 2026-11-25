[![Dapur Kilat](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/Masrukhan25/best-cooking-game-01-acct1/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/Masrukhan25/best-cooking-game-01-acct1/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

# Dapur Kilat — Warung Rush

Game memasak 2D original: kamu koki di sebuah warung kecil. Ambil bahan dari
bin, potong di talenan, masak di kompor, rakit hidangan di piring, dan sajikan
ke jendela saji sebelum timer pesanan habis. Pesanan makin cepat, kombo makin
besar, dan tiga pesanan hangus berarti shift berakhir.

## Cara main

- **WASD / panah** — bergerak di dapur
- **E / klik** — pakai stasiun (ambil bahan, taruh, sajikan)
- **M** — bisu

Alur: ambil bahan mentah → potong (ayam, sayur, cabai) di talenan →
masak (nasi, mie, telur, ayam) di kompor → rakit di piring → sajikan.
Awas: masakan yang dibiarkan terlalu lama di kompor jadi gosong!

## Resep

- **Nasi Telur Ceplok** — nasi masak + telur masak
- **Nasi Goreng Spesial** — nasi masak + telur masak + cabai potong
- **Mie Goreng Warung** — mie masak + telur masak + sayur potong
- **Ayam Geprek Pedas** — ayam goreng + cabai potong
- **Soto Ayam Hangat** — ayam goreng + sayur potong + nasi masak

## Struktur kode

- `game/index.html` + `game/style.css` — halaman dan bingkai
- `game/src/data.js` — palet, bahan, resep, layout dapur
- `game/src/kitchen.js` — gerak koki dan interaksi stasiun
- `game/src/orders.js` — pesanan, timer, skor, kombo
- `game/src/render.js` — semua gambar canvas 2D
- `game/src/input.js` — keyboard + mouse
- `game/src/audio.js` — bunyi WebAudio sintetis
- `game/src/main.js` — loop game dan adegan screenshot

Game berjalan offline penuh: tanpa network request, tanpa aset eksternal.
