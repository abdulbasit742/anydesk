import React from 'react';
import { FileTransferQueue } from './FileTransferQueue.js';
import { FileTransferOfferModal } from './FileTransferOfferModal.js';
import { useFileTransfer, type UseFileTransferOptions } from './useFileTransfer.js';

export interface FileTransferPanelProps extends UseFileTransferOptions {
  compact?: boolean;
}

export function FileTransferPanel(props: FileTransferPanelProps): JSX.Element {
  const transfer = useFileTransfer(props);
  return (
    <aside className={props.compact ? 'rd-file-transfer-panel compact' : 'rd-file-transfer-panel'}>
      <div className="rd-section-header">
        <div>
          <h2>File transfer</h2>
          <p>Recipient approval is required before incoming files are saved.</p>
        </div>
        <button type="button" className="primary" disabled={!transfer.state.enabled} onClick={() => void transfer.pickAndOfferFiles()}>
          Send file
        </button>
      </div>
      {!transfer.state.enabled ? (
        <p className="rd-warning">File transfer is disabled. Enable it in Desktop Settings before sending or receiving files.</p>
      ) : null}
      <FileTransferQueue
        items={transfer.items}
        onPause={transfer.pause}
        onResume={transfer.resume}
        onCancel={transfer.cancel}
        onClearTerminal={() => transfer.dispatch({ type: 'clear-terminal' })}
      />
      <FileTransferOfferModal offer={transfer.pendingOffer} onAccept={(id) => void transfer.acceptOffer(id)} onReject={transfer.rejectOffer} />
    </aside>
  );
}
