import React from 'react';
import { describeTransferStatus, canCancelTransfer, canPauseTransfer, canResumeTransfer } from './fileTransferActions.js';
import { formatEta, formatTransferRate, percentage } from './fileTransferCalculations.js';
import type { FileTransferItem } from './fileTransferStore.js';

export interface FileTransferProgressRowProps {
  item: FileTransferItem;
  onPause(id: string): void;
  onResume(id: string): void;
  onCancel(id: string): void;
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function FileTransferProgressRow({ item, onPause, onResume, onCancel }: FileTransferProgressRowProps): JSX.Element {
  const progress = percentage(item.size, item.transferredBytes);
  return (
    <div className="rd-file-transfer-row" data-transfer-status={item.status}>
      <div className="rd-file-transfer-row__main">
        <strong title={item.fileName}>{item.fileName}</strong>
        <span>{item.direction === 'send' ? 'Sending' : 'Receiving'} · {describeTransferStatus(item)}</span>
      </div>
      <progress value={progress} max={100} aria-label={`${item.fileName} progress`} />
      <div className="rd-file-transfer-row__meta">
        <span>{formatBytes(item.transferredBytes)} / {formatBytes(item.size)}</span>
        <span>{formatTransferRate(item.bytesPerSecond)}</span>
        <span>ETA {formatEta(item.estimatedRemainingMs)}</span>
      </div>
      {item.warning ? <p className="rd-warning">{item.warning}</p> : null}
      {item.error ? <p className="rd-error">{item.error}</p> : null}
      <div className="rd-file-transfer-row__actions">
        {canPauseTransfer(item) ? <button type="button" onClick={() => onPause(item.id)}>Pause</button> : null}
        {canResumeTransfer(item) ? <button type="button" onClick={() => onResume(item.id)}>Resume</button> : null}
        {canCancelTransfer(item) ? <button type="button" className="danger" onClick={() => onCancel(item.id)}>Cancel</button> : null}
      </div>
    </div>
  );
}
