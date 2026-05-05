import { useState, useEffect, useCallback } from 'react';
import { REVEALED_STORAGE_KEY } from '../data/storageKeys';

export type RevealedMap = Record<string, boolean>;

function load(): RevealedMap {
  try {
    return JSON.parse(localStorage.getItem(REVEALED_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(r: RevealedMap) {
  try {
    localStorage.setItem(REVEALED_STORAGE_KEY, JSON.stringify(r));
  } catch {
    /* ignore quota */
  }
}

export function useRevealed() {
  const [revealed, setRevealed] = useState<RevealedMap>(load);

  useEffect(() => {
    save(revealed);
  }, [revealed]);

  const toggle = useCallback((id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setAll = useCallback((next: RevealedMap) => {
    setRevealed(next);
  }, []);

  const clear = useCallback(() => setRevealed({}), []);

  const setShown = useCallback((id: string, shown: boolean) => {
    setRevealed((prev) => {
      if (prev[id] === shown) return prev;
      return { ...prev, [id]: shown };
    });
  }, []);

  return { revealed, toggle, setAll, clear, setShown };
}
