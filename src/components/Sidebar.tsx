import { Category, Progress, Question } from '../types';
import { GROUPS } from '../data/categories';
import { getStats } from '../hooks/useProgress';

interface SidebarProps {
  active: string;
  questions: Record<string, Question[]>;
  progress: Progress;
  onSelect: (id: string) => void;
}

export default function Sidebar({ active, questions, progress, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      {Object.entries(GROUPS).map(([group, cats]) => (
        <div key={group}>
          <div className="sidebar-group-label">{group}</div>
          {cats.map(cat => (
            <CatItem
              key={cat.id}
              cat={cat}
              active={active === cat.id}
              questions={questions}
              progress={progress}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </aside>
  );
}

function CatItem({
  cat,
  active,
  questions,
  progress,
  onSelect,
}: {
  cat: Category;
  active: boolean;
  questions: Record<string, Question[]>;
  progress: Progress;
  onSelect: (id: string) => void;
}) {
  const qs = questions[cat.id] ?? [];
  const st = getStats(qs, progress);
  const pct = qs.length > 0 ? (st.answered / qs.length) * 100 : 0;

  return (
    <button
      type="button"
      className={`cat-item${active ? ' active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(cat.id)}
    >
      <div className="cat-row">
        <span className="cat-icon">{cat.icon}</span>
        <span className="cat-label">{cat.label}</span>
        <span className="cat-count">{qs.length}</span>
      </div>
      <div className="cat-bar-bg">
        <div className="cat-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {st.answered > 0 && (
        <div className="cat-mini">
          {st.correct  > 0 && <span className="c">✓{st.correct}</span>}
          {st.wrong    > 0 && <span className="w">✗{st.wrong}</span>}
          {st.skipped  > 0 && <span className="s">→{st.skipped}</span>}
        </div>
      )}
    </button>
  );
}
