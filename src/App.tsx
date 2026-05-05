import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DiffFilter, StatusFilter, Status } from './types';
import { CATEGORIES } from './data/categories';
import { useProgress, getStats } from './hooks/useProgress';
import { useQuestions } from './hooks/useQuestions';
import { useRevealed } from './hooks/useRevealed';
import { getQuestionSearchBlob } from './utils/questionEnrichment';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProgressOverview from './components/ProgressOverview';
import FilterBar from './components/FilterBar';
import InterviewMindset from './components/InterviewMindset';
import QuestionCard from './components/QuestionCard';
import DataBackupBar from './components/DataBackupBar';
import ConfirmModal from './components/ConfirmModal';
import {
  serializeBackup,
  parseBackup,
  downloadBackupJson,
  type BackupPayload,
} from './utils/backup';

export default function App() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightQ = searchParams.get('q');

  const validCat = Boolean(categoryId && CATEGORIES.some(c => c.id === categoryId));
  const activeCategory = validCat ? categoryId! : 'react';

  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [importPayload, setImportPayload] = useState<BackupPayload | null>(null);

  const { progress, mark, reset, replace } = useProgress();
  const { revealed, toggle, setAll: setRevealedAll, clear: clearRevealed, setShown } = useRevealed();
  const { questions: QUESTIONS, allQuestions: ALL_QUESTIONS, loading, error } = useQuestions();

  useEffect(() => {
    if (!validCat) navigate('/study/react', { replace: true });
  }, [validCat, navigate]);

  const globalStats = useMemo(() => getStats(ALL_QUESTIONS, progress), [ALL_QUESTIONS, progress]);

  const catQuestions = useMemo(() => QUESTIONS[activeCategory] ?? [], [QUESTIONS, activeCategory]);

  const filtered = useMemo(
    () =>
      catQuestions.filter(q => {
        if (diffFilter !== 'all' && q.level !== diffFilter) return false;
        if (statusFilter === 'unseen' && progress[q.id]) return false;
        if (statusFilter !== 'all' && statusFilter !== 'unseen' && progress[q.id] !== statusFilter)
          return false;
        if (search) {
          const blob = getQuestionSearchBlob(q);
          if (!blob.includes(search.toLowerCase())) return false;
        }
        return true;
      }),
    [catQuestions, diffFilter, statusFilter, search, progress],
  );

  const handleSelect = useCallback(
    (id: string) => {
      navigate(`/study/${id}`);
      setDiffFilter('all');
      setStatusFilter('all');
      setSearch('');
    },
    [navigate],
  );

  const handleReveal = useCallback(
    (id: string) => {
      toggle(id);
    },
    [toggle],
  );

  const handleMark = useCallback(
    (id: string, status: Status | null) => {
      mark(id, status);
    },
    [mark],
  );

  const handleExport = useCallback(() => {
    const json = serializeBackup(progress, revealed);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadBackupJson(`interview-prep-backup-${stamp}.json`, json);
  }, [progress, revealed]);

  const handleImportFile = useCallback(async (file: File) => {
    const text = await file.text();
    const result = parseBackup(text);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    setImportPayload(result.data);
  }, []);

  const applyImport = useCallback(() => {
    if (!importPayload) return;
    replace(importPayload.progress);
    setRevealedAll(importPayload.revealed);
    setImportPayload(null);
  }, [importPayload, replace, setRevealedAll]);

  const handleClearConfirm = useCallback(() => {
    reset();
    clearRevealed();
    setClearModalOpen(false);
  }, [reset, clearRevealed]);

  useEffect(() => {
    if (!highlightQ || loading) return;
    setShown(highlightQ, true);
    const id = window.requestAnimationFrame(() => {
      document.getElementById(`question-${highlightQ}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [highlightQ, loading, activeCategory, setShown]);

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  if (loading) {
    return (
      <div className="app app--loading">
        <div className="load-panel">
          <div className="load-spinner" aria-hidden />
          <p>Loading questions…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app app--loading">
        <div className="load-panel load-panel--error">
          <p>Could not load question data.</p>
          <p className="load-detail">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header globalStats={globalStats} />
      <div className="body">
        <Sidebar active={activeCategory} questions={QUESTIONS} progress={progress} onSelect={handleSelect} />
        <main className="main">
          <ProgressOverview stats={globalStats} />
          <DataBackupBar
            onExport={handleExport}
            onImportFile={handleImportFile}
            onClearClick={() => setClearModalOpen(true)}
          />
          <InterviewMindset />

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

      <ConfirmModal
        open={clearModalOpen}
        title="Clear all progress?"
        message="This removes every card status and reveal state from this browser. Export a backup first if you care about your history."
        confirmLabel="Clear everything"
        cancelLabel="Keep data"
        danger
        onConfirm={handleClearConfirm}
        onCancel={() => setClearModalOpen(false)}
      />

      <ConfirmModal
        open={!!importPayload}
        title="Replace local data?"
        message="This will overwrite progress and which answers were revealed with the contents of the backup file."
        confirmLabel="Replace data"
        cancelLabel="Cancel"
        danger
        onConfirm={applyImport}
        onCancel={() => setImportPayload(null)}
      />
    </div>
  );
}
