const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'logo.png'));
const { createImage } = require('canvas');

const sizes = [16, 32, 48, 64, 128, 256];
const images = [];

(async () => {
  const img = await loadImage(src);

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    // Fondo transparente
    ctx.clearRect(0, 0, size, size);
    // Ajuste manteniendo aspecto, centrado
    const scale = Math.min(size / img.width, size / img.height) * 0.92;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;
    ctx.drawImage(img, x, y, w, h);
    const png = canvas.toBuffer('image/png');
    images.push({ size, png });
  }

  // Construir contenedor ICO con imagenes PNG embebidas (soportado por Windows Vista+ y navegadores)
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);       // reserved
  header.writeUInt16LE(1, 2);       // type = 1 (ICO)
  header.writeUInt16LE(count, 2);   // count

  const dirEntry = Buffer.alloc(16);
  let offset = 6 + count * 16;
  const dirs = [];
  const payloads = [];

  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;   // width (0 = 256)
    entry[1] = size >= 256 ? 0 : size;   // height
    entry[2] = 0;                        // colors
    entry[3] = 0;                        // reserved
    entry.writeUInt16LE(1, 4);           // planes
    entry.writeUInt16LE(32, 6);          // bitcount
    entry.writeUInt32LE(png.length, 8);  // size in bytes
    entry.writeUInt32LE(offset, 12);     // offset
    dirs.push(entry);
    payloads.push(png);
    offset += png.length;
  }

  const ico = Buffer.concat([header, ...dirs, ...payloads]);
  const out = path.join(__dirname, '..', 'favicon.ico');
  fs.writeFileSync(out, ico);
  console.log(`Generated ${out} (${ico.length} bytes, ${count} sizes)`);
})();
