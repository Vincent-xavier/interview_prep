import { useState, useEffect, useMemo } from 'react';
import type { Question } from '../types';
import { loadQuestionsBundle, type QuestionsBundle } from '../data/questionsLoader';

export function useQuestions() {
  const [bundle, setBundle] = useState<QuestionsBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadQuestionsBundle()
      .then((data) => {
        if (!cancelled) {
          setBundle(data);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message ?? 'Failed to load questions');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allQuestions: Question[] = useMemo(
    () => (bundle ? Object.values(bundle).flat() : []),
    [bundle],
  );

  return { questions: bundle ?? ({} as QuestionsBundle), allQuestions, loading, error };
}
