// StepConnector.jsx — SVG arrow connector between workflow step nodes
export function StepConnector({ from, to, color = '#00FFAA44' }) {
  const dx = to.x - from.x;
  const cp1x = from.x + dx * 0.5;
  const cp2x = to.x - dx * 0.5;
  const d = `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;

  return (
    <g>
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={2} markerEnd="url(#arrowhead)" />
    </g>
  );
}
