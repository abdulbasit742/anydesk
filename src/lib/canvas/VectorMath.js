// VectorMath.js — Spline paths, cubic beziers, and node anchor point calculations
export function lerp(a, b, t) { return a + (b - a) * t; }
export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
export function dist(a, b) { return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); }
export function normalize(v) {
  const len = Math.sqrt(v.x ** 2 + v.y ** 2);
  return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len };
}

export function cubicBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

export function cubicBezierPath(p0, p3, curvature = 0.5) {
  const dx = p3.x - p0.x;
  const p1 = { x: p0.x + dx * curvature, y: p0.y };
  const p2 = { x: p3.x - dx * curvature, y: p3.y };
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}

export function getNodeAnchor(node, side) {
  const { x, y, width = 160, height = 60 } = node;
  const anchors = {
    left: { x, y: y + height / 2 },
    right: { x: x + width, y: y + height / 2 },
    top: { x: x + width / 2, y },
    bottom: { x: x + width / 2, y: y + height },
  };
  return anchors[side] || anchors.right;
}

export function getBestAnchors(nodeA, nodeB) {
  const cx = { a: nodeA.x + (nodeA.width || 160) / 2, b: nodeB.x + (nodeB.width || 160) / 2 };
  const fromSide = cx.a <= cx.b ? 'right' : 'left';
  const toSide = cx.a <= cx.b ? 'left' : 'right';
  return { from: getNodeAnchor(nodeA, fromSide), to: getNodeAnchor(nodeB, toSide) };
}

export function sampleBezier(p0, p1, p2, p3, samples = 20) {
  return Array.from({ length: samples + 1 }, (_, i) =>
    cubicBezier(p0, p1, p2, p3, i / samples)
  );
}
