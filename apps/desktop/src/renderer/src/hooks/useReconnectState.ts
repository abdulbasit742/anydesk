import { useMemo, useState } from 'react';
import { ReconnectManager, type ReconnectState } from '../services/reconnectManager.js';

export function useReconnectState(input?: { peer?: RTCPeerConnection; sendIceRestartOffer?: (offer: RTCSessionDescriptionInit) => Promise<void> }) {
  const [state, setState] = useState<ReconnectState>({ status: 'idle', attempts: 0 });
  const manager = useMemo(() => {
    if (!input?.peer || !input.sendIceRestartOffer) return undefined;
    return new ReconnectManager({ peer: input.peer, sendIceRestartOffer: input.sendIceRestartOffer, onState: setState });
  }, [input?.peer, input?.sendIceRestartOffer]);

  return { state, manager, reconnectNow: () => void manager?.restartIce(), scheduleReconnect: (reason?: string) => manager?.schedule(reason) };
}
