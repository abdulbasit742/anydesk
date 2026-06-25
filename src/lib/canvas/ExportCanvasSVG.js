// ExportCanvasSVG.js — Renders flowchart timeline into downloadable SVG
import { cubicBezierPath, getBestAnchors } from './VectorMath.js';

export function exportCanvasSVG(nodes, edges, options = {}) {
  const {
    padding = 40,
    bgColor = '#0f1117',
    nodeColor = '#1e2130',
    nodeBorder = '#334',
    edgeColor = '#334499',
    textColor = '#e0e0e0',
    fontFamily = 'monospace',
  } = options;

  if (!nodes.length) return '';

  const xs = nodes.flatMap(n => [n.x, n.x + (n.width || 160)]);
  const ys = nodes.flatMap(n => [n.y, n.y + (n.height || 60)]);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const edgePaths = edges.map(e => {
    const srcNode = nodeMap[e.from];
    const dstNode = nodeMap[e.to];
    if (!srcNode || !dstNode) return '';
    const { from, to } = getBestAnchors(srcNode, dstNode);
    const d = cubicBezierPath(
      { x: from.x - minX, y: from.y - minY },
      { x: to.x - minX, y: to.y - minY }
    );
    return `<path d="${d}" stroke="${edgeColor}" stroke-width="2" fill="none" marker-end="url(#arrow)"/>`;
  }).join('\n');

  const nodeRects = nodes.map(n => {
    const x = n.x - minX, y = n.y - minY;
    const w = n.width || 160, h = n.height || 60;
    return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${n.color || nodeColor}" stroke="${nodeBorder}" stroke-width="1.5"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" fill="${textColor}" font-family="${fontFamily}" font-size="13">${escapeXML(n.label || n.id)}</text>
    </g>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${edgeColor}"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${edgePaths}
  ${nodeRects}
</svg>`;
}

function escapeXML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

export function downloadSVG(svgString, filename = 'canvas.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
