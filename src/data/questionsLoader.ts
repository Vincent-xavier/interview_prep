import type { AnswerSection, Level, Question } from '../types';

const LEVELS: Set<Level> = new Set(['beginner', 'intermediate', 'advanced', 'expert']);

export type QuestionsBundle = Record<string, Question[]>;

function parseStructure(raw: unknown, ctx: string): AnswerSection[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) throw new Error(`Invalid structure at ${ctx}: expected array`);
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object') throw new Error(`Invalid structure[${i}] at ${ctx}`);
    const s = item as Record<string, unknown>;
    if (typeof s.label !== 'string' || typeof s.text !== 'string') {
      throw new Error(`Invalid structure[${i}] at ${ctx}: need label and text strings`);
    }
    return { label: s.label, text: s.text };
  });
}

function parseQuestion(q: unknown, ctx: string): Question {
  if (!q || typeof q !== 'object') throw new Error(`Invalid question at ${ctx}`);
  const o = q as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.q !== 'string' || typeof o.a !== 'string') {
    throw new Error(`Invalid question fields at ${ctx}`);
  }
  if (typeof o.level !== 'string' || !LEVELS.has(o.level as Level)) {
    throw new Error(`Invalid level at ${ctx}`);
  }
  const tips = o.tips === undefined ? undefined : o.tips;
  if (tips !== undefined && typeof tips !== 'string') {
    throw new Error(`Invalid tips at ${ctx}: expected string`);
  }
  const structure = parseStructure(o.structure, ctx);
  return {
    id: o.id,
    level: o.level as Level,
    q: o.q,
    a: o.a,
    ...(tips !== undefined ? { tips } : {}),
    ...(structure !== undefined && structure.length ? { structure } : {}),
  };
}

export function manifestUrl(): string {
  const base = import.meta.env.BASE_URL;
  if (base.endsWith('/')) return `${base}data/manifest.json`;
  return `${base}/data/manifest.json`;
}

export function categoryDataUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const pathPart = relativePath.replace(/^\//, '');
  return `${base}data/${pathPart}`;
}

interface Manifest {
  version: number;
  categories: string[];
  files: Record<string, string>;
}

export async function loadQuestionsBundle(): Promise<QuestionsBundle> {
  const manRes = await fetch(manifestUrl());
  if (!manRes.ok) throw new Error(`Failed to load manifest (${manRes.status})`);
  const manifest = (await manRes.json()) as Manifest;
  if (!manifest.files || !manifest.categories?.length) {
    throw new Error('Invalid manifest');
  }

  const bundle: QuestionsBundle = {};

  await Promise.all(
    manifest.categories.map(async (cat) => {
      const rel = manifest.files[cat];
      if (!rel) throw new Error(`Manifest missing file mapping for "${cat}"`);
      const url = categoryDataUrl(rel);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${cat} (${res.status})`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(`Invalid category "${cat}": expected array`);
      bundle[cat] = data.map((item, i) => parseQuestion(item, `${cat}[${i}]`));
    }),
  );

  return bundle;
}

/** Test helper: parse bundle object shape like legacy questions.json */
export function parseQuestionsBundle(data: unknown): QuestionsBundle {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid questions: expected a category map object');
  }
  const out: QuestionsBundle = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!Array.isArray(value)) throw new Error(`Invalid category "${key}": expected array`);
    out[key] = value.map((item, i) => parseQuestion(item, `${key}[${i}]`));
  }
  return out;
}
