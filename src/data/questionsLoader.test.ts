import { describe, it, expect } from 'vitest';
import { parseQuestionsBundle } from './questionsLoader';

describe('parseQuestionsBundle', () => {
  it('parses optional tips and structure', () => {
    const bundle = parseQuestionsBundle({
      react: [
        {
          id: 'r1',
          level: 'beginner',
          q: 'Q?',
          a: 'A',
          tips: 'Tip',
          structure: [{ label: 'S', text: 'T' }],
        },
      ],
    });
    expect(bundle.react).toHaveLength(1);
    expect(bundle.react[0].tips).toBe('Tip');
    expect(bundle.react[0].structure?.[0].label).toBe('S');
  });

  it('throws on invalid level', () => {
    expect(() =>
      parseQuestionsBundle({
        react: [{ id: 'x', level: 'nope', q: 'q', a: 'a' }],
      }),
    ).toThrow();
  });
});
