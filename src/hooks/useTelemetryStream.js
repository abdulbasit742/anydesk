// useTelemetryStream.js — Maps dynamic trigonometric radar parameters for real-time telemetry
import { useState, useEffect, useRef } from 'react';

export function useTelemetryStream(platforms = [], intervalMs = 2000) {
  const [radarData, setRadarData] = useState([]);
  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!platforms.length) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      const data = platforms.map((platform, i) => {
        const angle = ((i / platforms.length) * Math.PI * 2) + (t * 0.05);
        const baseRadius = 0.5 + (Math.sin(t * 0.1 + i) * 0.3);
        const jitter = (Math.random() - 0.5) * 0.1;

        return {
          id: platform.id,
          label: platform.label,
          angle,
          radius: Math.max(0.1, Math.min(1, baseRadius + jitter)),
          x: Math.cos(angle) * (baseRadius + jitter),
          y: Math.sin(angle) * (baseRadius + jitter),
          latency: Math.round(80 + Math.random() * 200),
          status: Math.random() > 0.05 ? 'active' : 'degraded',
          color: platform.color || `hsl(${(i * 60) % 360}, 70%, 60%)`,
        };
      });

      setRadarData(data);
      setTick(t);
    }, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [platforms, intervalMs]);

  return { radarData, tick };
}
