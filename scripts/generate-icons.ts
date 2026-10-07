import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { deflateSync } from 'node:zlib';

// One geometric logo source for vector, raster, and browser fallback assets.
const output = resolve(import.meta.dir, '../public');
const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
const background = [28, 51, 43];
const primary = [200, 239, 134];
const secondary = [130, 172, 130];
function svg(rounded: boolean, transparent = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${transparent ? '' : `<rect width="40" height="40"${rounded ? ' rx="11"' : ''} fill="#1c332b"/>`}<path d="M10 12h21v5h-8v14h-6V17h-7z" fill="#c8ef86"/><path d="M25 24h6v7h-6z" fill="#82ac82"/></svg>\n`;
}
function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer) {
  const tag = Buffer.from(type);
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([tag, data])));
  return Buffer.concat([header, tag, data, checksum]);
}
function png(size: number, rounded: boolean) {
  const pixels = Buffer.alloc((size * 4 + 1) * size);
  const samples = 4;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0];
      let coverage = 0;
      for (let sy = 0; sy < samples; sy++)
        for (let sx = 0; sx < samples; sx++) {
          const px = ((x + (sx + 0.5) / samples) * 40) / size;
          const py = ((y + (sy + 0.5) / samples) * 40) / size;
          const dx = Math.max(11 - px, 0, px - 29);
          const dy = Math.max(11 - py, 0, py - 29);
          if (rounded && dx * dx + dy * dy > 121) continue;
          const color =
            (px >= 10 && px < 31 && py >= 12 && py < 17) ||
            (px >= 17 && px < 23 && py >= 17 && py < 31)
              ? primary
              : px >= 25 && px < 31 && py >= 24 && py < 31
                ? secondary
                : background;
          for (let c = 0; c < 3; c++) sum[c]! += color[c]!;
          coverage++;
        }
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      for (let c = 0; c < 3; c++)
        pixels[offset + c] = coverage ? Math.round(sum[c]! / coverage) : 0;
      pixels[offset + 3] = Math.round((coverage * 255) / (samples * samples));
    }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function ico(rounded: boolean) {
  const frames = [16, 32, 48].map((size) => ({ size, data: png(size, rounded) }));
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header[entry] = size;
    header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...frames.map((frame) => frame.data)]);
}
await mkdir(resolve(output, 'icons'), { recursive: true });
await writeFile(resolve(output, 'favicon.svg'), svg(true));
await writeFile(resolve(output, 'favicon-square.svg'), svg(false));
await writeFile(resolve(output, 'icons/mark.svg'), svg(false, true));
for (const rounded of [true, false])
  for (const size of sizes) {
    await writeFile(
      resolve(output, `icons/tuffite-${rounded ? 'rounded' : 'square'}-${size}.png`),
      png(size, rounded),
    );
  }
await writeFile(resolve(output, 'favicon.ico'), ico(true));
await writeFile(resolve(output, 'favicon-square.ico'), ico(false));
await writeFile(resolve(output, 'apple-touch-icon.png'), png(180, false));
await writeFile(
  resolve(output, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Tuffite',
      short_name: 'Tuffite',
      start_url: '/',
      display: 'standalone',
      background_color: '#faf9f6',
      theme_color: '#1c332b',
      icons: [192, 512].map((size) => ({
        src: `/icons/tuffite-square-${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable',
      })),
    },
    null,
    2,
  ) + '\n',
);
console.log('Generated rounded/square SVG, PNG, ICO, Apple Touch Icon, and Web Manifest assets');
