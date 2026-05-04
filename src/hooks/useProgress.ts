import { useState, useEffect, useCallback } from 'react';
import { Progress, Status, CategoryStats } from '../types';
import { Question } from '../types';

const STORAGE_KEY = 'vincent_interview_prep_v2';

function load(): Progress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    save(progress);
  }, [progress]);

  const mark = useCallback((id: string, status: Status | null) => {
    setProgress(p => {
      const next = { ...p };
      if (status === null) delete next[id];
      else next[id] = status;
      return next;
    });
  }, []);

  const reset = useCallback(() => setProgress({}), []);

  return { progress, mark, reset };
}

export function getStats(questions: Question[], progress: Progress): CategoryStats {
  const total = questions.length;
  const correct = questions.filter(q => progress[q.id] === 'correct').length;
  const wrong = questions.filter(q => progress[q.id] === 'wrong').length;
  const skipped = questions.filter(q => progress[q.id] === 'skipped').length;
  return { total, correct, wrong, skipped, answered: correct + wrong + skipped };
}
