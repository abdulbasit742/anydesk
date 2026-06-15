import React from 'react';
import type { FileTransferItem } from './fileTransferStore.js';

export interface FileTransferOfferModalProps {
  offer?: FileTransferItem;
  onAccept(transferId: string): void;
  onReject(transferId: string, reason: string): void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function FileTransferOfferModal({ offer, onAccept, onReject }: FileTransferOfferModalProps): JSX.Element | null {
  if (!offer || offer.status !== 'offered') return null;
  return (
    <div className="rd-modal-backdrop" role="presentation">
      <section className="rd-modal" role="dialog" aria-modal="true" aria-labelledby="file-offer-title">
        <h2 id="file-offer-title">Incoming file transfer</h2>
        <p>A remote peer wants to send a file. Choose where to save it before the transfer starts.</p>
        <dl>
          <dt>File</dt><dd>{offer.fileName}</dd>
          <dt>Size</dt><dd>{formatBytes(offer.size)}</dd>
          {offer.warning ? <><dt>Warning</dt><dd>{offer.warning}</dd></> : null}
        </dl>
        <div className="rd-modal__actions">
          <button type="button" onClick={() => onReject(offer.id, 'receiver rejected')}>Reject</button>
          <button type="button" className="primary" onClick={() => onAccept(offer.id)}>Choose save location and accept</button>
        </div>
      </section>
    </div>
  );
}
