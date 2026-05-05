/**
 * Rebuilds public/data/questions.json from manifest + categories/
 * (inverse of split-questions.mjs) for bulk editing in one file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'public', 'data', 'manifest.json');
const outPath = path.join(root, 'public', 'data', 'questions.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const bundle = {};

for (const cat of manifest.categories) {
  const rel = manifest.files[cat];
  const p = path.join(root, 'public', 'data', rel);
  bundle[cat] = JSON.parse(fs.readFileSync(p, 'utf8'));
}

fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2) + '\n', 'utf8');
console.log('Wrote questions.json');
