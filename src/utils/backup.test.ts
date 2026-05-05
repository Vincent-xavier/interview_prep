import { describe, it, expect } from 'vitest';
import { parseBackup, serializeBackup } from './backup';

describe('backup', () => {
  it('roundtrips progress and revealed', () => {
    const json = serializeBackup({ r1: 'correct' }, { r1: true });
    const r = parseBackup(json);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.progress.r1).toBe('correct');
      expect(r.data.revealed.r1).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const r = parseBackup(JSON.stringify({ version: 1, progress: { x: 'maybe' }, revealed: {} }));
    expect(r.ok).toBe(false);
  });
});
