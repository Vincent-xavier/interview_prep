import type { AnswerSection, Question } from '../types';

/** Shown when a card has no curated interview tip in JSON. */
export const DEFAULT_INTERVIEW_TIP =
  'Practice aloud in about 60–90 seconds: lead with a one-line answer, then 2–4 short beats. Open the reference section for detail or code only if you need it.';

export function getInterviewPresentation(q: Question): {
  tips: string;
  structure: AnswerSection[] | null;
  hasAuthorStructure: boolean;
} {
  const hasAuthorStructure = !!(q.structure && q.structure.length);
  const tips = q.tips?.trim() ? q.tips.trim() : DEFAULT_INTERVIEW_TIP;
  return {
    tips,
    structure: hasAuthorStructure ? q.structure! : null,
    hasAuthorStructure,
  };
}

/** Full-text search across question, answer, tips, and authored structure. */
export function getQuestionSearchBlob(q: Question): string {
  const { tips, structure } = getInterviewPresentation(q);
  const parts = [q.q, q.a, tips];
  if (structure?.length) {
    for (const s of structure) {
      parts.push(s.label, s.text);
    }
  }
  return parts.join('\n').toLowerCase();
}
