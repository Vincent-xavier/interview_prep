/**
 * One-time / maintenance: reads monolithic public/data/questions.json
 * and writes public/data/manifest.json + public/data/categories/<id>.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'public', 'data', 'questions.json');
const outDir = path.join(root, 'public', 'data', 'categories');

const raw = fs.readFileSync(srcPath, 'utf8');
const bundle = JSON.parse(raw);

if (!bundle || typeof bundle !== 'object') {
  console.error('Invalid questions.json');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const categories = Object.keys(bundle);
const files = {};

for (const cat of categories) {
  const arr = bundle[cat];
  if (!Array.isArray(arr)) {
    console.error(`Category "${cat}" is not an array`);
    process.exit(1);
  }
  const fname = `${cat}.json`;
  files[cat] = `categories/${fname}`;
  fs.writeFileSync(path.join(outDir, fname), JSON.stringify(arr, null, 2) + '\n', 'utf8');
}

const manifest = {
  version: 1,
  categories,
  files,
};

fs.writeFileSync(
  path.join(root, 'public', 'data', 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);

console.log(`Wrote manifest + ${categories.length} category files to public/data/`);
