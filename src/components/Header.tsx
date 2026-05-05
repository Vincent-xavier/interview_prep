import { CategoryStats } from '../types';

interface HeaderProps {
  globalStats: CategoryStats;
}

export default function Header({ globalStats }: HeaderProps) {
  const pct = globalStats.total > 0
    ? Math.round((globalStats.answered / globalStats.total) * 100)
    : 0;

  return (
    <header className="header">
      <div className="header-title">
        <span className="header-title-main">⚡ Interview prep deck</span>
        <span className="header-title-sub">
          Author-written scripts where present; full notes in every card · <span>Vincent Xavier</span>
        </span>
      </div>
      <div className="header-stats">
        <div className="stat-pill"><span className="dot blue" />{globalStats.total} Total</div>
        <div className="stat-pill"><span className="dot green" />{globalStats.correct} Know it</div>
        <div className="stat-pill"><span className="dot red" />{globalStats.wrong} Needs review</div>
        <div className="stat-pill"><span className="dot yellow" />{globalStats.skipped} Skipped</div>
        <div className="stat-pill">{pct}% Reviewed</div>
      </div>
    </header>
  );
}
