import { describe, it, expect } from 'vitest';
import type { Question } from '../types';
import {
  DEFAULT_INTERVIEW_TIP,
  getInterviewPresentation,
  getQuestionSearchBlob,
} from './questionEnrichment';

const baseQ = (): Question => ({
  id: 't1',
  level: 'beginner',
  q: 'What is X?',
  a: 'X is a concept.\n\nDetails here.',
});

describe('getInterviewPresentation', () => {
  it('uses default tip when none authored', () => {
    const pres = getInterviewPresentation(baseQ());
    expect(pres.tips).toBe(DEFAULT_INTERVIEW_TIP);
    expect(pres.structure).toBeNull();
    expect(pres.hasAuthorStructure).toBe(false);
  });

  it('preserves authored tip and structure', () => {
    const q: Question = {
      ...baseQ(),
      tips: 'Say Y first.',
      structure: [{ label: 'Open', text: 'Hello' }],
    };
    const pres = getInterviewPresentation(q);
    expect(pres.tips).toBe('Say Y first.');
    expect(pres.structure).toHaveLength(1);
    expect(pres.hasAuthorStructure).toBe(true);
  });
});

describe('getQuestionSearchBlob', () => {
  it('includes question, answer, tips, and authored structure text', () => {
    const q: Question = {
      ...baseQ(),
      tips: 'Tip text',
      structure: [{ label: 'L', text: 'Body' }],
    };
    const blob = getQuestionSearchBlob(q);
    expect(blob).toContain('what is x');
    expect(blob).toContain('concept');
    expect(blob).toContain('tip text');
    expect(blob).toContain('body');
  });
});
