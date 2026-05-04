import { Question, Status } from '../types';

interface Props {
  question: Question;
  index: number;
  status: Status | undefined;
  revealed: boolean;
  onReveal: () => void;
  onMark: (status: Status | null) => void;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert',
};

export default function QuestionCard({ question, index, status, revealed, onReveal, onMark }: Props) {
  const toggle = (s: Status) => onMark(status === s ? null : s);

  return (
    <div className={`q-card${status ? ` ${status}` : ''}`}>
      <div className="q-card-top">
        <span className="q-num">Q{index + 1}</span>
        <div className="q-body">
          <div className="q-badges">
            <span className={`level-badge ${question.level}`}>{LEVEL_LABELS[question.level]}</span>
            {status && (
              <span className={`status-badge ${status}`}>
                {status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Wrong' : '→ Skipped'}
              </span>
            )}
          </div>
          <div className="q-text">{question.q}</div>
        </div>
      </div>

      <div className="q-card-footer">
        <button className={`reveal-btn${revealed ? ' open' : ''}`} onClick={onReveal}>
          {revealed ? '▲ Hide Answer' : '▼ Show Answer'}
        </button>
        <button className={`mark-btn correct-btn${status === 'correct' ? ' active' : ''}`} onClick={() => toggle('correct')}>✓ Got It</button>
        <button className={`mark-btn wrong-btn${status === 'wrong' ? ' active' : ''}`}   onClick={() => toggle('wrong')}>✗ Missed</button>
        <button className={`mark-btn skip-btn${status === 'skipped' ? ' active' : ''}`}  onClick={() => toggle('skipped')}>→ Skip</button>
      </div>

      {revealed && (
        <div className="answer-box">
          <pre>{question.a}</pre>
        </div>
      )}
    </div>
  );
}
