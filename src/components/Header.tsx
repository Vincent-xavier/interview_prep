import { CategoryStats } from '../types';

interface HeaderProps {
  globalStats: CategoryStats;
  onReset: () => void;
}

export default function Header({ globalStats, onReset }: HeaderProps) {
  const pct = globalStats.total > 0
    ? Math.round((globalStats.answered / globalStats.total) * 100)
    : 0;

  return (
    <header className="header">
      <div className="header-title">
        ⚡ Interview Prep — <span>Vincent Xavier</span>
      </div>
      <div className="header-stats">
        <div className="stat-pill"><span className="dot blue" />{globalStats.total} Total</div>
        <div className="stat-pill"><span className="dot green" />{globalStats.correct} Correct</div>
        <div className="stat-pill"><span className="dot red" />{globalStats.wrong} Wrong</div>
        <div className="stat-pill"><span className="dot yellow" />{globalStats.skipped} Skipped</div>
        <div className="stat-pill">{pct}% Done</div>
        <button className="reset-btn" onClick={onReset}>↺ Reset</button>
      </div>
    </header>
  );
}
