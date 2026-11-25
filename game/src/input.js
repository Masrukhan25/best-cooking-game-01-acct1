// input.js — keyboard + mouse untuk Dapur Kilat.
// Gerak: WASD / panah. Aksi: E atau Spasi. Klik mouse: berjalan ke titik klik,
// klik stasiun di dekat koki = pakai stasiun itu. Enter: mulai / main lagi. M: mute.

export function createInput(canvas) {
  const keys = new Set();
  const pressed = new Set(); // tombol yang baru ditekan sejak frame terakhir dibaca
  let mouseX = 0;
  let mouseY = 0;
  let clickX = null;
  let clickY = null;
  let clickConsumed = true;

  function keyName(e) {
    return e.key.toLowerCase();
  }

  window.addEventListener('keydown', (e) => {
    const k = keyName(e);
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    if (!keys.has(k)) pressed.add(k);
    keys.add(k);
  });
  window.addEventListener('keyup', (e) => {
    keys.delete(keyName(e));
  });
  window.addEventListener('blur', () => {
    keys.clear();
  });

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const p = canvasPos(e);
    mouseX = p.x;
    mouseY = p.y;
  });
  canvas.addEventListener('mousedown', (e) => {
    const p = canvasPos(e);
    mouseX = p.x;
    mouseY = p.y;
    clickX = p.x;
    clickY = p.y;
    clickConsumed = false;
  });

  return {
    // Arah gerak saat ini, dinormalisasi (-1..1 per sumbu).
    moveVector() {
      let x = 0;
      let y = 0;
      if (keys.has('a') || keys.has('arrowleft')) x -= 1;
      if (keys.has('d') || keys.has('arrowright')) x += 1;
      if (keys.has('w') || keys.has('arrowup')) y -= 1;
      if (keys.has('s') || keys.has('arrowdown')) y += 1;
      if (x !== 0 && y !== 0) {
        x *= Math.SQRT1_2;
        y *= Math.SQRT1_2;
      }
      return { x, y };
    },
    // true hanya pada frame pertama tombol ditekan.
    wasPressed(name) {
      return pressed.has(name);
    },
    actionPressed() {
      return pressed.has('e') || pressed.has(' ');
    },
    enterPressed() {
      return pressed.has('enter');
    },
    mutePressed() {
      return pressed.has('m');
    },
    mouse() {
      return { x: mouseX, y: mouseY };
    },
    // Titik klik mouse yang belum dipakai; null bila tidak ada klik baru.
    takeClick() {
      if (clickConsumed || clickX === null) return null;
      clickConsumed = true;
      return { x: clickX, y: clickY };
    },
    // Dipanggil akhir tiap frame: bersihkan tepi tombol.
    endFrame() {
      pressed.clear();
    },
  };
}
