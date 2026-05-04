# ⚡ Interview Prep — Vincent Xavier

A full React + TypeScript + Vite interview preparation app with **258+ questions** across 21 categories. Progress is saved in `localStorage`.

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

## 📂 Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root component
├── index.css                 # Global styles
├── types/
│   └── index.ts              # TypeScript interfaces
├── data/
│   ├── categories.ts         # Category definitions + groups
│   └── questions/
│       ├── index.ts          # Aggregates all question files
│       ├── react.ts
│       ├── react_extra.ts
│       ├── typescript.ts
│       ├── js_core.ts
│       ├── redux.ts
│       ├── dotnet.ts
│       ├── aspnet.ts
│       ├── ef_linq.ts
│       ├── database.ts
│       ├── security.ts
│       ├── solid.ts
│       ├── microservices.ts
│       ├── system_design.ts
│       ├── performance.ts
│       ├── testing.ts
│       ├── devops.ts
│       ├── scenario.ts
│       ├── string_js.ts
│       ├── string_cs.ts
│       ├── hr_behavior.ts
│       └── db_code.ts
├── hooks/
│   └── useProgress.ts        # localStorage persistence + stats
└── components/
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── ProgressOverview.tsx
    ├── FilterBar.tsx
    └── QuestionCard.tsx
```

## ➕ Adding Questions

Edit any file in `src/data/questions/`. Each question follows this shape:

```ts
{
  id: "unique_id",
  level: "beginner" | "intermediate" | "advanced" | "expert",
  q: "Your question text",
  a: `Multi-line answer
with code examples`
}
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **localStorage** (zero-backend persistence)
- Pure CSS (no UI framework)
