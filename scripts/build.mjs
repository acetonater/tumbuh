import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const files = [
  'index.html',
  'styles.css',
  'app.js',
  'robots.txt',
  'sw.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Berkas wajib tidak ditemukan: ${file}`);
  }
  const target = path.join(out, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

console.log(`Build selesai: ${files.length} berkas disalin ke dist/.`);
