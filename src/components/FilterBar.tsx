import { DiffFilter, StatusFilter } from '../types';

const LEVELS: { value: DiffFilter; label: string; cls: string }[] = [
  { value: 'all',          label: 'All',          cls: '' },
  { value: 'beginner',     label: 'Beginner',     cls: 'b' },
  { value: 'intermediate', label: 'Intermediate', cls: 'i' },
  { value: 'advanced',     label: 'Advanced',     cls: 'a' },
  { value: 'expert',       label: 'Expert',       cls: 'e' },
];

const STATUSES: { value: StatusFilter; label: string; cls: string }[] = [
  { value: 'all',     label: 'All',           cls: '' },
  { value: 'unseen',  label: 'Unseen',        cls: '' },
  { value: 'correct', label: '✓ Know it',     cls: 'correct' },
  { value: 'wrong',   label: '✗ Review',     cls: 'wrong' },
  { value: 'skipped', label: '→ Skipped',     cls: 'skipped' },
];

interface Props {
  diffFilter: DiffFilter;
  statusFilter: StatusFilter;
  search: string;
  filteredCount: number;
  totalCount: number;
  onDiff: (v: DiffFilter) => void;
  onStatus: (v: StatusFilter) => void;
  onSearch: (v: string) => void;
}

export default function FilterBar({ diffFilter, statusFilter, search, filteredCount, totalCount, onDiff, onStatus, onSearch }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-lbl">Level</span>
        <div className="chips">
          {LEVELS.map(l => (
            <button
              key={l.value}
              className={`chip ${l.cls} ${diffFilter === l.value ? 'active' : ''}`}
              onClick={() => onDiff(l.value)}
            >{l.label}</button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <span className="filter-lbl">Status</span>
        <div className="chips">
          {STATUSES.map(s => (
            <button
              type="button"
              key={s.value}
              className={`chip ${s.cls} ${statusFilter === s.value ? 'active' : ''}`}
              onClick={() => onStatus(s.value)}
            >{s.label}</button>
          ))}
        </div>
      </div>
      <input
        className="search-input"
        placeholder="🔍 Search questions, answers, tips…"
        aria-label="Search questions and answers"
        value={search}
        onChange={e => onSearch(e.target.value)}
      />
      <span className="filter-count">{filteredCount} / {totalCount}</span>
    </div>
  );
}
