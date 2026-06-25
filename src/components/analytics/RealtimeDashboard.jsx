// RealtimeDashboard.jsx — Live platform metrics overview
import LatencyBar from '../telemetry/latencyBar.jsx';
import { useTelemetryStream } from '../../hooks/useTelemetryStream.js';

export function RealtimeDashboard({ accounts = [] }) {
  const { radarData } = useTelemetryStream(accounts, 2000);

  const platforms = radarData.length ? radarData : accounts.map(a => ({ id: a.id, label: a.label || a.platform, latency: 0, status: 'active' }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'monospace' }}>
      <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Live Latency</div>
      <LatencyBar platforms={platforms} />
    </div>
  );
}
