// SuccessRateChart.jsx — Success/failure trend chart
import { useState } from 'react';
import DeliverabilityChart from '../telemetry/DeliverabilityChart.jsx';

export function SuccessRateChart({ data = [] }) {
  const [chartData] = useState(() => data.length ? data : Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    value: 75 + Math.random() * 25,
  })));

  return (
    <div>
      <DeliverabilityChart data={chartData} width={360} height={120} label="Success Rate %" />
      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontFamily: 'monospace', fontSize: 11, color: '#555' }}>
        <span style={{ color: '#00FF88' }}>● Successful</span>
        <span style={{ color: '#FF4D4D' }}>● Failed</span>
      </div>
    </div>
  );
}
