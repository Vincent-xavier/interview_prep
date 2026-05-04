export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Status = 'correct' | 'wrong' | 'skipped';
export type StatusFilter = 'all' | 'unseen' | Status;
export type DiffFilter = 'all' | Level;

export interface Question {
  id: string;
  level: Level;
  q: string;
  a: string;
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
