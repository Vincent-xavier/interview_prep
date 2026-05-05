export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Status = 'correct' | 'wrong' | 'skipped';
export type StatusFilter = 'all' | 'unseen' | Status;
export type DiffFilter = 'all' | Level;

/** A spoken “beat” in your answer (e.g. opening, main points, follow-ups). */
export interface AnswerSection {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  level: Level;
  q: string;
  /** Deeper notes, code samples, and study detail — use as backup if they dig in. */
  a: string;
  /** How to frame, time-box, or avoid common mistakes in the room. */
  tips?: string;
  /** What to say out loud, in order — practice this first. */
  structure?: AnswerSection[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  group: string;
}

export interface CategoryStats {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  answered: number;
}

export type Progress = Record<string, Status>;
