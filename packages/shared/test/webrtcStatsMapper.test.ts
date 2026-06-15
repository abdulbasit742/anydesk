import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyWebRtcQuality, mapRtcStatsReport } from '../src/webrtc/index.js';

test('webrtc stats mapper aggregates inbound and outbound metrics', () => {
  const snapshot = mapRtcStatsReport('s1', [
    { type: 'outbound-rtp', packetsSent: 10, bytesSent: 1000 },
    { type: 'inbound-rtp', packetsReceived: 20, packetsLost: 1, bytesReceived: 2000 },
    { type: 'candidate-pair', state: 'succeeded', currentRoundTripTime: 0.05, availableOutgoingBitrate: 500000 },
  ], 123);
  assert.equal(snapshot.rttMs, 50);
  assert.equal(snapshot.bytesReceived, 2000);
  assert.equal(classifyWebRtcQuality(snapshot), 'good');
});
