// TelemetryRadar.jsx — Rotating concentric radar scanning connected platform endpoints
import { useEffect, useRef } from 'react';
import { useTelemetryStream } from '../../hooks/useTelemetryStream.js';

export default function TelemetryRadar({ platforms = [], size = 280, intervalMs = 1800 }) {
  const canvasRef = useRef(null);
  const { radarData, tick } = useTelemetryStream(platforms, intervalMs);

  useEffect(() => {
    const cx = size / 2, cy = size / 2, r = size / 2 - 20;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, size, size);

    // Concentric rings
    [0.25, 0.5, 0.75, 1].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * factor, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,255,170,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = 'rgba(0,255,170,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();

    // Sweep line
    const sweepAngle = (tick * 0.08) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, sweepAngle - 0.8, sweepAngle);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,170,0.08)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
    ctx.strokeStyle = 'rgba(0,255,170,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Platform blips
    radarData.forEach(p => {
      const bx = cx + p.x * r;
      const by = cy + p.y * r;
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.status === 'active' ? p.color : '#ff4444';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '9px monospace';
      ctx.fillText(p.label?.slice(0, 6), bx + 6, by + 4);
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00FFAA';
    ctx.fill();
  }, [radarData, tick, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '50%' }} />;
}
