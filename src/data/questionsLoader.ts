import type { Level, Question } from '../types';

const LEVELS: Set<Level> = new Set(['beginner', 'intermediate', 'advanced', 'expert']);

export type QuestionsBundle = Record<string, Question[]>;

function parseQuestion(q: unknown, ctx: string): Question {
  if (!q || typeof q !== 'object') throw new Error(`Invalid question at ${ctx}`);
  const o = q as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.q !== 'string' || typeof o.a !== 'string') {
    throw new Error(`Invalid question fields at ${ctx}`);
  }
  if (typeof o.level !== 'string' || !LEVELS.has(o.level as Level)) {
    throw new Error(`Invalid level at ${ctx}`);
  }
  return { id: o.id, level: o.level as Level, q: o.q, a: o.a };
}

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

export function questionsJsonUrl(): string {
  const base = import.meta.env.BASE_URL;
  if (base.endsWith('/')) return `${base}data/questions.json`;
  return `${base}/data/questions.json`;
}

export async function loadQuestionsBundle(): Promise<QuestionsBundle> {
  const res = await fetch(questionsJsonUrl());
  if (!res.ok) throw new Error(`Failed to load questions (${res.status})`);
  return parseQuestionsBundle(await res.json());
}
