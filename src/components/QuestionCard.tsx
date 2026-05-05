import { Question, Status } from '../types';
import { getInterviewPresentation } from '../utils/questionEnrichment';

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
  const pres = getInterviewPresentation(question);

  return (
    <div
      id={`question-${question.id}`}
      className={`q-card${status ? ` ${status}` : ''}`}
    >
      <div className="q-card-top">
        <span className="q-num">Q{index + 1}</span>
        <div className="q-body">
          <div className="q-badges">
            <span className={`level-badge ${question.level}`}>{LEVEL_LABELS[question.level]}</span>
            {status && (
              <span className={`status-badge ${status}`}>
                {status === 'correct' ? '✓ Know it' : status === 'wrong' ? '✗ Needs review' : '→ Skipped'}
              </span>
            )}
          </div>
          <div className="q-text">{question.q}</div>
        </div>
      </div>

      <div className="q-card-footer">
        <button
          type="button"
          className={`reveal-btn${revealed ? ' open' : ''}`}
          onClick={onReveal}
          aria-expanded={revealed}
        >
          {revealed ? '▲ Hide answer' : '▼ Show answer'}
        </button>
        <button type="button" className={`mark-btn correct-btn${status === 'correct' ? ' active' : ''}`} onClick={() => toggle('correct')}>✓ Know it</button>
        <button type="button" className={`mark-btn wrong-btn${status === 'wrong' ? ' active' : ''}`}   onClick={() => toggle('wrong')}>✗ Needs review</button>
        <button type="button" className={`mark-btn skip-btn${status === 'skipped' ? ' active' : ''}`}  onClick={() => toggle('skipped')}>→ Skip for now</button>
      </div>

      {revealed && (
        <div className="answer-box">
          <div className="answer-tips">
            <div className="answer-block-label">Interview tip</div>
            <p className="answer-tips-text">{pres.tips}</p>
          </div>

          {pres.structure && pres.structure.length > 0 && (
            <div className="answer-structure">
              <div className="answer-block-label answer-block-label--primary">What to say (practice this first)</div>
              {pres.structure.map((section, i) => (
                <div key={i} className="answer-section">
                  <div className="answer-section-label">{section.label}</div>
                  <p className="answer-section-text">{section.text}</p>
                </div>
              ))}
            </div>
          )}

          <details
            className="answer-details"
            open={!(pres.hasAuthorStructure)}
          >
            <summary>
              {pres.hasAuthorStructure
                ? 'Reference: deeper notes & code examples'
                : 'Full notes & examples (trim into a spoken answer)'}
            </summary>
            <pre>{question.a}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
