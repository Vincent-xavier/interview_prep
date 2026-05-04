import { useState, useCallback, useMemo } from 'react';
import { DiffFilter, StatusFilter, Status } from './types';
import { CATEGORIES } from './data/categories';
import { QUESTIONS, ALL_QUESTIONS } from './data/questions';
import { useProgress, getStats } from './hooks/useProgress';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProgressOverview from './components/ProgressOverview';
import FilterBar from './components/FilterBar';
import QuestionCard from './components/QuestionCard';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('react');
  const [diffFilter, setDiffFilter]     = useState<DiffFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch]             = useState('');
  const [revealed, setRevealed]         = useState<Record<string, boolean>>({});
  const [resetConfirm, setResetConfirm] = useState(false);

  const { progress, mark, reset } = useProgress();

  const globalStats = useMemo(() => getStats(ALL_QUESTIONS, progress), [progress]);

  const catQuestions = useMemo(() => QUESTIONS[activeCategory] ?? [], [activeCategory]);

  const filtered = useMemo(() => catQuestions.filter(q => {
    if (diffFilter !== 'all' && q.level !== diffFilter) return false;
    if (statusFilter === 'unseen' && progress[q.id]) return false;
    if (statusFilter !== 'all' && statusFilter !== 'unseen' && progress[q.id] !== statusFilter) return false;
    if (search && !q.q.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [catQuestions, diffFilter, statusFilter, search, progress]);

  const handleSelect = useCallback((id: string) => {
    setActiveCategory(id);
    setDiffFilter('all');
    setStatusFilter('all');
    setSearch('');
  }, []);

  const handleReveal = useCallback((id: string) => {
    setRevealed(r => ({ ...r, [id]: !r[id] }));
  }, []);

  const handleMark = useCallback((id: string, status: Status | null) => {
    mark(id, status);
  }, [mark]);

  const handleReset = () => {
    if (resetConfirm) {
      reset();
      setRevealed({});
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="app">
      <Header
        globalStats={globalStats}
        onReset={handleReset}
      />
      <div className="body">
        <Sidebar active={activeCategory} progress={progress} onSelect={handleSelect} />
        <main className="main">
          <ProgressOverview stats={globalStats} />

          <div className="cat-title-row">
            <h2>{activeCat?.icon} {activeCat?.label}</h2>
            <span className="cat-badge">{filtered.length} / {catQuestions.length} questions</span>
          </div>

          <FilterBar
            diffFilter={diffFilter}
            statusFilter={statusFilter}
            search={search}
            filteredCount={filtered.length}
            totalCount={catQuestions.length}
            onDiff={setDiffFilter}
            onStatus={setStatusFilter}
            onSearch={setSearch}
          />

          <div className="q-grid">
            {filtered.length === 0 ? (
              <div className="no-results">
                <div className="emoji">🔍</div>
                <div>No questions match your filter.</div>
              </div>
            ) : (
              filtered.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  status={progress[q.id]}
                  revealed={!!revealed[q.id]}
                  onReveal={() => handleReveal(q.id)}
                  onMark={s => handleMark(q.id, s)}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
