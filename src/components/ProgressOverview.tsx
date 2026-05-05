import { CategoryStats } from '../types';

interface Props { stats: CategoryStats }

export default function ProgressOverview({ stats }: Props) {
  const pct = stats.total > 0 ? Math.round((stats.answered / stats.total) * 100) : 0;
  const t = stats.total;

  return (
    <div className="progress-overview">
      <div className="prog-stat">
        <div className="prog-val total">{stats.total}</div>
        <div className="prog-lbl">Total</div>
      </div>
      <div className="prog-divider" />
      <div className="prog-stat">
        <div className="prog-val correct">{stats.correct}</div>
        <div className="prog-lbl">Know it</div>
      </div>
      <div className="prog-stat">
        <div className="prog-val wrong">{stats.wrong}</div>
        <div className="prog-lbl">Needs review</div>
      </div>
      <div className="prog-stat">
        <div className="prog-val skipped">{stats.skipped}</div>
        <div className="prog-lbl">Skipped</div>
      </div>
      <div className="prog-divider" />
      <div className="prog-bar-wrap">
        <div className="prog-bar-top">
          <span>Cards reviewed</span>
          <span>{pct}%</span>
        </div>
        <div className="prog-bar-bg">
          <div className="prog-bar-seg c" style={{ width: t ? `${stats.correct / t * 100}%` : '0%' }} />
          <div className="prog-bar-seg w" style={{ width: t ? `${stats.wrong / t * 100}%` : '0%' }} />
          <div className="prog-bar-seg s" style={{ width: t ? `${stats.skipped / t * 100}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}
