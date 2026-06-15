import { describe, expect, it, vi } from 'vitest';
import { ReconnectManager } from '../src/renderer/src/services/reconnectManager.js';

describe('ReconnectManager', () => {
  it('creates and sends an ICE restart offer', async () => {
    const send = vi.fn(async () => undefined);
    const peer = { createOffer: vi.fn(async () => ({ type: 'offer', sdp: 'v=0' })), setLocalDescription: vi.fn(async () => undefined) } as unknown as RTCPeerConnection;
    const manager = new ReconnectManager({ peer, sendIceRestartOffer: send });
    await manager.restartIce();
    expect(peer.createOffer).toHaveBeenCalledWith({ iceRestart: true });
    expect(send).toHaveBeenCalledWith({ type: 'offer', sdp: 'v=0' });
  });
});
