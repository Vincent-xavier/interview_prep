import { describe, it, expect } from 'vitest';
import type { Question } from '../types';
import { getStats } from './useProgress';

const qs: Question[] = [
  { id: 'a', level: 'beginner', q: '1', a: 'x' },
  { id: 'b', level: 'beginner', q: '2', a: 'y' },
];

describe('getStats', () => {
  it('counts answered including skipped', () => {
    const s = getStats(qs, { a: 'correct', b: 'skipped' });
    expect(s.total).toBe(2);
    expect(s.correct).toBe(1);
    expect(s.skipped).toBe(1);
    expect(s.answered).toBe(2);
  });
});
