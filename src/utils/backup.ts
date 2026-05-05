import type { Progress, Status } from '../types';
import type { RevealedMap } from '../hooks/useRevealed';

export const BACKUP_VERSION = 1 as const;

export interface BackupPayload {
  version: typeof BACKUP_VERSION;
  progress: Progress;
  revealed: RevealedMap;
}

const STATUSES: Status[] = ['correct', 'wrong', 'skipped'];

function isStatus(v: unknown): v is Status {
  return typeof v === 'string' && STATUSES.includes(v as Status);
}

export function serializeBackup(progress: Progress, revealed: RevealedMap): string {
  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    progress: { ...progress },
    revealed: { ...revealed },
  };
  return JSON.stringify(payload, null, 2);
}

export function parseBackup(raw: string): { ok: true; data: BackupPayload } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'Backup root must be an object.' };
  }
  const o = parsed as Record<string, unknown>;
  if (o.version !== BACKUP_VERSION) {
    return { ok: false, error: `Unsupported backup version: ${String(o.version)}` };
  }
  if (!o.progress || typeof o.progress !== 'object' || Array.isArray(o.progress)) {
    return { ok: false, error: 'Missing or invalid progress object.' };
  }
  const progress: Progress = {};
  for (const [k, v] of Object.entries(o.progress as Record<string, unknown>)) {
    if (!isStatus(v)) return { ok: false, error: `Invalid status for key "${k}"` };
    progress[k] = v;
  }
  if (!o.revealed || typeof o.revealed !== 'object' || Array.isArray(o.revealed)) {
    return { ok: false, error: 'Missing or invalid revealed object.' };
  }
  const revealed: RevealedMap = {};
  for (const [k, v] of Object.entries(o.revealed as Record<string, unknown>)) {
    if (typeof v !== 'boolean') return { ok: false, error: `Invalid revealed flag for "${k}"` };
    revealed[k] = v;
  }
  return { ok: true, data: { version: BACKUP_VERSION, progress, revealed } };
}

export function downloadBackupJson(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.click();
  URL.revokeObjectURL(url);
}
