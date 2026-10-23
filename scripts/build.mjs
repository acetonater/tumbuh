import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'robots.txt'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Berkas wajib tidak ditemukan: ${file}`);
  }
  fs.copyFileSync(source, path.join(out, file));
}

console.log(`Build selesai: ${files.length} berkas disalin ke dist/.`);
