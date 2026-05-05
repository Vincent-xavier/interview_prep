import { useRef } from 'react';

interface Props {
  onExport: () => void;
  onImportFile: (file: File) => void;
  onClearClick: () => void;
}

export default function DataBackupBar({ onExport, onImportFile, onClearClick }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="data-backup-bar">
      <span className="data-backup-label">Your data</span>
      <button type="button" className="data-backup-btn" onClick={onExport}>
        Export backup
      </button>
      <button
        type="button"
        className="data-backup-btn"
        onClick={() => inputRef.current?.click()}
      >
        Import backup
      </button>
      <input
        ref={inputRef}
        id="backup-file-input"
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        tabIndex={-1}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onImportFile(f);
          e.target.value = '';
        }}
      />
      <button type="button" className="data-backup-btn danger" onClick={onClearClick}>
        Clear progress…
      </button>
    </div>
  );
}
