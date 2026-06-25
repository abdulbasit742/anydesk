// SplineOptimizer.js — Refines Bezier control points to prevent overlapping vectors
import { dist, normalize } from './VectorMath.js';

export function optimizeControlPoints(from, to, allEdges, nodeList, iterations = 3) {
  let p1 = { x: from.x + (to.x - from.x) * 0.33, y: from.y };
  let p2 = { x: from.x + (to.x - from.x) * 0.66, y: to.y };

  for (let iter = 0; iter < iterations; iter++) {
    const repulsion = computeRepulsion(p1, p2, allEdges, nodeList);
    p1 = { x: p1.x + repulsion.p1.x, y: p1.y + repulsion.p1.y };
    p2 = { x: p2.x + repulsion.p2.x, y: p2.y + repulsion.p2.y };
  }

  return { p1, p2 };
}

function computeRepulsion(p1, p2, edges, nodes) {
  const repulsionStrength = 15;
  const minDist = 30;
  let r1 = { x: 0, y: 0 };
  let r2 = { x: 0, y: 0 };

  for (const node of nodes) {
    const nodeCenter = { x: node.x + (node.width || 160) / 2, y: node.y + (node.height || 60) / 2 };
    const d1 = dist(p1, nodeCenter);
    const d2 = dist(p2, nodeCenter);

    if (d1 < minDist && d1 > 0) {
      const dir = normalize({ x: p1.x - nodeCenter.x, y: p1.y - nodeCenter.y });
      r1.x += dir.x * repulsionStrength * (1 - d1 / minDist);
      r1.y += dir.y * repulsionStrength * (1 - d1 / minDist);
    }
    if (d2 < minDist && d2 > 0) {
      const dir = normalize({ x: p2.x - nodeCenter.x, y: p2.y - nodeCenter.y });
      r2.x += dir.x * repulsionStrength * (1 - d2 / minDist);
      r2.y += dir.y * repulsionStrength * (1 - d2 / minDist);
    }
  }

  return { p1: r1, p2: r2 };
}

export function deduplicateEdges(edges) {
  const seen = new Set();
  return edges.filter(e => {
    const key = [e.from, e.to].sort().join('-');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
