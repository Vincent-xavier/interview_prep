import { useState } from 'react';
import { MINDSET_DISMISSED_KEY } from '../data/storageKeys';

export default function InterviewMindset() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(MINDSET_DISMISSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(MINDSET_DISMISSED_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <section className="interview-mindset" aria-label="How to use this deck for interviews">
      <div className="interview-mindset-inner">
        <div className="interview-mindset-head">
          <div className="interview-mindset-title">How to use this deck</div>
          <button type="button" className="interview-mindset-dismiss" onClick={dismiss}>
            Dismiss
          </button>
        </div>
        <p className="interview-mindset-lead">
          Cards with author-written “what to say” sections are meant to be practiced out loud in about one minute.
          Everything else still includes full notes below — use those to trim your own script, not as a wall of text in the interview.
        </p>
        <ul className="interview-mindset-list">
          <li><strong>Open</strong> with one sentence that directly answers the question.</li>
          <li><strong>Structure</strong> with 2–4 short beats; pause so they can steer.</li>
          <li><strong>Show judgment</strong>: when you’d use something vs alternatives.</li>
          <li><strong>Behavioral</strong> topics: use STAR (Situation, Task, Action, Result).</li>
        </ul>
      </div>
    </section>
  );
}
