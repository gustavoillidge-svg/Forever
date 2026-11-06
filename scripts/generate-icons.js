const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const BG = '#0a0e14';
const GOLD = '#c9a84c';
const sizes = [192, 512];
const outDir = path.join(__dirname, '..', 'icons');

fs.mkdirSync(outDir, { recursive: true });

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, size, size);

  // Inner circle
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1a212d';
  ctx.fill();

  // Gold ring
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
  ctx.lineWidth = size * 0.04;
  ctx.strokeStyle = GOLD;
  ctx.stroke();

  // Letters "WF"
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${size * 0.35}px 'Cinzel', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', cx - size * 0.08, cy);
  ctx.fillText('F', cx + size * 0.08, cy);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buffer);
  console.log(`Generated icons/icon-${size}.png (${size}x${size})`);
}

console.log('Done.');
