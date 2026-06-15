import React from 'react';
import { FileTransferProgressRow } from './FileTransferProgressRow.js';
import type { FileTransferItem } from './fileTransferStore.js';

export interface FileTransferQueueProps {
  items: FileTransferItem[];
  onPause(id: string): void;
  onResume(id: string): void;
  onCancel(id: string): void;
  onClearTerminal(): void;
}

export function FileTransferQueue({ items, onPause, onResume, onCancel, onClearTerminal }: FileTransferQueueProps): JSX.Element {
  const hasTerminal = items.some((item) => ['completed', 'failed', 'cancelled', 'rejected'].includes(item.status));
  return (
    <section className="rd-file-transfer-queue" aria-label="File transfer queue">
      <div className="rd-section-header">
        <h3>File transfers</h3>
        {hasTerminal ? <button type="button" onClick={onClearTerminal}>Clear finished</button> : null}
      </div>
      {items.length === 0 ? (
        <p className="rd-empty-state">No active file transfers.</p>
      ) : (
        <div className="rd-file-transfer-queue__items">
          {items.map((item) => (
            <FileTransferProgressRow key={item.id} item={item} onPause={onPause} onResume={onResume} onCancel={onCancel} />
          ))}
        </div>
      )}
    </section>
  );
}
