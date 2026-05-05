# ⚡ Interview Prep — Vincent Xavier

A React + TypeScript + Vite interview prep app: **routes per topic**, full-text **search** (question + answer + tips), **export/import** of progress, and data split by category. Progress and revealed cards persist in `localStorage`.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## 🏗️ Build for Production

```bash
npm run build
# Output in dist/ — deploy anywhere (Netlify, Vercel, GitHub Pages)
```

## 📂 Question data (split files)

- `public/data/manifest.json` — lists categories and the relative path of each JSON array.
- `public/data/categories/<category_id>.json` — questions for that category.

Optional: merge into one file for bulk editing, then split again:

```bash
node scripts/merge-questions.mjs   # optional: writes public/data/questions.json (gitignored) for one-file edits
node scripts/split-questions.mjs   # reads questions.json → writes manifest + categories/ (needs merged file first)
```

Runtime loads **`manifest.json` + `categories/*.json`** only.

### Question JSON shape

```json
{
  "id": "unique_id",
  "level": "beginner",
  "q": "Your question text",
  "a": "Multi-line answer",
  "tips": "Optional interview framing hint.",
  "structure": [{ "label": "Opening", "text": "What to say out loud." }]
}
```

Valid `level` values: `beginner`, `intermediate`, `advanced`, `expert`. Category ids must match `src/data/categories.ts`.

### URLs

- Topic: `/study/<categoryId>` (e.g. `/study/react`).
- Jump to a card (scroll + reveal): `/study/react?q=r1`.

## 🧪 Tests

```bash
npm test
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript** + **React Router**
- **Vite** (dev server + build)
- **Vitest** (unit tests)
- **localStorage** (progress + revealed state + dismissed tip banner)
- Pure CSS (no UI framework)
