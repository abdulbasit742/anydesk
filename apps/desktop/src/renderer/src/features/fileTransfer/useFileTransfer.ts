import { useCallback, useMemo, useReducer } from 'react';
import { createFileTransferItem, fileTransferReducer, initialFileTransferState, selectFileTransferItems } from './fileTransferStore.js';
import { DEFAULT_FILE_TRANSFER_POLICY, evaluateFileAgainstPolicy, type FileTransferPolicy } from './fileTransferPolicy.js';
import type { DesktopAuditEmitter } from '../../services/auditEmitter.js';
import type { FileTransferChannel } from '../../services/fileTransferChannel.js';
import { FileTransferSender } from '../../services/fileTransferSender.js';
import { FileTransferReceiver, type IncomingFileOffer } from '../../services/fileTransferReceiver.js';

export interface UseFileTransferOptions {
  channel?: FileTransferChannel;
  policy?: FileTransferPolicy;
  audit?: DesktopAuditEmitter;
}

export function useFileTransfer(options: UseFileTransferOptions = {}) {
  const policy = options.policy ?? DEFAULT_FILE_TRANSFER_POLICY;
  const [state, dispatch] = useReducer(fileTransferReducer, { ...initialFileTransferState, enabled: policy.enabled });

  const sender = useMemo(() => {
    if (!options.channel || !window.remoteDeskFileTransfer) return undefined;
    return new FileTransferSender({
      channel: options.channel,
      readChunk: window.remoteDeskFileTransfer.readFileChunk,
      onProgress: ({ transferId, bytesSent, chunkIndex }) => dispatch({ type: 'progress', id: transferId, bytes: bytesSent, chunkIndex }),
      onFailed: ({ transferId, error }) => dispatch({ type: 'failed', id: transferId, error }),
    });
  }, [options.channel]);

  const receiver = useMemo(() => {
    if (!options.channel || !window.remoteDeskFileTransfer) return undefined;
    return new FileTransferReceiver({
      channel: options.channel,
      writeChunk: window.remoteDeskFileTransfer.writeReceivedChunk,
      finalizeFile: window.remoteDeskFileTransfer.finalizeReceivedFile,
      onOffer: (offer: IncomingFileOffer) => {
        const decision = evaluateFileAgainstPolicy({ name: offer.fileName, size: offer.size }, policy);
        const item = createFileTransferItem({
          id: offer.transferId,
          direction: 'receive',
          fileName: offer.fileName,
          size: offer.size,
          mimeType: offer.mimeType,
          checksum: offer.checksum,
          chunkSize: offer.chunkSize,
          status: decision.allowed ? 'offered' : 'rejected',
          warning: decision.reasons.join(' '),
        });
        dispatch({ type: 'offer-received', item });
        void options.audit?.emit({ type: 'file_transfer.offered', category: 'file_transfer', metadata: { transferId: offer.transferId, fileName: offer.fileName, size: offer.size } });
        if (!decision.allowed) receiver?.reject(offer.transferId, decision.reasons.join(' '));
      },
      onProgress: ({ transferId, receivedBytes, chunkIndex }) => dispatch({ type: 'progress', id: transferId, bytes: receivedBytes, chunkIndex }),
      onComplete: ({ transferId, checksum }) => dispatch({ type: 'completed', id: transferId, checksum }),
      onFailed: ({ transferId, error }) => dispatch({ type: 'failed', id: transferId, error }),
    });
  }, [options.channel, options.audit, policy]);

  const items = selectFileTransferItems(state);

  const pickAndOfferFiles = useCallback(async () => {
    if (!window.remoteDeskFileTransfer || !sender) return;
    const picked = await window.remoteDeskFileTransfer.pickFiles({ allowMultiple: true, maxBytes: policy.maxFileBytes });
    for (const file of picked) {
      const decision = evaluateFileAgainstPolicy(file, policy);
      const id = `ft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const item = createFileTransferItem({
        id,
        direction: 'send',
        fileName: file.name,
        size: file.size,
        mimeType: file.mimeType,
        sourcePathToken: file.pathToken,
        chunkSize: 64 * 1024,
        status: decision.allowed ? 'waiting-for-acceptance' : 'failed',
        warning: decision.reasons.join(' '),
        error: decision.allowed ? undefined : decision.reasons.join(' '),
      });
      dispatch({ type: 'offer-created', item });
      if (!decision.allowed) continue;
      sender.offer({ transferId: id, fileName: file.name, size: file.size, mimeType: file.mimeType, pathToken: file.pathToken, chunkSize: item.chunkSize });
      void options.audit?.emit({ type: 'file_transfer.offered', category: 'file_transfer', metadata: { transferId: id, fileName: file.name, size: file.size } });
    }
  }, [sender, policy, options.audit]);

  const acceptOffer = useCallback(async (transferId: string) => {
    const item = state.items[transferId];
    if (!item || !window.remoteDeskFileTransfer || !receiver) return;
    const target = await window.remoteDeskFileTransfer.chooseSaveTarget({ transferId, fileName: item.fileName, size: item.size });
    if (!target.accepted || !target.pathToken) {
      dispatch({ type: 'rejected', id: transferId, reason: 'save target not selected' });
      receiver.reject(transferId, 'save target not selected');
      return;
    }
    dispatch({ type: 'accepted', id: transferId, saveTargetToken: target.pathToken });
    receiver.accept(transferId, target.pathToken);
    void options.audit?.emit({ type: 'file_transfer.accepted', category: 'file_transfer', metadata: { transferId, fileName: item.fileName, size: item.size } });
  }, [state.items, receiver, options.audit]);

  const rejectOffer = useCallback((transferId: string, reason: string) => {
    receiver?.reject(transferId, reason);
    dispatch({ type: 'rejected', id: transferId, reason });
    void options.audit?.emit({ type: 'file_transfer.rejected', category: 'file_transfer', metadata: { transferId, reason } });
  }, [receiver, options.audit]);

  return {
    state,
    items,
    pendingOffer: items.find((item) => item.direction === 'receive' && item.status === 'offered'),
    dispatch,
    pickAndOfferFiles,
    acceptOffer,
    rejectOffer,
    pause: (id: string) => { sender?.pause(id); dispatch({ type: 'paused', id }); },
    resume: (id: string) => { sender?.resume(id); dispatch({ type: 'resumed', id }); },
    cancel: (id: string) => { sender?.cancel(id); dispatch({ type: 'cancelled', id, reason: 'cancelled by user' }); },
  };
}
